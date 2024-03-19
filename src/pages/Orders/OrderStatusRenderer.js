import React from 'react'

const OrderStatusRenderer = ({ value }) => {
  let btnClass = '';

  switch (value) {
    case 'draft':
      btnClass = 'btn-outline-primary';
      break;
    case 'closed':
      btnClass = 'btn-outline-danger';
      break;
    case 'open':
      btnClass = 'btn-outline-success';
      break;
    default:
      btnClass = 'btn-outline-secondary';
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <button className={`btn ${btnClass}`} style={{ display: 'block', margin: 'auto' }}>
        {value}
      </button>
    </div>
  );
}

export default OrderStatusRenderer 