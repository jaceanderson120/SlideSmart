import styled from "styled-components";
import { colors } from "@/constants/colors";
import { fontSize } from "@/constants/fontSize";

const OrLine = () => {
  return (
    <HorizontalLine>
      <OrText>OR</OrText>
    </HorizontalLine>
  );
};

export default OrLine;

const HorizontalLine = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  width: 100%;
  margin: 16px 0;

  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid ${colors.gray};
  }

  &::before {
    margin-right: 10px;
  }

  &::after {
    margin-left: 10px;
  }
`;

const OrText = styled.span`
  font-size: ${fontSize.secondary};
  color: ${colors.gray};
`;
