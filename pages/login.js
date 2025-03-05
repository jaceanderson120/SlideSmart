import React, { useState } from "react";
import Link from "next/link";
import { auth } from "@/firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import Footer from "../components/page/Footer";
import { toast } from "react-toastify";
import styled from "styled-components";
import Button from "@/components/Button";
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
import CredentialsForm from "@/components/auth/CredentialsForm";
import GoogleButton from "@/components/auth/GoogleButton";
import OrLine from "@/components/auth/OrLine";
import Agreement from "@/components/auth/Agreement";
import Head from "next/head";
import PageContainer from "@/components/page/PageContainer";

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
      <Head>
        <title>SlideSmart - Login</title>
        <meta
          name="description"
          content="Login to SlideSmart to access your study guides and resources."
        />
        <link rel="canonical" href="https://www.slidesmartai.com/login" />
      </Head>
      <body>
        <main>
          <PageContainer>
            <Section>
              <CredentialsForm>
                <Image
                  src={logo}
                  alt="SlideSmart Logo"
                  width={48}
                  height={48}
                />
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
                <StyledText>
                  Don't have an account?{" "}
                  <TextLink href="/signup">Register</TextLink>
                </StyledText>
                <StyledText>
                  Forgot your password?{" "}
                  <TextLink href="/forgot-password">Reset it here</TextLink>
                </StyledText>
              </CredentialsForm>
            </Section>
          </PageContainer>
          <Footer />
        </main>
      </body>
    </>
  );
}

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
  font-size: ${({ theme }) => theme.fontSize.subheading};
  font-weight: bold;
  margin: 16px 0;
`;

const Input = styled.input`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.gray};
  border-radius: 5px;
  font-size: ${({ theme }) => theme.fontSize.secondary};
  color: green;
  width: 100%;

  &:focus {
    border-color: ${({ theme }) => theme.primary70};
    outline: none;
  }
`;

const StyledText = styled.div`
  padding: 20px;
  font-size: ${({ theme }) => theme.fontSize.secondary};
`;

const TextLink = styled(Link)`
  font-size: ${({ theme }) => theme.fontSize.secondary};
  text-decoration: none;
  color: ${({ theme }) => theme.primary};
  transition: text-decoration 0.3s;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;
