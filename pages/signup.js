"use client";
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/library/firebase/firebase";
import { useRouter } from "next/router";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import styled from "styled-components";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const signup = (e) => {
    e.preventDefault(); // prevent page reload (automatic behavior from form submission)

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
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
          <Button type="submit">Sign Up</Button>
        </Form>
      </Section>
      {/* <Footer /> */}
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

export default Signup;
