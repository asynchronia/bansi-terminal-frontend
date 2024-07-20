import React from 'react'

const OrderTrackingRenderer = ({ label, date, color, isCheck }) => {
  return (
    <div className='d-flex w-75 align-items-center gap-2 p-2 rounded' style={{ backgroundColor: color }}>
      <input style={{ margin: '4px', width: '25px', height: '22px', accentColor: 'green' }} type="checkbox" class="larger" name="checkBox2" checked={isCheck ? true : false}></input>
      <div>
        <p className='fw-bold m-0'> {label} </p>
        <p className='fw-normal m-0'>{date}</p>
      </div>
    </div>
  )
}

export default OrderTrackingRenderer