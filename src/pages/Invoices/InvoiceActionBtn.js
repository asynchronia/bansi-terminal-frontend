import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import {ReactComponent as ThreeDots} from '../../assets/images/small/three-dots-vertical.svg';
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
  } from 'reactstrap';
 
import "./styles/InvoiceActionBtn.scss";
const InvoiceActionBtn = (props) =>{

    const {deleteItem, handleEditClick, data} = props;
   const [menu, setMenu] = useState(false);
  
    return (
        <div>
          <Dropdown isOpen={menu} direction={'bottom'} toggle={() => setMenu(!menu)} className="table-action-btn">
            <DropdownToggle> <ThreeDots className='logo' /></DropdownToggle>
            <DropdownMenu>
              <DropdownItem >Edit Item</DropdownItem>
              <DropdownItem>View Item</DropdownItem>
              <DropdownItem>Change Status</DropdownItem>
              <DropdownItem >Delete Item</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      );
}
export default InvoiceActionBtn;