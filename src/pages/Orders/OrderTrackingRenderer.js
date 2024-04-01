import React from 'react'

const OrderTrackingRenderer = ({label, date, color, isCheck}) => {
  return (
     <div 
     style={{
        width: 'auto',
        height: '50px',
        padding: '10px',
        margin: 0,
        backgroundColor: color,
        borderRadius: '10px', 
        marginRight: '30px'
        }}>
    <input style={{margin: '4px', width: '25px', height: '22px', accentColor: 'green'}} type="checkbox" class="larger" name="checkBox2" checked={isCheck ? true : false}></input>
    <div style={{margin: '-31px 40px', fontWeight: 'bold'}}> {label} </div>
    <p style={{margin: '25px 40px', fontWeight: 'lighter', fontSize: '10px'}}>Date: {date}</p>
    </div>
  )
}

export default OrderTrackingRenderer