import styled from "styled-components";
import { MenuItem } from "@mui/material";

const StyledMenuItem = (props) => {
  const { children, onClick } = props;
  return <MyMenuItem onClick={onClick}>{children}</MyMenuItem>;
};

export default StyledMenuItem;

const MyMenuItem = styled(MenuItem)`
  &:hover {
    transition: color 0.3s;
    color: #f03a47;
  }
`;
