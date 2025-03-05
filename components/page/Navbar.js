import styled from "styled-components";
import Image from "next/image";
import logo from "@/images/logo.png";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useStateContext } from "@/context/StateContext";
import { useRouter } from "next/router";
import CustomMenu from "../CustomMenu";
import UserIcon from "../UserIcon";
import { useState, useEffect } from "react";
import Button from "../Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; /* eslint-disable import/first */
import { faArrowRight, faBars } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "@/context/ThemeContext";

function Navbar() {
  const { isLoggedIn, hasSpark } = useStateContext();
  const router = useRouter();
  const [initials, setInitials] = useState("");
  const [deviceWidth, setDeviceWidth] = useState(0);
  const { darkMode, toggleDarkMode } = useTheme();

  const handleLogout = () => {
    signOut(auth);
    router.push("/login");
  };

  const handleDashboardClick = () => {
    router.push("/dashboard");
  };

  const handleUpgradeManageClick = () => {
    router.push("/pricing");
  };

  // Define menu items for the user icon in the upper right
  const menuItems = [
    <MenuItemContainer>
      <HorizontalContainer>
        <UserIcon
          initials={initials}
          size={48}
          hoverBackgroundColor={({ theme }) => theme.gray}
        />
        <MenuTextContainer>
          <p>{auth.currentUser?.displayName}</p>
          <p>{auth.currentUser?.email}</p>
        </MenuTextContainer>
      </HorizontalContainer>
    </MenuItemContainer>,
    { name: darkMode ? "Light Mode" : "Dark Mode", onClick: toggleDarkMode },
    {
      name: hasSpark ? "Manage Subscription" : "Upgrade",
      onClick: handleUpgradeManageClick,
    },
    { name: "Logout", onClick: handleLogout },
  ];

  // Define items for the hamburger menu
  const hamburgerMenuItems = [
    {
      name: "Dashboard",
      onClick: () => router.push("/dashboard"),
    },
    {
      name: "Find Study Guides",
      onClick: () => router.push("/find-slides"),
    },
    {
      name: "How it Works",
      onClick: () => router.push("/how-it-works"),
    },
    {
      name: "Pricing",
      onClick: () => router.push("/pricing"),
    },
    {
      name: "Contact Us",
      onClick: () => router.push("/contact"),
    },
    {
      name: "Compare",
      onClick: () => router.push("/compare"),
    },
  ];

  // Get the device width
  useEffect(() => {
    const handleResize = () => {
      setDeviceWidth(window.innerWidth);
    };

    // Set the initial device width
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
      <LeftButtonSection>
        <LogoContainer onClick={() => router.push("/")}>
          <Image src={logo} alt="SlideSmart Logo" width={32} height="auto" />
          <LogoText>SlideSmart</LogoText>
        </LogoContainer>
        {deviceWidth > 768 && (
          <LinksContainer>
            {isLoggedIn && (
              <Button
                onClick={() => router.push("/find-slides")}
                padding="8px"
                backgroundColor="transparent"
                hoverBackgroundColor="transparent"
                textColor={({ theme }) => theme.black}
                hoverTextColor={({ theme }) => theme.primary}
              >
                Find Study Guides
              </Button>
            )}
            <Button
              onClick={() => router.push("/how-it-works")}
              padding="8px"
              backgroundColor="transparent"
              hoverBackgroundColor="transparent"
              textColor={({ theme }) => theme.black}
              hoverTextColor={({ theme }) => theme.primary}
            >
              How it Works
            </Button>
            <Button
              onClick={() => router.push("/pricing")}
              padding="8px"
              backgroundColor="transparent"
              hoverBackgroundColor="transparent"
              textColor={({ theme }) => theme.black}
              hoverTextColor={({ theme }) => theme.primary}
            >
              Pricing
            </Button>
            <Button
              onClick={() => router.push("/contact")}
              padding="8px"
              backgroundColor="transparent"
              hoverBackgroundColor="transparent"
              textColor={({ theme }) => theme.black}
              hoverTextColor={({ theme }) => theme.primary}
            >
              Contact Us
            </Button>
            <Button
              onClick={() => router.push("/compare")}
              padding="8px"
              backgroundColor="transparent"
              hoverBackgroundColor="transparent"
              textColor={({ theme }) => theme.black}
              hoverTextColor={({ theme }) => theme.primary}
            >
              Compare
            </Button>
          </LinksContainer>
        )}
      </LeftButtonSection>
      <RightButtonSection>
        {isLoggedIn ? (
          <>
            {router.pathname !== "/dashboard" && deviceWidth > 768 && (
              <Button onClick={handleDashboardClick} padding="8px" bold>
                Dashboard
              </Button>
            )}
            <CustomMenu
              triggerElement={
                <UserIcon
                  initials={initials}
                  backgroundColor={({ theme }) => theme.primary}
                  hoverColor={({ theme }) => theme.black}
                />
              }
              menuItems={menuItems}
            />
            {deviceWidth < 768 && (
              <CustomMenu
                triggerElement={<Hamburger icon={faBars} size="xl" />}
                menuItems={hamburgerMenuItems}
              />
            )}
          </>
        ) : (
          <>
            <Button
              onClick={() => router.push("/login")}
              bold
              backgroundColor="transparent"
              hoverBackgroundColor="transparent"
              textColor={({ theme }) => theme.black}
              hoverTextColor={({ theme }) => theme.primary}
            >
              Login
            </Button>
            <Button onClick={() => router.push("/signup")} bold padding="8px">
              Get Started <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          </>
        )}
      </RightButtonSection>
    </NavbarSection>
  );
}

const NavbarSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 6px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.gray};
  background-color: ${({ theme }) => theme.white};
  z-index: 100;
`;

const LinksContainer = styled.div`
  display: flex;
  gap: 16px;
  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const LeftButtonSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const RightButtonSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  a {
    text-decoration: none;
    font-size: ${({ theme }) => theme.fontSize.subheading};
    color: ${({ theme }) => theme.gray};
    font-weight: bold;
  }

  &:hover {
    cursor: pointer;
  }
`;

const LogoText = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.subheading};
  font-weight: bold;
  color: ${({ theme }) => theme.primary};
`;

const MenuTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 8px;
  gap: 8px;
  color: ${({ theme }) => theme.black};
`;

const MenuItemContainer = styled.div`
  padding: 8px;
  &::after {
    content: "";
    display: block;
    width: 100%;
    height: 1px;
    background-color: ${({ theme }) => theme.black};
    margin-top: 18px;
  }
`;

const HorizontalContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const Hamburger = styled(FontAwesomeIcon)`
  cursor: pointer;
  color: ${({ theme }) => theme.black};
  &:hover {
    transition: color 0.3s;
    color: ${({ theme }) => theme.primary};
  }
`;

export default Navbar;
