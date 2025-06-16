/**
 * This hook will listen the auth state changes from firebase to keep a user
 */

import type { User } from "firebase/auth";
import { createContext, useContext } from "react";

export const UserContext = createContext<User | null>(null);
export const UserProvider = UserContext.Provider;

export const useUserData = () => {
  const user = useContext(UserContext);
  return user;
};
