import React,{useState} from "react";
import {ReactComponent as ThreeDots} from '../../assets/images/small/three-dots-vertical.svg';
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
  } from 'reactstrap';
 
import "./styles/InvoiceActionBtn.scss";
const InvoiceActionBtn = (props) =>{
   const [menu, setMenu] = useState(false);
  
    return (
        <div className="invoice-drop-down-item">
          <Dropdown isOpen={menu} direction={'bottom'} toggle={() => setMenu(!menu)} className="table-action-btn">
            <DropdownToggle> <ThreeDots className='logo' /></DropdownToggle>
            <DropdownMenu>
              <DropdownItem>View Invoice</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      );
}
export default InvoiceActionBtn;