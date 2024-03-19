import React from 'react';

const CircleRenderer = ({ value }) => {
  let color = '';

  switch (value) {
    case 'invoiced':
    case 'paid':
    case 'done':
      color = '#2ecc71';
      break;
    case 'not_invoiced':
    case 'unpaid':
    case 'pending':
      color = '#e74c3c';
      break;
    // Add more cases for other statuses if needed
    default:
      color = '#95a5a6';
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <div
        style={{
          width: '15px',
          height: '15px',
          borderRadius: '50%',
          backgroundColor: color,
        }}
      ></div>
    </div>
  );
};

export default CircleRenderer;
