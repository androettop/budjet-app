import { signInWithPopup } from "firebase/auth";
import { fbAuth, googleProvider } from "../helpers/firebase";
import { EncryptedDB } from "../data/db";
import { errorCodes, type CodedError } from "../helpers/errors";

const FirebaseSandboxPage = () => {
  const handleLogin = async () => {
    const credentials = await signInWithPopup(fbAuth, googleProvider);
    try {
      await EncryptedDB.unlock(credentials.user.uid, async () => {
        return new Promise((resolve) => {
          while (true) {
            const masterPassword = window
              .prompt("Write your master password")
              ?.trim();
            if (masterPassword) {
              resolve(masterPassword);
              break;
            }
          }
        });
      });
    } catch (error) {
      const errorCode = (error as CodedError).code;
      if (errorCode === errorCodes.AUTH_INFO_NOT_INITIALIZED) {
        const newMasterPassword = window.prompt(
          "Write your new master password",
        );
        if (newMasterPassword) {
          EncryptedDB.newMasterPassword(
            credentials.user.uid,
            newMasterPassword,
          );
        }
      } else if (errorCode === errorCodes.INVALID_MASTER_PASSWORD) {
        window.alert("Invalid master password");
        console.log("Invalid master password");
      } else {
        window.alert("Unknown error");
        console.error("Unknown error");
      }
    }
  };

  const handleLogout = () => {
    fbAuth.signOut();
  };

  return (
    <div>
      Firebase Sandbox Page user name:{" "}
      {fbAuth.currentUser?.displayName || "anonymous"}
      <button onClick={handleLogin}>login</button>
      <button onClick={handleLogout}>logout</button>
    </div>
  );
};

export default FirebaseSandboxPage;
