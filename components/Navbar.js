import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import logo from "@/images/logo.png";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useStateContext } from "@/context/StateContext";
import { fontSize } from "@/constants/fontSize";
import { useRouter } from "next/router";
import CustomMenu from "./CustomMenu";
import UserIcon from "./UserIcon";
import { useState, useEffect } from "react";
import { colors } from "@/constants/colors";

function Navbar() {
  const { isLoggedIn, hasSpark } = useStateContext();
  const router = useRouter();
  const [initials, setInitials] = useState("");

  const handleLogout = () => {
    signOut(auth);
    router.push("/login");
  };

  const handleUpgradeManageClick = () => {
    router.push("/pricing");
  };

  const menuItems = [
    <MenuItemContainer>
      <HorizontalContainer>
        <UserIcon
          initials={initials}
          size={48}
          hoverBackgroundColor={colors.gray}
        />
        <MenuTextContainer>
          <p>{auth.currentUser?.displayName}</p>
          <p>{auth.currentUser?.email}</p>
        </MenuTextContainer>
      </HorizontalContainer>
    </MenuItemContainer>,
    // {
    //   name: hasSpark ? "Manage Subscription" : "Upgrade",
    //   onClick: handleUpgradeManageClick,
    // },
    { name: "Logout", onClick: handleLogout },
  ];

  // Get the current user's initials
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      // Get the user's name
      const name = user.displayName;
      if (name) {
        // Get the user's initials
        const initials = name
          .split(" ")
          .map((n) => n[0])
          .join("");
        setInitials(initials);
      }
    }
  });

  return (
    <NavbarSection>
      <Image src={logo} alt="SlideSmart Logo" width={48} height={48} />
      <NavbarSlideSmart>
        <Link href="/">SlideSmart</Link>
      </NavbarSlideSmart>
      <NavbarAboutLinks>
        {isLoggedIn && <Link href="/dashboard">Dashboard</Link>}
        {isLoggedIn && <Link href="/find-slides">Find Slides</Link>}
        <Link href="/how-it-works">How it Works</Link>
        <Link href="/contact">Contact Us</Link>
        {/* <Link href="/">Pricing</Link>
        <Link href="/">About</Link> */}
      </NavbarAboutLinks>

      <NavbarLoginLinks>
        {isLoggedIn ? (
          <CustomMenu
            triggerElement={<UserIcon initials={initials} size={48} />}
            menuItems={menuItems}
          />
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
    font-size: ${fontSize.label};
    font-weight: bold;
  }

  a:hover {
    color: ${colors.primary};
  }
`;

const NavbarLoginStyle = styled.div`
  margin-left: 16px;
  padding: 6px;

  a {
    text-decoration: none;
    color: inherit;
    transition: color 0.3s;
    font-size: ${fontSize.default};
    font-weight: bold;
  }

  a:hover {
    color: ${colors.primary};
  }
`;

const NavbarRegisterStyle = styled.div`
  margin-left: 16px;
  padding: 6px;

  a {
    text-decoration: none;
    color: ${colors.white};
    transition: color 0.3s;
    font-size: ${fontSize.default};
    font-weight: bold;
    border-radius: 8px;
    background-color: ${colors.primary};
    padding: 6px;
    border: 2px solid ${colors.primary};
  }

  a:hover {
    color: black;
  }
`;

const NavbarLoginLinks = styled.div`
  float: right;
  margin-left: auto;
  margin-right: 16px;
  padding: 6px;
  display: flex;
  font-size: ${fontSize.default};
  color: ${colors.black};
  font-weight: bold;
`;

const NavbarSlideSmart = styled.div`
  margin-left: 16px;

  a {
    text-decoration: none;
    font-size: ${fontSize.heading};
    color: ${colors.primary};
    font-weight: bold;
  }
`;

const NavbarSection = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 16px;
  border-bottom: 1px solid gray;
  background-color: ${colors.lightGray};
  z-index: 100;
`;

const MenuTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 8px;
  gap: 8px;
`;

const MenuItemContainer = styled.div`
  padding: 8px;
  &::after {
    content: "";
    display: block;
    width: 100%;
    height: 1px;
    background-color: ${colors.black};
    margin-top: 18px;
  }
`;

const HorizontalContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export default Navbar;
