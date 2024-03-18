import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import {ReactComponent as ThreeDots} from '../../assets/images/small/three-dots-vertical.svg';
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
  } from 'reactstrap';
  import {deletItemReq } from "../../service/itemService";
import "./styles/DropdownMenuBtn.scss";
const DropdownMenuBtn = (props) =>{

    const {handleResponse, handleEditClick, data} = props;
   const [menu, setMenu] = useState(false);
    const onDeleteItem = async() => {
      try {
        const response = await deletItemReq({"_id":data._id});
        if (response.success === true) {
         handleResponse(response);
        } else {
          handleResponse(response);
        }
      } catch (error) {
        console.log("ERROR  "+error);
        handleResponse(error);
      }
    }
    const onEditClick = () =>{
      console.log("id passed for " + data.title + " with id "+data._id);
      handleEditClick(data._id);
    }
    return (
        <div>
          <Dropdown isOpen={menu} direction={'bottom'} toggle={() => setMenu(!menu)} className="table-action-btn">
            <DropdownToggle> <ThreeDots className='logo' /></DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={onEditClick}>Edit Item</DropdownItem>
              <DropdownItem>View Item</DropdownItem>
              <DropdownItem>Change Status</DropdownItem>
              <DropdownItem onClick={onDeleteItem}>Delete Item</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      );
}
export default DropdownMenuBtn;