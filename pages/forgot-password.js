import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Footer from "../components/page/Footer";
import { toast } from "react-toastify";
import styled from "styled-components";
import Button from "@/components/Button";
import Image from "next/image";
import logo from "@/images/logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; /* eslint-disable import/first */
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import CredentialsForm from "@/components/auth/CredentialsForm";
import OrLine from "@/components/auth/OrLine";
import Head from "next/head";
import PageContainer from "@/components/page/PageContainer";
import sendForgotPasswordEmail from "@/firebase/forgotPassword";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  // Function to handle the email reset button click
  const handleEmailResetClicked = async (e) => {
    e.preventDefault(); // prevent page reload (automatic behavior from form submission)
    if (!email) {
      toast.error("Please enter an email address.");
      return;
    }
    const res = await sendForgotPasswordEmail(email.trim());
    if (res.success) {
      setEmailSent(true);
      toast.success(
        "If an account with that email exists, we have sent you an email with instructions to reset your password."
      );
      setTimeout(() => {
        setEmailSent(false);
      }, 15000);
    } else {
      toast.error(
        "Error sending email. Please double-check your email try again."
      );
    }
  };

  return (
    <>
      <Head>
        <title>SolaSlides - Forgot Password</title>
        <meta
          name="description"
          content="Forgot your password? Reset it here."
        />
        <link
          rel="canonical"
          href="https://www.solaslides.com/forgot-password"
        />
      </Head>
      <body>
        <main>
          <PageContainer>
            <Section>
              <CredentialsForm>
                <Image
                  src={logo}
                  alt="SolaSlides Logo"
                  width={48}
                  height={48}
                />
                <Title>Forgot your password?</Title>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {!emailSent && (
                  <Button
                    onClick={handleEmailResetClicked}
                    marginTop="10px"
                    style={{ fontWeight: "bold" }}
                  >
                    Email me a reset link
                  </Button>
                )}
                <OrLine />
                <Button
                  onClick={() => router.push("/login")}
                  marginTop="10px"
                  style={{ fontWeight: "bold" }}
                >
                  <FontAwesomeIcon icon={faArrowLeft} /> Go back to login
                </Button>
                <StyledText>
                  Want to create a new account?{" "}
                  <RegisterLink href="/signup">Create one here</RegisterLink>
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

const RegisterLink = styled(Link)`
  font-size: ${({ theme }) => theme.fontSize.secondary};
  text-decoration: none;
  color: ${({ theme }) => theme.primary};
  transition: text-decoration 0.3s;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;
