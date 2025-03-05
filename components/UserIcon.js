import styled from "styled-components";

const UserIcon = ({
  initials = "?", // Default to "?" if no initials are provided
  color, // Default black color
  hoverColor, // Default white hover color
  backgroundColor, // Default light gray background
  hoverBackgroundColor, // Default darker gray on hover
  size = 32, // Default size in pixels
  ...props
}) => {
  return (
    <CircleIcon
      $backgroundColor={backgroundColor}
      $hoverBackgroundColor={hoverBackgroundColor}
      $color={color}
      $hoverColor={hoverColor}
      $size={size}
      {...props}
    >
      {initials}
    </CircleIcon>
  );
};

export default UserIcon;

const CircleIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSize.secondary};
  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
  border-radius: 50%;
  background-color: ${(props) => props.$backgroundColor || props.theme.gray};
  color: ${(props) => props.$color || props.theme.white};
  transition: background-color 0.3s, color 0.3s;
  &:hover {
    background-color: ${(props) =>
      props.$hoverBackgroundColor || props.theme.primary};
    color: ${(props) => props.$hoverColor || props.theme.white};
  }
`;
