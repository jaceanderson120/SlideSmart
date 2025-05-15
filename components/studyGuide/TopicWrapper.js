import styled from "styled-components";

const TopicWrapper = ({ children }) => {
  return <Container>{children}</Container>;
}

export default TopicWrapper;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-right: 16px;
  padding-left: 16px;
  padding-bottom: 16px;
  gap: 16px;
  width: 100%;
  background-color: ${({ theme }) => theme.white};
  border-radius: 12px;
  box-shadow: 10px 10px 10px ${({ theme }) => theme.shadow};
  border-left: 4px solid ${({ theme }) => theme.primary33};
  border-top: 4px solid ${({ theme }) => theme.primary33};
`;
