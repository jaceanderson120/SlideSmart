import React from "react";
import styled from "styled-components";

const IconButton = ({ icon, onClick, title, disabled }) => {
  return (
    <Button onClick={onClick} title={title} disabled={disabled}>
      {icon}
    </Button>
  );
};

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.black}; /* Color inherited by the icons */
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

export default IconButton;
