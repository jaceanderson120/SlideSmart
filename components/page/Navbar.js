import styled from "styled-components";
import Image from "next/image";
import logo from "@/images/logo.png";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useStateContext } from "@/context/StateContext";
import { fontSize } from "@/constants/fontSize";
import { useRouter } from "next/router";
import CustomMenu from "../CustomMenu";
import UserIcon from "../UserIcon";
import { useState, useEffect } from "react";
import { colors } from "@/constants/colors";
import Button from "../Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; /* eslint-disable import/first */
import { faArrowRight, faBars } from "@fortawesome/free-solid-svg-icons";

function Navbar() {
  const { isLoggedIn, hasSpark } = useStateContext();
  const router = useRouter();
  const [initials, setInitials] = useState("");
  const [deviceWidth, setDeviceWidth] = useState(0);

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
          hoverBackgroundColor={colors.gray}
        />
        <MenuTextContainer>
          <p>{auth.currentUser?.displayName}</p>
          <p>{auth.currentUser?.email}</p>
        </MenuTextContainer>
      </HorizontalContainer>
    </MenuItemContainer>,
    {
      name: hasSpark ? "Manage Subscription" : "Upgrade",
      onClick: handleUpgradeManageClick,
    },
    { name: "Logout", onClick: handleLogout },
  ];

  // Define items for the hamburger menu
  const hamburgerMenuItems = [
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
      console.log("Device width: ", window.innerWidth);
    };

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
      <LogoContainer onClick={() => router.push("/")}>
        <Image src={logo} alt="SlideSmart Logo" width={32} height="auto" />
        SlideSmart
      </LogoContainer>
      <LeftButtonSection>
        {deviceWidth > 768 ? (
          <LinksContainer>
            {isLoggedIn && (
              <Button
                onClick={() => router.push("/find-slides")}
                padding="8px"
                backgroundColor="transparent"
                hoverBackgroundColor="transparent"
                textColor={colors.black}
                hoverTextColor={colors.primary}
              >
                Find Study Guides
              </Button>
            )}
            <Button
              onClick={() => router.push("/how-it-works")}
              padding="8px"
              backgroundColor="transparent"
              hoverBackgroundColor="transparent"
              textColor={colors.black}
              hoverTextColor={colors.primary}
            >
              How it Works
            </Button>
            <Button
              onClick={() => router.push("/pricing")}
              padding="8px"
              backgroundColor="transparent"
              hoverBackgroundColor="transparent"
              textColor={colors.black}
              hoverTextColor={colors.primary}
            >
              Pricing
            </Button>
            <Button
              onClick={() => router.push("/contact")}
              padding="8px"
              backgroundColor="transparent"
              hoverBackgroundColor="transparent"
              textColor={colors.black}
              hoverTextColor={colors.primary}
            >
              Contact Us
            </Button>
            <Button
              onClick={() => router.push("/compare")}
              padding="8px"
              backgroundColor="transparent"
              hoverBackgroundColor="transparent"
              textColor={colors.black}
              hoverTextColor={colors.primary}
            >
              Compare
            </Button>
          </LinksContainer>
        ) : (
          <CustomMenu
            triggerElement={<Hamburger icon={faBars} size="xl" />}
            menuItems={hamburgerMenuItems}
          />
        )}
      </LeftButtonSection>
      <RightButtonSection>
        {isLoggedIn ? (
          <>
            {router.pathname !== "/dashboard" && (
              <Button onClick={handleDashboardClick} padding="8px" bold>
                Dashboard
              </Button>
            )}
            <CustomMenu
              triggerElement={
                <UserIcon
                  initials={initials}
                  backgroundColor={colors.primary}
                  hoverColor={colors.black}
                />
              }
              menuItems={menuItems}
            />
          </>
        ) : (
          <>
            <Button
              onClick={() => router.push("/login")}
              bold
              backgroundColor="transparent"
              hoverBackgroundColor="transparent"
              textColor={colors.black}
              hoverTextColor={colors.primary}
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
  border-bottom: 1px solid ${colors.gray};
  background-color: ${colors.white};
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
  font-size: ${fontSize.subheading};
  font-weight: bold;
  color: ${colors.primary};

  a {
    text-decoration: none;
    font-size: ${fontSize.subheading};
    color: ${colors.primary};
    font-weight: bold;
  }

  &:hover {
    cursor: pointer;
  }
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

const Hamburger = styled(FontAwesomeIcon)`
  cursor: pointer;
  &:hover {
    transition: color 0.3s;
    color: ${colors.primary};
  }
`;

export default Navbar;
