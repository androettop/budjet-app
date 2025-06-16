import { useContext } from "react";
import { UserContext } from "./useUserData";

export const useAuthLoading = () => {
  const data = useContext(UserContext);
  return data.isLoading;
};
