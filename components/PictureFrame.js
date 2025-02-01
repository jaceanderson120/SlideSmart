import styled, { css } from "styled-components";
import Image from "next/image";
import { colors } from "@/constants/colors";

const PictureFrame = ({ src, alt, align }) => {
  return (
    <Frame align={align}>
      <StyledImage src={src} alt={alt} />
    </Frame>
  );
};

export default PictureFrame;

const Frame = styled.div`
  border-radius: 8px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.5);
  padding: 16px;
  background-color: ${colors.white};

  ${({ align }) =>
    align === "left"
      ? css`
          border-left: 24px solid ${colors.primary70};
          border-top: 24px solid ${colors.primary70};
        `
      : align === "right"
      ? css`
          border-right: 24px solid ${colors.primary70};
          border-top: 24px solid ${colors.primary70};
        `
      : css`
          border-top: 24px solid ${colors.primary70};
        `}
`;

const StyledImage = styled(Image)`
  width: 100%;
  height: 100%;
`;
