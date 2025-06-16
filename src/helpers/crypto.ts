import type { Serializable } from "../types/data";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

/**
 * Encodes a Uint8Array to a Base64 string
 */
export function b64encode(buf: Uint8Array): string {
  return btoa(String.fromCharCode(...buf));
}

/**
 * Decodes a Base64 string to a Uint8Array
 */
export function b64decode(str: string): Uint8Array {
  return Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
}

export function generateIV(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(12)); // AES-GCM 96-bit IV
}

/**
 * Derives a 256-bit AES-GCM key from a password and a salt using PBKDF2
 */
export async function deriveKey(
  password: string,
  salt: Uint8Array,
): Promise<CryptoKey> {
  const baseKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100_000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

/**
 * Encrypts a JSON-serializable object using AES-GCM
 * Returns ciphertext and IV as base64-encoded strings
 */
export async function encryptData(
  data: Serializable,
  key: CryptoKey,
): Promise<{ iv: string; ciphertext: string }> {
  const iv = generateIV();
  const plaintext = encoder.encode(JSON.stringify(data));

  const ciphertextBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    plaintext,
  );

  return {
    iv: b64encode(iv),
    ciphertext: b64encode(new Uint8Array(ciphertextBuffer)),
  };
}

/**
 * Decrypts AES-GCM ciphertext using provided base64-encoded IV and key
 * Returns the parsed original object
 */
export async function decryptData(
  ciphertextB64: string,
  ivB64: string,
  key: CryptoKey,
): Promise<Serializable> {
  const iv = b64decode(ivB64);
  const ciphertext = b64decode(ciphertextB64);

  const plaintextBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext,
  );

  const plaintext = decoder.decode(plaintextBuffer);
  return JSON.parse(plaintext);
}

/**
 * Generates a secure 128-bit salt and returns both raw and base64 representations
 */
export function generateSalt(): { raw: Uint8Array; base64: string } {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return { raw: salt, base64: b64encode(salt) };
}
