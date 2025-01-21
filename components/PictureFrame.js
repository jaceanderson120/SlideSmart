import styled from "styled-components";
import Image from "next/image";

const PictureFrame = ({ src, alt }) => {
  return (
    <Frame>
      <StyledImage src={src} alt={alt} />
    </Frame>
  );
};

export default PictureFrame;

const Frame = styled.div`
  border-right: 8px solid #f03a4770;
  border-top: 8px solid #f03a4770;
  border-radius: 8px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
  padding: 16px;
  background-color: #ffffff;
`;

const StyledImage = styled(Image)`
  width: 100%;
  height: 100%;
`;
