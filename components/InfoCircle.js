import styled from "styled-components";

const InfoCircle = () => {
  return (
    <CircleContainer>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        <circle cx="50" cy="50" r="50" fill="#fce2e4" />
      </svg>
    </CircleContainer>
  );
};

const CircleContainer = styled.div`
  width: 80vh;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default InfoCircle;
