import styled, { css } from "styled-components";
import Image from "next/image";

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
  box-shadow: 0px 4px 4px ${({ theme }) => theme.black};
  padding: 16px;
  background-color: ${({ theme }) => theme.white};

  ${({ align }) =>
    align === "left"
      ? css`
          border-left: 24px solid ${({ theme }) => theme.lightGray};
          border-top: 24px solid ${({ theme }) => theme.lightGray};
        `
      : align === "right"
      ? css`
          border-right: 24px solid ${({ theme }) => theme.lightGray};
          border-top: 24px solid ${({ theme }) => theme.lightGray};
        `
      : css`
          border-top: 24px solid ${({ theme }) => theme.lightGray};
        `}
`;

const StyledImage = styled(Image)`
  width: 100%;
  height: 100%;
`;
