import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import logo from "@/images/logo.png";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/backend/firebase/firebase";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Set to true if user is signed in, false otherwise
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <NavbarSection>
      <Image src={logo} alt="SlideSmart Logo" width={64} height={64} />
      <NavbarSlideSmart>
        <Link href="/">SlideSmart</Link>
      </NavbarSlideSmart>
      <NavbarAboutLinks>
        <Link href="/">Saved Projects</Link>
        <Link href="/">How it Works</Link>
        <Link href="/">Support</Link>
        <Link href="/">Why SlideSmart</Link>
      </NavbarAboutLinks>

      <NavbarLoginLinks>
        {isLoggedIn ? (
          <>
            <NavbarLogoutStyle>
              <Link href="/login" onClick={handleLogout}>
                Logout
              </Link>
            </NavbarLogoutStyle>
          </>
        ) : (
          <>
            <NavbarLoginStyle>
              <Link href="/login">Login</Link>
            </NavbarLoginStyle>
            <NavbarRegisterStyle>
              <Link href="/signup">Register</Link>
            </NavbarRegisterStyle>
          </>
        )}
      </NavbarLoginLinks>
    </NavbarSection>
  );
}

const NavbarAboutLinks = styled.div`
  margin-left: 50px;
  display: flex;
  justify-content: space-between;
  gap: 30px;

  a {
    text-decoration: none;
    color: inherit;
    transition: color 0.3s;
    font-size: 20px;
    font-weight: bold;
  }

  a:hover {
    color: #f03a47;
  }
`;

const NavbarLoginStyle = styled.div`
  margin-left: 16px;
  padding: 6px;

  a {
    text-decoration: none;
    color: inherit;
    transition: color 0.3s;
    font-size: 25px;
    font-weight: bold;
  }

  a:hover {
    color: #f03a47;
  }
`;

const NavbarRegisterStyle = styled.div`
  margin-left: 16px;
  padding: 6px;

  a {
    text-decoration: none;
    color: white;
    transition: color 0.3s;
    font-size: 25px;
    font-weight: bold;
    border-radius: 8px;
    background-color: #f03a47;
    padding: 6px;
    border: 2px solid #f03a47;
  }

  a:hover {
    color: black;
  }
`;

const NavbarLogoutStyle = styled.div`
  margin-right: 16px;
  padding: 6px;

  a {
    text-decoration: none;
    color: inherit;
    transition: color 0.3s;
    font-size: 25px;
    font-weight: bold;
  }

  a:hover {
    color: #f03a47;
  }
`;

const NavbarLoginLinks = styled.div`
  float: right;
  margin-left: auto;
  margin-right: 16px;
  padding: 6px;
  display: flex;
  font-size: 25px;
  color: #000000;
  font-weight: bold;
`;

const NavbarSlideSmart = styled.div`
  margin-left: 16px;

  a {
    text-decoration: none;
    font-size: 40px;
    color: #f03a47;
    font-weight: bold;
  }
`;

const NavbarSection = styled.div`
  display: flex;
  align-items: center;
  margin: auto;
  padding-top: 20px;
  padding-left: 20px;
  background-color: #f6f4f3;
`;

export default Navbar;
