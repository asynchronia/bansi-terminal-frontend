import React, { useState } from "react";
import CustomDropdown from "../../components/CustomComponents/CustomDropdown";

import "./styles/DropdownMenuBtn.scss";
import { MODULES_ENUM, PERMISSIONS_ENUM } from "../../utility/constants";
const DropdownMenuBtn = (props) => {
  const { deleteItem, handleEditClick, data, handleViewClick } = props;
  const [menu, setMenu] = useState(false);
  const onDeleteItem = () => {
    deleteItem(data);
  };
  const onEditClick = () => {
    handleEditClick(data._id);
  };
  const onViewClick = () => {
    handleViewClick(data._id);
  };
  return (
    <CustomDropdown
      isOpen={menu}
      direction={"down"}
      toggle={() => setMenu(!menu)}
      items={
        data.status != "published"
          ? [
              {
                label: "Edit Item",
                onClick: onEditClick,
                module: MODULES_ENUM.ITEMS,
                permission: PERMISSIONS_ENUM.UPDATE,
              },
              { label: "View Item", onClick: onViewClick },
              {
                label: "Change Status",
                module: MODULES_ENUM.ITEMS,
                permission: PERMISSIONS_ENUM.UPDATE,
              },
              {
                label: "Delete Item",
                onClick: onDeleteItem,
                module: MODULES_ENUM.ITEMS,
                permission: PERMISSIONS_ENUM.DELETE,
              },
            ]
          : [
              { label: "View Item", onClick: onViewClick },
              {
                label: "Change Status",
                module: MODULES_ENUM.ITEMS,
                permission: PERMISSIONS_ENUM.UPDATE,
              },
              {
                label: "Delete Item",
                onClick: onDeleteItem,
                module: MODULES_ENUM.ITEMS,
                permission: PERMISSIONS_ENUM.DELETE,
              },
            ]
      }
    />
  );
};
export default DropdownMenuBtn;
