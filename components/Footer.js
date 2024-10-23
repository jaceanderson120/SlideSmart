import React from "react";
import styled from "styled-components";
import Link from "next/link";

const Footer = () => {
  return (
    <FooterSection>
      <StyledLink href="/tos" target="_blank">
        Terms of Service
      </StyledLink>{" "}
      and{" "}
      <StyledLink href="/tos" target="_blank">
        Privacy Policy
      </StyledLink>
    </FooterSection>
  );
};

const FooterSection = styled.div`
  border-top: 1px solid #333;
  background-color: #333;
  color: white;
  text-align: center;
  padding: 10px;
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export default Footer;
