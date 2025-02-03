import { useRouter } from "next/router";
import { useStateContext } from "@/context/StateContext";
import { useEffect } from "react";

function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const router = useRouter();
    const { loadingUser, isLoggedIn } = useStateContext();

    useEffect(() => {
      if (!loadingUser && !isLoggedIn) {
        router.push("/login");
      }
    }, [loadingUser, isLoggedIn, router]);

    if (loadingUser || !isLoggedIn) {
      return null; // Render nothing while loading or if not authenticated
    }

    return <Component {...props} />;
  };
}

export default withAuth;
