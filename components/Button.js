import styled from "styled-components";
import { fontSize as defaultFontSize } from "@/constants/fontSize";

const Button = ({
  textColor = "#ffffff",
  hoverTextColor = "#000000",
  backgroundColor = "#f03a47",
  hoverBackgroundColor = "#f03a47",
  fontSize = defaultFontSize.default,
  padding = "10px 20px",
  marginTop = "0px",
  bold = false,
  underline = false,
  style,
  onClick,
  children,
}) => {
  return (
    <StyledButton
      onClick={onClick}
      $textColor={textColor}
      $hoverTextColor={hoverTextColor}
      $backgroundColor={backgroundColor}
      $hoverBackgroundColor={hoverBackgroundColor}
      $padding={padding}
      $fontSize={fontSize}
      $marginTop={marginTop}
      $underline={underline}
      $bold={bold}
      style={style}
    >
      {children}
    </StyledButton>
  );
};

export default Button;

const StyledButton = styled.button`
  padding: ${(props) => props.$padding};
  background-color: ${(props) => props.$backgroundColor};
  color: ${(props) => props.$textColor};
  font-weight: ${(props) => (props.$bold ? "bold" : "normal")};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: ${(props) => props.$fontSize};
  margin-top: ${(props) => props.$marginTop};
  transition: color 0.3s, background-color 0.3s, transform 0.3s;

  &:hover {
    color: ${(props) => props.$hoverTextColor};
    background-color: ${(props) => props.$hoverBackgroundColor};
    transform: scale(1.02);
  }

  ${(props) =>
    props.$underline &&
    `
    &::after {
      content: "";
      display: block;
      width: 100%;
      height: 1px;
      background-color: ${props.$textColor};
      margin-top: 10px;
    }
  `}
`;
