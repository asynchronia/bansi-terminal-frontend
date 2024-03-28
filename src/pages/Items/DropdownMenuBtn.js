import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import {ReactComponent as ThreeDots} from '../../assets/images/small/three-dots-vertical.svg';
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
  } from 'reactstrap';
 
import "./styles/DropdownMenuBtn.scss";
const DropdownMenuBtn = (props) =>{
    const {deleteItem, handleEditClick, data, handleViewClick} = props;
    const [menu, setMenu] = useState(false);
    const onDeleteItem = () => {
      deleteItem(data);
    }
    const onEditClick = () =>{
      console.log("id passed for " + data.title + " with id "+data._id);
      handleEditClick(data._id);
    }
    const onViewClick = () =>{
      handleViewClick(data);
    }
    return (
        <div className="drop-down-item">
          <Dropdown isOpen={menu} direction={'bottom'} toggle={() => setMenu(!menu)} className="table-action-btn">
            <DropdownToggle> <ThreeDots className='logo' /></DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={onEditClick}>Edit Item</DropdownItem>
              <DropdownItem onClick={onViewClick}>View Item</DropdownItem>
              <DropdownItem>Change Status</DropdownItem>
              <DropdownItem onClick={onDeleteItem}>Delete Item</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      );
}
export default DropdownMenuBtn;