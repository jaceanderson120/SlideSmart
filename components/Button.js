import styled from "styled-components";

const Button = ({
  textColor,
  hoverTextColor,
  backgroundColor,
  hoverBackgroundColor,
  fontSize = "16px",
  padding = "10px 20px",
  marginTop = "0px",
  bold = false,
  underline = false,
  style,
  onClick,
  children,
  disabled,
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
      disabled={disabled}
    >
      {children}
    </StyledButton>
  );
};

export default Button;

const StyledButton = styled.button`
  padding: ${(props) => props.$padding};
  background-color: ${(props) => props.$backgroundColor || props.theme.primary};
  color: ${(props) => props.$textColor || props.theme.white};
  font-weight: ${(props) => (props.$bold ? "bold" : "normal")};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: ${(props) => props.$fontSize};
  margin-top: ${(props) => props.$marginTop};
  transition: color 0.3s, background-color 0.3s, transform 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    color: ${(props) => props.$hoverTextColor || props.theme.black};
    background-color: ${(props) =>
      props.$hoverBackgroundColor || props.theme.primary};
    transform: scale(0.98);
  }

  ${(props) =>
    props.$underline &&
    `
    &::after {
      content: "";
      display: block;
      width: 100%;
      height: 1px;
      background-color: ${props.$textColor || props.theme.white};
      margin-top: 10px;
    }
  `}
`;
