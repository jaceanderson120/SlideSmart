import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/router";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import styled from "styled-components";
import { toast } from "react-toastify";
import { storeUserInfo } from "@/firebase/database";
import { fontSize } from "@/constants/fontSize";
import Link from "next/link";
import Button from "@/components/Button";
import { colors } from "@/constants/colors";
import CredentialsForm from "@/components/CredentialsForm";
import Image from "next/image";
import logo from "@/images/logo.png";
import GoogleButton from "@/components/GoogleButton";
import OrLine from "@/components/OrLine";
import Agreement from "@/components/Agreement";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; /* eslint-disable import/first */

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const router = useRouter();

  const signup = (e) => {
    e.preventDefault(); // Prevent page reload

    // Check if all fields are filled
    if (!email || !password || !firstName || !lastName || !retypePassword) {
      const notify = () =>
        toast.error("Please fill out all fields before signing up.");
      notify();
      return;
    }

    if (password.length < 6) {
      const notify = () =>
        toast.error("Passwords must be more than 6 characters.");
      notify();
      return;
    }

    if (retypePassword != password) {
      const notify = () =>
        toast.error("Your passwords do not match. Please try again.");
      notify();
      return;
    }

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
      <PageContainer>
        <Navbar />
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
            <Button
              marginTop="10px"
              onClick={signup}
              style={{ fontWeight: "bold" }}
            >
              Continue with email <FontAwesomeIcon icon={faArrowRight} />
            </Button>
            <Login>
              Already have an account?{" "}
              <LoginLink href="/login">Login</LoginLink>
            </Login>
          </CredentialsForm>
        </Section>
      </PageContainer>
      <Footer />
    </>
  );
};

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  background-color: ${colors.lightGray};
`;

const Section = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 32px;
  text-align: center;
  color: ${colors.black};
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
  border: 1px solid ${colors.gray};
  border-radius: 5px;
  font-size: ${fontSize.secondary};
  color: green;
  width: 100%;

  &:focus {
    border-color: ${colors.primary70};
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
  color: ${colors.primary};
  transition: text-decoration 0.3s;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;

export default Signup;
