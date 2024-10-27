import React from "react";
import styled from "styled-components";
import Image from "next/image";
import logo from "@/images/logo.png";
import Link from "next/link";

const Footer = () => {
  return (
  <FooterSection>
   
    <SlideSmart>
      <Image src={logo} alt="SlideSmart Logo" width={48} height={48} />
      SlideSmart
    </SlideSmart>
    
    <Resources>

      <ResourceItem>Resources</ResourceItem>
      <ResourceItem><Link href="/tos">SlideSmart</Link></ResourceItem>
    
    </Resources>

    <Line />

    <SlideSmartCopyRight>
      Copyright @ 2024 SlideSmart. All Rights Reserved
    </SlideSmartCopyRight>
  </FooterSection>

  );
};

const FooterSection = styled.div`
  height: 576px;
  border-top: 1px solid #333;
  background-color: white;
  color: white;
  text-align: center;
  padding: 10px;
  display: flex;
  flex-direction: row;
  position: relative;
`;

const SlideSmart = styled.div`
  padding: 30px;
  text-decoration: none;
  font-size: 30px;
  color: #f03a47;
  font-weight: bold;
  align-items: center;
  display: flex;
  position: absolute;
`

const Resources = styled.div`
  padding: 45px;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  position: absolute;
  right: 10px;
  color: #333; 
`;

const ResourceItem = styled.div`
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: bold;

a {
    text-decoration: none;
    font-size: 20px;
    color: black;
  }

a:hover {
    text-decoration: underline;
}
`

const SlideSmartCopyRight = styled.div`
  font-size: 15px;
  color: #8B8B8B;
  position: absolute;
  bottom: 10px;
  padding: 40px;
`

const Line = styled.div`
  width: 80%;
  height: 0.5px;
  background-color: #9E9E9E;
  display: flex;
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
`

export default Footer;
