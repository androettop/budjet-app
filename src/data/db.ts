import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  collection,
  Firestore,
  Timestamp,
  query,
  QueryConstraint,
} from "firebase/firestore";
import {
  deriveKey,
  encryptData,
  decryptData,
  b64decode,
} from "../helpers/crypto";
import type { SerializableObject } from "../types/data";

type Metadata = {
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

type FirestoreDoc = {
  iv: string;
  ciphertext: string;
  metadata: Metadata;
};

export class EncryptedDB {
  private static instance: EncryptedDB;
  private db: Firestore;
  private uid: string;
  private key: CryptoKey | null = null;

  private constructor(db: Firestore, uid: string) {
    this.db = db;
    this.uid = uid;
  }

  static async unlock(
    db: Firestore,
    uid: string,
    masterPassword: string,
  ): Promise<EncryptedDB> {
    if (!EncryptedDB.instance) {
      EncryptedDB.instance = new EncryptedDB(db, uid);
    }

    const encryptedDB = EncryptedDB.instance;
    if (encryptedDB.key) return encryptedDB;

    const userDocRef = doc(db, "users", uid);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) throw new Error("User profile not found");

    const { salt, authCheck } = snap.data();
    if (!salt || !authCheck) throw new Error("Missing encryption metadata");

    const key = await deriveKey(masterPassword, b64decode(salt));
    const check = await decryptData(
      authCheck.ciphertext,
      authCheck.iv,
      key,
    ).catch(() => null);
    if (check !== "OK") throw new Error("Invalid master password");

    encryptedDB.key = key;
    return encryptedDB;
  }

  static getInstance(): EncryptedDB {
    if (!EncryptedDB.instance || !EncryptedDB.instance.key) {
      throw new Error("EncryptedDB is not unlocked");
    }
    return EncryptedDB.instance;
  }

  async getDoc(
    path: string,
    ...pathSegments: string[]
  ): Promise<{ data: SerializableObject; metadata: Metadata }> {
    const ref = doc(this.db, path, ...pathSegments);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("Document not found");

    const { iv, ciphertext, metadata } = snap.data() as FirestoreDoc;
    const data = (await decryptData(
      ciphertext,
      iv,
      this.key!,
    )) as SerializableObject; // decrypted data is always an object
    return { data, metadata };
  }

  async setDoc(
    data: SerializableObject,
    path: string,
    ...pathSegments: string[]
  ): Promise<void> {
    const ref = doc(this.db, path, ...pathSegments);
    const { iv, ciphertext } = await encryptData(data, this.key!);
    const payload: FirestoreDoc = {
      iv,
      ciphertext,
      metadata: {
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
    };
    await setDoc(ref, payload);
  }

  async updateDoc(
    newData: SerializableObject,
    path: string,
    ...pathSegments: string[]
  ): Promise<void> {
    const ref = doc(this.db, path, ...pathSegments);
    const { data: currentData } = await this.getDoc(path, ...pathSegments);
    const updatedData: SerializableObject = { ...currentData, ...newData };
    const { iv, ciphertext } = await encryptData(updatedData, this.key!);
    await updateDoc(ref, {
      iv,
      ciphertext,
      "metadata.updatedAt": Timestamp.now(),
    });
  }

  async getDocs(
    collectionName: string,
    ...filters: QueryConstraint[]
  ): Promise<{ data: SerializableObject; metadata: Metadata; id: string }[]> {
    const colRef = collection(this.db, "users", this.uid, collectionName);
    const q = query(colRef, ...filters);
    const snapshot = await getDocs(q);
    const results = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const { iv, ciphertext, metadata } = docSnap.data() as FirestoreDoc;
        const data = (await decryptData(
          ciphertext,
          iv,
          this.key!,
        )) as SerializableObject;
        return { data, metadata, id: docSnap.id };
      }),
    );
    return results;
  }
}
