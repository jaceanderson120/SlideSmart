import React from "react";
import styled from "styled-components";
import Image from "next/image";
import logo from "@/images/logo.svg";
import Link from "next/link";

const Footer = () => {
  return (
    <FooterSection>
      <HorizontalSection>
        <SolaSlides>
          <Image src={logo} alt="SolaSlides Logo" width={48} height={48} />
          <Link href="/">SolaSlides</Link>
        </SolaSlides>

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
      <SolaSlidesCopyRight>
        Copyright @ 2025 SolaSlides. All Rights Reserved
      </SolaSlidesCopyRight>
    </FooterSection>
  );
};

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.black};
  background-color: ${({ theme }) => theme.white};
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

const SolaSlides = styled.div`
  display: flex;
  align-items: center;

  a {
    text-decoration: none;
    font-size: ${({ theme }) => theme.fontSize.heading};
    color: ${({ theme }) => theme.primary};
    font-weight: bold;
    margin-left: 16px;
  }
`;

const Resources = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  color: ${({ theme }) => theme.black};
`;

const ResourceItem = styled.div`
  margin-bottom: 20px;
  font-size: ${({ theme }) => theme.fontSize.default};
  font-weight: bold;

  a {
    text-decoration: none;
    font-size: ${({ theme }) => theme.fontSize.default};
    color: ${({ theme }) => theme.black};
  }

  a:hover {
    text-decoration: underline;
  }
`;

const SolaSlidesCopyRight = styled.div`
  font-size: ${({ theme }) => theme.fontSize.secondary};
  color: ${({ theme }) => theme.gray};
  padding: 16px;
  text-align: center;
`;

const Line = styled.div`
  width: 80%;
  height: 0.5px;
  background-color: ${({ theme }) => theme.gray};
  display: flex;
`;

export default Footer;
