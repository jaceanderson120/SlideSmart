import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/router";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import styled from "styled-components";
import { toast } from "react-toastify";
import { storeUserInfo } from "@/firebase/database";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [agreed, setAgreed] = useState(false); // State for agreement checkbox
  const router = useRouter();

  const signup = (e) => {
    e.preventDefault(); // Prevent page reload

    // Check if all fields are filled
    if (!email || !password || !firstName || !lastName) {
      const notify = () =>
        toast.error("Please fill out all fields before signing up.");
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
          <Button type="submit">Sign Up</Button>
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
  background-color: #f6f4f3;
  color: #000000;
  font-size: 2rem;
  gap: 32px;
  flex-direction: column;
`;

const Title = styled.h1`
  margin: 20px 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Input = styled.input`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  color: green;
  width: 300px;

  &:focus {
    border-color: #f03a4770;
    outline: none;
  }
`;

const Label = styled.label`
  margin: 10px 0;
  font-size: 16px;
  text-align: left;
  display: flex;
  justify-content: center;
`;

const Button = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #f03a47;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: color 0.3s;

  &:hover {
    color: black;
  }
`;

const Checkbox = styled.input`
  margin-right: 5px;
`;

export default Signup;
