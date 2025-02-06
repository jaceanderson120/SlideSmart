import styled from "styled-components";
import { colors } from "@/constants/colors";
import Navbar from "./Navbar";

const PageContainer = ({ children }) => {
  return (
    <Container>
      <Navbar />
      {children}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  background-color: ${colors.lightGray};
`;

export default PageContainer;
