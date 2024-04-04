
import React,{useState} from "react";
import {ReactComponent as ThreeDots} from '../../assets/images/small/three-dots-vertical.svg';
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
  } from 'reactstrap';
 
import "./styles/ClientActionField.scss";
const CientActionField = (props) =>{

    const {handleViewClick, data} = props;
   const [menu, setMenu] = useState(false);

    const onViewClick = () =>{
      handleViewClick(data._id);
    }
    return (
        <div className="client-drop-down-item">
          <Dropdown isOpen={menu} direction={'bottom'} toggle={() => setMenu(!menu)} className="table-action-btn">
            <DropdownToggle> <ThreeDots className='logo' /></DropdownToggle>
            <DropdownMenu>
              <DropdownItem>Update Client</DropdownItem>
              <DropdownItem onClick={onViewClick}>View CLient</DropdownItem>
              <DropdownItem>Change Status</DropdownItem>
              <DropdownItem>Delete Client</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      );
}
export default CientActionField;
