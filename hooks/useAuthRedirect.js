import { useEffect } from "react";
import { useRouter } from "next/router";
import { useStateContext } from "@/context/StateContext";

const useAuthRedirect = (callback) => {
  const router = useRouter();
  const { loadingUser, isLoggedIn } = useStateContext();

  // If the user is done loading and the user is not logged in, redirect to the login page
  // If the user is done loading and the user is logged in, run the callback function if it exists
  useEffect(() => {
    if (!loadingUser) {
      if (!isLoggedIn) {
        router.push("/login");
      } else if (typeof callback === "function") {
        callback();
      }
    }
  }, [loadingUser, isLoggedIn, router, callback]);
};

export default useAuthRedirect;
