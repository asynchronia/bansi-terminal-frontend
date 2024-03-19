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

    const {handleResponse, handleEditClick, data} = props;
    const [menu, setMenu] = useState(false);
    const onDeleteOrder = async() => {

    }
    const onEditOrder = () =>{
    
    }
    return (
        <div>
          <Dropdown isOpen={menu} direction={'bottom'} toggle={() => setMenu(!menu)} className="table-action-btn">
            <DropdownToggle> <ThreeDots className='logo' /></DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={onEditOrder}>Edit Item</DropdownItem>
              <DropdownItem>View Item</DropdownItem>
              <DropdownItem>Change Status</DropdownItem>
              <DropdownItem onClick={onDeleteOrder}>Delete Order</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      );
}
export default DropdownMenuBtn;