# BudJet

BudJet is a simple web application for tracking monthly expenses and revenues. It is built with **React**, **TypeScript** and **Vite**, and uses **Firebase** for authentication and data storage.

## Running the project

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173` by default.
3. Build for production:
   ```bash
   npm run build
   ```
4. Lint the source code (optional):
   ```bash
   npm run lint
   ```

## Technical overview

### Key components

- **Database**: Uses **Firebase Firestore**. Each user's movements are stored under `/users/{uid}/movements`. Security rules ensure that only that user can access and modify their documents.
- **Authentication**: Managed by Firebase Authentication with the Google provider.
- **Client-side encryption**: Before saving a movement, the app encrypts it right in the browser. We use AES‑GCM with a 256‑bit key derived from your master password using PBKDF2 (SHA‑256, 100k iterations). Each entry includes the ciphertext, a random IV and timestamps.
- **Master password validation**: The password itself is never stored. Firestore only keeps a per‑user salt and a tiny encrypted token to check whether your password is correct. The derived key lives temporarily in `sessionStorage` while the session is unlocked.

### Why this encryption helps

- Keeps data private even if Firestore were compromised.
- Password checks stay local, so the secret never leaves your browser.

### Where it could fall short

- Using a weak password might allow offline brute-force attacks.
- If someone gains access to your unlocked device or session, they can read the data.

Even with these caveats, AES‑GCM with PBKDF2 offers strong protection for everyday use without making the app hard to use.

### Source structure
  - `src/helpers/crypto.ts` provides cryptographic helpers.
  - `src/data/db.ts` implements the `EncryptedDB` class to wrap Firestore reads and writes with encryption and decryption.
  - Components and hooks under `src/` handle login, dialogs, locking/unlocking and displaying movements.

