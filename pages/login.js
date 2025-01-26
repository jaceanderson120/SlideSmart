import React, { useState } from "react";
import Link from "next/link";
import { auth } from "@/firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import styled from "styled-components";
import { fontSize } from "@/constants/fontSize";
import Button from "@/components/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = (e) => {
    e.preventDefault(); // prevent page reload (automatic behavior from form submission)

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        router.push("/dashboard");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <Navbar />
      <Section>
        <Content>
          <Title>Welcome Back!</Title>
          <Form onSubmit={login}>
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
            <Button type="submit" marginTop="10px">
              Log In
            </Button>
            <Register>
              Don't have an account? <Link href="/signup">Register here</Link>
            </Register>
          </Form>
        </Content>
      </Section>
      <Footer />
    </>
  );
}

const Section = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 32px;
  text-align: center;
  height: 100vh;
  background-color: #f6f4f3;
  color: #000000;
  flex-direction: column;
`;

const Content = styled.div`
  text-align: center;
  margin: 20px 0;
`;

const Title = styled.p`
  font-size: ${fontSize.heading};
  font-weight: bold;
  margin-bottom: 20px;
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
  font-size: ${fontSize.default};
  color: green;
  width: 300px;

  &:focus {
    border-color: #f03a4770;
    outline: none;
  }
`;

const Register = styled.div`
  padding: 20px;
  font-size: ${fontSize.secondary};
`;
