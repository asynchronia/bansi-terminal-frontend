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
      classname = "mr-2";
      break;
    case 'published' || "Published":
      color = "success";
      label = "Published";
      break;
    case 'approved':
      color = "success";
      label = "Approved";
      break;
    case "sent":
      color = "error";
      label = "Sent";
      break;
    case "accepted":
      color = "primary";
      label = "Accepted";
      break;
    case "rejected":
      color = "warning";
      label = "Rejected";
      break;
    default:
      return "";
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <Chip color={color} className={classname} label={label} variant="outlined" />
    </div>
  );
}

export default OrderStatusRenderer;
