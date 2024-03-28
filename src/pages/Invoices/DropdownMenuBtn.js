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
    const {data, handleViewClick} = props;
    const [menu, setMenu] = useState(false);

    const onViewClick = () =>{
      handleViewClick(data);
    }
    return (
        <div className="drop-down-item">
          <Dropdown isOpen={menu} direction={'bottom'} toggle={() => setMenu(!menu)} className="table-action-btn">
            <DropdownToggle> <ThreeDots className='logo' /></DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={onViewClick}>View Item</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      );
}
export default DropdownMenuBtn;