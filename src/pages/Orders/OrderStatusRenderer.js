import React from 'react';
import Chip from '@mui/material/Chip';

const OrderStatusRenderer = ({ value }) => {
  let color = '';
  let label = '';
  switch (value) {
    case 'draft':
      color = "primary";
      label = "Draft";
      break;
    case "closed":
      color = "error";
      label = "Closed";
      break;
    case "open":
      color = "success";
      label = "Open";
      break;
    default:
      return "";
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <Chip color={color} label={label} variant="outlined" />
    </div>
  );
}

export default OrderStatusRenderer;
