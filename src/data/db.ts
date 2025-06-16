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
import { fbDb } from "../helpers/firebase";

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
  private static instance: EncryptedDB | null = null;
  private static db: Firestore = fbDb;
  private key: CryptoKey | null = null;

  private constructor() {}

  /**
   * Check if the database is locked.
   * @returns True if the database is locked, false otherwise.
   */
  static isLocked(): boolean {
    return !EncryptedDB.instance?.key;
  }

  /**
   * Be careful when using this method, as it will overwrite the master password and generate a new salt and OK check.
   * Existing encrypted data will become undecryptable.
   */
  static async newMasterPassword(
    uid: string,
    newPassword: string,
  ): Promise<void> {
    const salt = generateSalt();
    const newKey = await deriveKey(newPassword, salt.raw);

    const { iv: ivB64, ciphertext } = await encryptData("OK", newKey);

    await setDoc(doc(EncryptedDB.db, "authChecks", uid), {
      salt: salt.base64,
      authCheck: {
        iv: ivB64,
        ciphertext,
      },
    });
  }

  /**
   * Unlock the encrypted database using the master password.
   * @param uid The user ID.
   * @param askForMasterPassword A function that prompts the user for the master password.
   * @throws {CodedError} If the master password is incorrect. Possible error codes: AUTH_INFO_NOT_INITIALIZED, INVALID_MASTER_PASSWORD.
   */
  static async unlock(
    uid: string,
    askForMasterPassword: () => Promise<string>,
  ): Promise<void> {
    const encryptedDB: EncryptedDB = EncryptedDB.instance || new EncryptedDB();

    if (encryptedDB.key) {
      console.log("Database already unlocked");
      return;
    }

    const authCheckRef = doc(EncryptedDB.db, "authChecks", uid);
    const snap = await getDoc(authCheckRef);
    if (!snap.exists())
      throw new CodedError(errorCodes.AUTH_INFO_NOT_INITIALIZED);

    const { salt, authCheck } = snap.data();
    if (!salt || !authCheck)
      throw new CodedError(errorCodes.AUTH_INFO_NOT_INITIALIZED);

    const masterPassword = await askForMasterPassword();
    const key = await deriveKey(masterPassword, b64decode(salt));
    const check = await decryptData(
      authCheck.ciphertext,
      authCheck.iv,
      key,
    ).catch(() => null);
    if (check !== "OK")
      throw new CodedError(errorCodes.INVALID_MASTER_PASSWORD);

    encryptedDB.key = key;
    EncryptedDB.instance = encryptedDB;
  }

  /**
   * Lock the database.
   */
  static lock() {
    if (!EncryptedDB.instance || !EncryptedDB.instance.key) {
      console.warn("Database is already locked");
    } else {
      EncryptedDB.instance = null;
    }
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
    const ref = doc(EncryptedDB.db, path, ...pathSegments);
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
    const ref = doc(EncryptedDB.db, path, ...pathSegments);
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
    const ref = doc(EncryptedDB.db, path, ...pathSegments);
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
    const colRef = collection(EncryptedDB.db, path, ...pathSegments);
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
