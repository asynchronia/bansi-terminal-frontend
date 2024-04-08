import React from "react";
import {ReactComponent as ThreeDots} from '../../assets/images/small/three-dots-vertical.svg';
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
  } from 'reactstrap';


const CustomDropdown = ({ isOpen, direction, toggle, items }) => {
  return (
    <div className="items-drop-down-item">
      <Dropdown isOpen={isOpen} direction={direction} toggle={toggle} className="table-action-btn">
        <DropdownToggle> <ThreeDots className='logo' /></DropdownToggle>
        <DropdownMenu>
          {items.map((item, index) => (
            <DropdownItem key={index} onClick={item.onClick}>{item.label}</DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default CustomDropdown;