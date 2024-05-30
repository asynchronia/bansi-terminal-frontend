import React from 'react';
import Chip from '@mui/material/Chip';

const OrderStatusRenderer = ({ value }) => {
  let color = '';
  let label = '';
  let classname = '';
  switch (value) {
    case 'draft':
      color = "info";
      label = "Draft";
      classname="mr-2";
      break;
    case "closed":
      color = "error";
      label = "Closed";
      break;
    case 'published' || "Published":
      color = "success";
      label = "Published";
      break;
    default:
      return "";
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <Chip color={color} className = {classname} label={label} variant="outlined" />
    </div>
  );
}

export default OrderStatusRenderer;
