import styled from "styled-components";

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.heading};
  font-weight: bold;
  color: ${({ theme }) => theme.black};
`;

export default PageTitle;
