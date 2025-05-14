import styled from "styled-components";

const InfoContainer = ({ children }) => {
  return <Container>{children}</Container>;
};

export default InfoContainer;

const Container = styled.div`
  display: flex;
  flex: 2.5;
  flex-direction: column;
  width: 100%;
  gap: 32px;
  overflow: scroll;
  scrollbar-color: ${({ theme }) => theme.primary70} transparent;
  padding: 16px;
`;
