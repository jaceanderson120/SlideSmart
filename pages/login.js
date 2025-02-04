import React, { useState } from "react";
import Link from "next/link";
import { auth } from "@/firebase/firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail,
  linkWithCredential,
} from "firebase/auth";
import { useRouter } from "next/router";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import styled from "styled-components";
import { fontSize } from "@/constants/fontSize";
import Button from "@/components/Button";
import { colors } from "@/constants/colors";
import Image from "next/image";
import logo from "@/images/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; /* eslint-disable import/first */
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import CredentialsForm from "@/components/CredentialsForm";
import GoogleButton from "@/components/GoogleButton";
import OrLine from "@/components/OrLine";
import Agreement from "@/components/Agreement";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = async (e) => {
    e.preventDefault(); // prevent page reload (automatic behavior from form submission)

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error logging in", error);
      if (error.code === "auth/invalid-credential") {
        toast.error(
          "Invalid credentials. This email may be linked to a Google account, if so, please continue with Google. Otherwise, please try again."
        );
      } else if (error.code === "auth/invalid-email") {
        toast.error("User not found. Please try again.");
      }
    }
  };

  return (
    <>
      <PageContainer>
        <Navbar />
        <Section>
          <CredentialsForm>
            <Image src={logo} alt="SlideSmart Logo" width={48} height={48} />
            <Title>Welcome back</Title>
            <GoogleButton />
            <OrLine />
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              onClick={login}
              marginTop="10px"
              style={{ fontWeight: "bold" }}
            >
              Login with email <FontAwesomeIcon icon={faArrowRight} />
            </Button>
            <Agreement type="login" />
            <Register>
              Don't have an account?{" "}
              <RegisterLink href="/signup">Register</RegisterLink>
            </Register>
          </CredentialsForm>
        </Section>
      </PageContainer>
      <Footer />
    </>
  );
}

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

const Register = styled.div`
  padding: 20px;
  font-size: ${fontSize.secondary};
`;

const RegisterLink = styled(Link)`
  font-size: ${fontSize.secondary};
  text-decoration: none;
  color: ${colors.primary};
  transition: text-decoration 0.3s;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;
