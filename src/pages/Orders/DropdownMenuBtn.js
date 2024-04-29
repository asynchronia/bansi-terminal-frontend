import React,{useState} from "react";
import CustomDropdown from "../../components/CustomComponents/CustomDropdown";
import "./styles/DropdownMenuBtn.scss";
const DropdownMenuBtn = (props) =>{

    const {handleResponse, handleEditClick,handleViewClick, data} = props;
    const [menu, setMenu] = useState(false);
    const onDeleteOrder = async() => {

    }
    const onEditOrder = () =>{
    
    }
    const onViewClick = () =>{
      handleViewClick(data);
    }
    return (
        <CustomDropdown  
          isOpen={menu}
          direction={'down'}
          toggle={() => setMenu(!menu)}
          items={[
            { label: 'Update Order', onClick: onEditOrder },
            { label: 'View Order', onClick: onViewClick },
            { label: 'Change Status' },
            { label: 'Delete Order', onClick: onDeleteOrder }  
          ]}
        />
      );
}
export default DropdownMenuBtn;