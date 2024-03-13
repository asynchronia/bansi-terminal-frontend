import React,{useState} from "react";
import {ReactComponent as ThreeDots} from '../../assets/images/small/three-dots-vertical.svg';
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
  } from 'reactstrap';

import "./styles/DropdownMenuBtn.scss";
const DropdownMenuBtn = (props) =>{
    console.log("call row values"+props);
    const [menu, setMenu] = useState(false)
    return (
        <div>
          <Dropdown isOpen={menu} direction={'bottom'} toggle={() => setMenu(!menu)} className="table-action-btn">
            <DropdownToggle> <ThreeDots className='logo' /></DropdownToggle>
            <DropdownMenu>
              <DropdownItem>View Action</DropdownItem>
              <DropdownItem>Edit Item</DropdownItem>
              <DropdownItem>Delete Item</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      );
}
export default DropdownMenuBtn;