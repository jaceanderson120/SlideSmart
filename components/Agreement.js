import styled from "styled-components";
import { colors } from "@/constants/colors";
import { fontSize } from "@/constants/fontSize";
import { useRouter } from "next/router";

const Agreement = ({ type }) => {
  const router = useRouter();

  const handleTermsClick = () => {
    router.push("/tos");
  };

  return (
    <Label>
      By {type === "login" ? "logging in" : "signing up"}, you agree to our{" "}
      <LabelSpan onClick={handleTermsClick}>Terms of Service</LabelSpan> and{" "}
      <LabelSpan onClick={handleTermsClick}>Privacy Policy</LabelSpan>
    </Label>
  );
};

export default Agreement;

const Label = styled.p`
  margin: 10px 0;
  font-size: ${fontSize.secondary};
  text-align: center;
  line-height: 1.3;
`;

const LabelSpan = styled.span`
  color: ${colors.primary};
  font-weight: bold;
  cursor: pointer;
  transition: text-decoration 0.3s;

  &:hover {
    text-decoration: underline;
  }
`;
