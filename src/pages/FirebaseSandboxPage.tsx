import { signInWithPopup } from "firebase/auth";
import { fbAuth, googleProvider } from "../helpers/firebase";
import { EncryptedDB } from "../data/db";
import { errorCodes, type CodedError } from "../helpers/errors";
import { useUserData } from "../hooks/useUserData";

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

  const saveSampleData = async () => {
    await EncryptedDB.getInstance().setDoc(
      {
        text: "Sample text",
      },
      "/users/" + user?.uid + "/movements/sample",
    );
  };

  const loadSampleData = async () => {
    const sampleData = await EncryptedDB.getInstance().getDoc(
      "/users/" + user?.uid + "/movements/sample",
    );
    window.alert(JSON.stringify(sampleData, null, 2));
  };

  const user = useUserData();

  return (
    <div>
      Firebase Sandbox Page user name: {user?.displayName || "anonymous"}
      <button onClick={handleLogin}>login</button>
      <button onClick={handleLogout}>logout</button>
      <button onClick={saveSampleData}>save sample data</button>
      <button onClick={loadSampleData}>load sample data</button>
    </div>
  );
};

export default FirebaseSandboxPage;
