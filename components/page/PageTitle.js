import styled from "styled-components";
import { fontSize } from "@/constants/fontSize";

const PageTitle = styled.h1`
  font-size: ${fontSize.heading};
  font-weight: bold;
  color: ${({ theme }) => theme.black};
`;

export default PageTitle;
