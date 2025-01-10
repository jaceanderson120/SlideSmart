import { fontSize } from "@/constants/fontSize";
import styled from "styled-components";

// The $ before the prop name is a convention to indicate that the prop is a styled component prop

const UserIcon = ({
  initials = "?", // Default to "?" if no initials are provided
  color = "#ffffff", // Default black color
  hoverColor = "#ffffff", // Default white hover color
  backgroundColor = "#9c9c9c", // Default light gray background
  hoverBackgroundColor = "#f03a47", // Default darker gray on hover
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
  font-size: ${fontSize.secondary};
  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
  border-radius: 50%;
  background-color: ${(props) => props.$backgroundColor};
  color: ${(props) => props.$color};
  transition: background-color 0.3s, color 0.3s;
  &:hover {
    background-color: ${(props) => props.$hoverBackgroundColor};
    color: ${(props) => props.$hoverColor};
  }
`;
