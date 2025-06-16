import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  QueryConstraint,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import {
  b64decode,
  decryptData,
  deriveKey,
  encryptData,
  generateSalt,
} from "../helpers/crypto";
import type { SerializableObject } from "../types/data";
import { CodedError, errorCodes } from "../helpers/errors";

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

  /**
   * Be careful when using this method, as it will overwrite the master password and generate a new salt and OK check.
   * Existing encrypted data will become undecryptable.
   */
  static async newMasterPassword(
    db: Firestore,
    uid: string,
    newPassword: string,
  ): Promise<void> {
    const salt = generateSalt();
    const newKey = await deriveKey(newPassword, salt.raw);

    const { iv: ivB64, ciphertext } = await encryptData("OK", newKey);

    await setDoc(doc(db, "authChecks", uid), {
      salt: salt.base64,
      authCheck: {
        iv: ivB64,
        ciphertext,
      },
    });
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

    const authCheckRef = doc(db, "authChecks", uid);
    const snap = await getDoc(authCheckRef);
    if (!snap.exists())
      throw new CodedError(errorCodes.AUTH_INFO_NOT_INITIALIZED);

    const { salt, authCheck } = snap.data();
    if (!salt || !authCheck)
      throw new CodedError(errorCodes.AUTH_INFO_NOT_INITIALIZED);

    const key = await deriveKey(masterPassword, b64decode(salt));
    const check = await decryptData(
      authCheck.ciphertext,
      authCheck.iv,
      key,
    ).catch(() => null);
    if (check !== "OK")
      throw new CodedError(errorCodes.INVALID_MASTER_PASSWORD);

    encryptedDB.key = key;
    return encryptedDB;
  }

  static getInstance(): EncryptedDB {
    if (!EncryptedDB.instance || !EncryptedDB.instance.key) {
      throw new CodedError(errorCodes.DB_IS_LOCKED);
    }
    return EncryptedDB.instance;
  }

  async getDoc(
    path: string,
    ...pathSegments: string[]
  ): Promise<{ data: SerializableObject; metadata: Metadata }> {
    const ref = doc(this.db, path, ...pathSegments);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new CodedError(errorCodes.DOC_NOT_FOUND);

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
    filters: QueryConstraint[],
    path: string,
    ...pathSegments: string[]
  ): Promise<{ data: SerializableObject; metadata: Metadata; id: string }[]> {
    const colRef = collection(this.db, path, ...pathSegments);
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
