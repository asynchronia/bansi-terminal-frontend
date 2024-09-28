import React, { useState } from "react";
import CustomDropdown from "../../components/CustomComponents/CustomDropdown";
import "./styles/DropdownMenuBtn.scss";
const DropdownMenuBtn = (props) => {

  const { handleResponse, handleEditClick, handleViewClick, data, label } = props;

  const [menu, setMenu] = useState(false);
  const onDeleteOrder = async () => {

  }

  const onEditOrder = () => {
    handleEditClick(data);
  }
  const onViewClick = () => {
    handleViewClick(data);
  }

  const items = [
    { label: label ? label : 'View Order', onClick: onViewClick },
    // { label: 'Delete Order', onClick: onDeleteOrder }
  ]

  return (
    <CustomDropdown
      isOpen={menu}
      direction={'down'}
      toggle={() => setMenu(!menu)}
      items={items}
    />
  );
}
export default DropdownMenuBtn;