import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import logo from "@/images/logo.png";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useStateContext } from "@/context/StateContext";
import { fontSize } from "@/constants/fontSize";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; /* eslint-disable import/first */
import StyledMenuItem from "./StyledMenuItem";
import Menu from "@mui/material/Menu";
import { useState } from "react";
import { useRouter } from "next/router";

function Navbar() {
  const { isLoggedIn } = useStateContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();

  const handleLogout = () => {
    signOut(auth);
    router.push("/login");
  };

  // Close the menu when the user clicks outside of it
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Open the menu when the user clicks on the ellipsis icon
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <NavbarSection>
      <Image src={logo} alt="SlideSmart Logo" width={48} height={48} />
      <NavbarSlideSmart>
        <Link href="/">SlideSmart</Link>
      </NavbarSlideSmart>
      <NavbarAboutLinks>
        <Link href="/myStudyGuides">My Study Guides</Link>
        {/* <Link href="/">How it Works</Link>
        <Link href="/">Support</Link>
        <Link href="/">Why SlideSmart</Link> */}
      </NavbarAboutLinks>
      <NavbarLoginLinks>
        {isLoggedIn ? (
          <>
            <StyledFontAwesomeIcon
              icon={faUserCircle}
              size="2x"
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleMenuClick}
            />
            <Menu
              keepMounted
              anchorEl={anchorEl}
              onClose={handleClose}
              open={Boolean(anchorEl)}
            >
              <StyledMenuItem onClick={handleLogout}>Logout</StyledMenuItem>
            </Menu>
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
    font-size: ${fontSize.default};
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
    font-size: ${fontSize.default};
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
    font-size: ${fontSize.default};
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

const NavbarLoginLinks = styled.div`
  float: right;
  margin-left: auto;
  margin-right: 16px;
  padding: 6px;
  display: flex;
  font-size: ${fontSize.default};
  color: #000000;
  font-weight: bold;
`;

const NavbarSlideSmart = styled.div`
  margin-left: 16px;

  a {
    text-decoration: none;
    font-size: ${fontSize.heading};
    color: #f03a47;
    font-weight: bold;
  }
`;

const NavbarSection = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 16px;
  border-bottom: 1px solid gray;
  background-color: #f6f4f3;
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  &:hover {
    transition: color 0.3s;
    color: #f03a47;
  }
`;

export default Navbar;
