import { useEffect } from "react";
import { useRouter } from "next/router";
import { useStateContext } from "@/context/StateContext";

const useAuthRedirect = (callback) => {
  const { loadingUser, isLoggedIn } = useStateContext();
  const router = useRouter();

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
