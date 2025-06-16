/**
 * This hook will listen the auth state changes from firebase to keep a user
 */

import type { User } from "firebase/auth";
import { createContext, useContext } from "react";

type UserContextType = {
  user: User | null;
  isLoading: boolean;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
});
export const UserProvider = UserContext.Provider;

export const useUserData = () => {
  const data = useContext(UserContext);
  return data.user;
};
