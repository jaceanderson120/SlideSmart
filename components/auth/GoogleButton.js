import styled from "styled-components";
import googleLogo from "@/images/googleLogo.png";
import Image from "next/image";
import {
  getAdditionalUserInfo,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { storeUserInfo } from "@/firebase/database";

const GoogleButton = () => {
  const googleProvider = new GoogleAuthProvider();

  // Don't auto sign in user, let them pick an account
  googleProvider.setCustomParameters({ prompt: "select_account" });

  const router = useRouter();

  const loginWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;

        // Get additional user info to check if user is new
        const additionalUserInfo = getAdditionalUserInfo(result);
        if (additionalUserInfo.isNewUser) {
          storeUserInfo(user.uid, user.displayName, user.email);
        }

        router.push("/dashboard");
      })
      .catch((error) => {
        toast.error(
          "An error occurred while signing in with Google. Please try again."
        );
        console.error(error);
        return;
      });
  };

  return (
    <Button onClick={loginWithGoogle}>
      <Image src={googleLogo} alt="Google Icon" width={30} height="auto" />
      Continue with Google
    </Button>
  );
};

export default GoogleButton;

const Button = styled.button`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.lightGray};
  color: ${({ theme }) => theme.black};
  font-weight: bold;
  border: 1px solid ${({ theme }) => theme.gray};
  border-radius: 5px;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSize.default};
  transition: color 0.3s, background-color 0.3s, transform 0.3s;
  &:hover {
    color: ${({ theme }) => theme.black};
    background-color: ${({ theme }) => theme.primary70};
    transform: scale(0.98);
  }
`;
