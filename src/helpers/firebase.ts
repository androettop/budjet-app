import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDMsMToaypZwCaRYB-E4vBrJLZP68ifcwY",
  authDomain: "budjet-4136b.firebaseapp.com",
  projectId: "budjet-4136b",
  storageBucket: "budjet-4136b.firebasestorage.app",
  messagingSenderId: "382667280737",
  appId: "1:382667280737:web:bb3f7284cc91395c433520",
};

export const fbApp = initializeApp(firebaseConfig);
