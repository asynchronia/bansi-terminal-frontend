import React, { useState } from "react";
import CustomDropdown from "../../components/CustomComponents/CustomDropdown";

import "./styles/ClientActionField.scss";
const CientActionField = (props) => {

  const { handleViewClick, data } = props;
  const [menu, setMenu] = useState(false);

  const onViewClick = () => {
    handleViewClick(data._id);
  }
  return (
    <CustomDropdown
      isOpen={menu}
      direction={'down'}
      toggle={() => setMenu(!menu)}
      items={[
        { label: 'View Client', onClick: onViewClick },
        // { label: 'Update Client' },
        // { label: 'Change Status' },
        // { label: 'Delete Item' }
      ]}
    />
  );
}
export default CientActionField;
