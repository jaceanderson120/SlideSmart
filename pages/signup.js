import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/router";
import Footer from "../components/page/Footer";
import styled from "styled-components";
import { toast } from "react-toastify";
import { storeUserInfo } from "@/firebase/database";
import { fontSize } from "@/constants/fontSize";
import Link from "next/link";
import Button from "@/components/Button";
import CredentialsForm from "@/components/auth/CredentialsForm";
import Image from "next/image";
import logo from "@/images/logo.png";
import GoogleButton from "@/components/auth/GoogleButton";
import OrLine from "@/components/auth/OrLine";
import Agreement from "@/components/auth/Agreement";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
import Head from "next/head";
import PageContainer from "@/components/page/PageContainer";
import VerifyModal from "@/components/modals/VerifyModal";
import { Dots } from "react-activity";
import "react-activity/dist/library.css";
config.autoAddCss = false; /* eslint-disable import/first */

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [continueDisabled, setContinueDisabled] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const router = useRouter();

  const signup = async (e) => {
    e.preventDefault(); // Prevent page reload
    setContinueDisabled(true); // Disable the continue button

    // Check if all fields are filled
    if (!email || !password || !firstName || !lastName || !retypePassword) {
      toast.error("Please fill out all fields before signing up.");
      setContinueDisabled(false); // Re-enable the continue button
      return;
    }

    if (password.length < 6) {
      toast.error("Passwords must be more than 6 characters.");
      setContinueDisabled(false); // Re-enable the continue button
      return;
    }

    if (retypePassword != password) {
      toast.error("Your passwords do not match. Please try again.");
      setContinueDisabled(false); // Re-enable the continue button
      return;
    }

    setIsVerifyModalOpen(true);
    setContinueDisabled(false); // Re-enable the continue button
  };

  const completeSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        // Update user profile with first and last name
        await updateProfile(user, {
          displayName: `${firstName} ${lastName}`,
        });
        await storeUserInfo(user.uid, `${firstName} ${lastName}`, email);
        router.push("/dashboard");
      })
      .catch((error) => {
        console.error(error);
        if (error.code === "auth/email-already-in-use") {
          toast.error("An account with this email already exists.");
        }
      });
  };

  return (
    <>
      <Head>
        <title>SlideSmart - Register</title>
        <meta
          name="description"
          content="Register to SlideSmart to access your study guides and resources."
        />
        <link rel="canonical" href="https://www.slidesmartai.com/signup" />
      </Head>
      <PageContainer>
        <Section>
          <CredentialsForm>
            <Image src={logo} alt="SlideSmart Logo" width={48} height={48} />
            <Title>Ready to enhance your education?</Title>
            <GoogleButton />
            <OrLine />
            <Input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Re-Type Password"
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
            />
            <Agreement type="signup" />
            {!continueDisabled ? (
              <Button
                marginTop="10px"
                onClick={signup}
                style={{ fontWeight: "bold" }}
                disabled={continueDisabled}
              >
                Continue with email <FontAwesomeIcon icon={faArrowRight} />
              </Button>
            ) : (
              <Dots />
            )}
            <Login>
              Already have an account?{" "}
              <LoginLink href="/login">Login</LoginLink>
            </Login>
          </CredentialsForm>
        </Section>
      </PageContainer>
      <Footer />
      <VerifyModal
        isOpen={isVerifyModalOpen}
        onClose={() => {
          setIsVerifyModalOpen(false);
        }}
        onConfirm={completeSignup}
        email={email}
      />
    </>
  );
};

const Section = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 32px;
  text-align: center;
  color: ${({ theme }) => theme.black};
  flex-direction: column;
`;

const Title = styled.p`
  font-size: ${fontSize.subheading};
  font-weight: bold;
  margin: 16px 0;
`;

const Input = styled.input`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.gray};
  border-radius: 5px;
  font-size: ${fontSize.secondary};
  color: green;
  width: 100%;

  &:focus {
    border-color: ${({ theme }) => theme.primary70};
    outline: none;
  }
`;

const Login = styled.p`
  padding: 20px;
  font-size: ${fontSize.secondary};
`;

const LoginLink = styled(Link)`
  font-size: ${fontSize.secondary};
  text-decoration: none;
  color: ${({ theme }) => theme.primary};
  transition: text-decoration 0.3s;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;

export default Signup;
