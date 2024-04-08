import React,{useState} from "react";
import CustomDropdown from "../../components/CustomComponents/CustomDropdown";
 
import "./styles/DropdownMenuBtn.scss";
const DropdownMenuBtn = (props) =>{
    const {deleteItem, handleEditClick, data, handleViewClick} = props;
    const [menu, setMenu] = useState(false);
    const onDeleteItem = () => {
      deleteItem(data);
    }
    const onEditClick = () =>{
      handleEditClick(data._id);
    }
    const onViewClick = () =>{
      handleViewClick(data._id);
    }
    return (
       <CustomDropdown 
          isOpen={menu}
          direction={'bottom'}
          toggle={() => setMenu(!menu)}
          items={[
            { label: 'Edit Item', onClick: onEditClick },
            { label: 'View Item', onClick: onViewClick },
            { label: 'Change Status' },
            { label: 'Delete Item', onClick: onDeleteItem }
          ]}
       />
      );
}
export default DropdownMenuBtn;