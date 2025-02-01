import React from "react";
import styled from "styled-components";
import Image from "next/image";
import logo from "@/images/logo.png";
import Link from "next/link";
import { fontSize } from "@/constants/fontSize";
import { colors } from "@/constants/colors";

const Footer = () => {
  return (
    <FooterSection>
      <HorizontalSection>
        <SlideSmart>
          <Image src={logo} alt="SlideSmart Logo" width={48} height={48} />
          <Link href="/">SlideSmart</Link>
        </SlideSmart>

        <Resources>
          <ResourceItem>Resources</ResourceItem>
          <ResourceItem>
            <Link href="/tos">Terms of Service</Link>
          </ResourceItem>
          <ResourceItem>
            <Link href="/tos">Privacy Policy</Link>
          </ResourceItem>
        </Resources>
      </HorizontalSection>
      <Line />
      <SlideSmartCopyRight>
        Copyright @ 2024 SlideSmart. All Rights Reserved
      </SlideSmartCopyRight>
    </FooterSection>
  );
};

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-top: 1px solid ${colors.black};
  background-color: white;
  color: white;
  text-align: center;
  padding: 16px;
  position: relative;
`;

const HorizontalSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 16px;
`;

const SlideSmart = styled.div`
  display: flex;
  align-items: center;

  a {
    text-decoration: none;
    font-size: ${fontSize.heading};
    color: ${colors.primary};
    font-weight: bold;
    margin-left: 16px;
  }
`;

const Resources = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  color: ${colors.black};
`;

const ResourceItem = styled.div`
  margin-bottom: 20px;
  font-size: ${fontSize.default};
  font-weight: bold;

  a {
    text-decoration: none;
    font-size: ${fontSize.default};
    color: black;
  }

  a:hover {
    text-decoration: underline;
  }
`;

const SlideSmartCopyRight = styled.div`
  font-size: ${fontSize.secondary};
  color: #8b8b8b;
  padding: 16px;
  text-align: center;
`;

const Line = styled.div`
  width: 80%;
  height: 0.5px;
  background-color: ${colors.gray};
  display: flex;
`;

export default Footer;
