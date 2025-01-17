import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import { MenuItem } from "@mui/material";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

const CustomMenu = ({ triggerElement, menuItems, arrow }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <TriggerContainer onClick={handleMenuOpen}>
        {React.cloneElement(triggerElement)}
        {arrow && <StyledFontAwesomeIcon icon={faAngleDown} />}
      </TriggerContainer>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        onClose={handleClose}
        open={Boolean(anchorEl)}
      >
        {menuItems.map((item, index) => (
          <StyledMenuItem
            key={index}
            onClick={() => {
              if (item.onClick) {
                item.onClick();
                handleClose();
              }
            }}
            $clickable={React.isValidElement(item) ? false : true}
          >
            {React.isValidElement(item) ? item : item.name}
          </StyledMenuItem>
        ))}
      </Menu>
    </>
  );
};

const TriggerContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const StyledMenuItem = styled(MenuItem)`
  display: flex;
  align-items: center;
  cursor: ${(props) => (props.$clickable ? "pointer" : "default")} !important;
  background-color: ${(props) =>
    props.$clickable ? "inherit" : "white"} !important;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    color: ${(props) => (props.$clickable ? "#f03a47" : "#000000")};
    background-color: ${(props) =>
      props.$clickable ? "rgba(0,0,0,0.08)" : "white"} !important;
  }
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  margin-left: 5px;
`;

export default CustomMenu;
