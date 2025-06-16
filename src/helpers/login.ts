import { signInWithPopup } from "firebase/auth";
import { fbAuth, googleProvider } from "./firebase";

export const login = async () => {
  await signInWithPopup(fbAuth, googleProvider);
};

export const logout = async () => {
  await fbAuth.signOut();
};
