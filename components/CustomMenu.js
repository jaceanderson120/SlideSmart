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
              item.onClick();
              handleClose();
            }}
          >
            {item.name}
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
  &:hover {
    transition: color 0.3s;
    color: #f03a47;
  }
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  margin-left: 5px;
`;

export default CustomMenu;
