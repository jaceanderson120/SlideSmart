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

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [agreed, setAgreed] = useState(false); // State for agreement checkbox
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

    if (retypePassword != password) {
      const notify = () =>
        toast.error("Your passwords do not match. Please try again.");
      notify();
      return;
    }

    if (!agreed) {
      toast.error("You must agree to the Terms of Service and Privacy Policy.");
      return; // Prevent signup if not agreed
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        // Update user profile with first and last name
        await updateProfile(user, {
          displayName: `${firstName} ${lastName}`,
        });
        await storeUserInfo(user.uid, `${firstName} ${lastName}`, email);
        router.push("/");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <Navbar />
      <Section>
        <Title>Create an Account</Title>
        <Form onSubmit={signup}>
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
          <Label>
            <Checkbox
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            I agree to the{" "}
            <a href="/tos" target="_blank">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/tos" target="_blank">
              Privacy Policy
            </a>
            .
          </Label>
          <Button type="submit" marginTop="10px" fontSize={fontSize.default}>
            Sign Up
          </Button>
          <Login>
            Already have an account? <Link href="/login">Login here</Link>
          </Login>
        </Form>
      </Section>
      <Footer />
    </>
  );
};

const Section = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 32px;
  text-align: center;
  height: 100vh;
  background-color: ${colors.lightGray};
  color: ${colors.black};
  gap: 32px;
  flex-direction: column;
`;

const Title = styled.p`
  font-size: ${fontSize.heading};
  font-weight: bold;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Input = styled.input`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid ${colors.gray};
  border-radius: 5px;
  font-size: ${fontSize.default};
  color: green;
  width: 300px;

  &:focus {
    border-color: ${colors.primary70};
    outline: none;
  }
`;

const Label = styled.label`
  margin: 10px 0;
  font-size: ${fontSize.secondary};
  text-align: left;
  display: flex;
  justify-content: center;
`;

const Checkbox = styled.input`
  margin-right: 5px;
`;

const Login = styled.div`
  padding: 20px;
  font-size: ${fontSize.secondary};
`;

export default Signup;
