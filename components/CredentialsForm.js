import styled from "styled-components";
import { colors } from "@/constants/colors";

const CredentialsForm = ({ children }) => {
  return <Form>{children}</Form>;
};

export default CredentialsForm;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30%;
  background-color: ${colors.white};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    width: 80%;
  }
`;
