import { colors } from "@/constants/colors";
import React from "react";
import styled from "styled-components";

const DecorationCircle = ({ diameter, left, right, top, bottom }) => {
  return (
    <CircleContainer
      $left={left}
      $right={right}
      $top={top}
      $bottom={bottom}
      $diameter={diameter}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        <circle cx="50" cy="50" r="50" fill={colors.primary} />
      </svg>
    </CircleContainer>
  );
};

const CircleContainer = styled.div`
  width: ${({ $diameter }) => $diameter}vh;
  height: ${({ $diameter }) => $diameter}vh;
  position: absolute;
  left: ${({ $left }) => $left};
  right: ${({ $right }) => $right};
  top: ${({ $top }) => $top};
  bottom: ${({ $bottom }) => $bottom};
  z-index: -1;
`;

export default DecorationCircle;
