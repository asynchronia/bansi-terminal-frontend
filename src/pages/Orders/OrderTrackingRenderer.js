import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material'
import React from 'react'

const OrderTrackingRenderer = ({ label, date, color, isCheck }) => {
  return (
    <div className='d-flex w-75 align-items-center gap-2 p-2 rounded' style={{ backgroundColor: color }}>
      {isCheck ? <CheckBox color="success" /> : <CheckBoxOutlineBlank />}
      <div>
        <p className='fw-bold m-0'> {label} </p>
        <p className='fw-normal m-0'>{date}</p>
      </div>
    </div>
  )
}

export default OrderTrackingRenderer