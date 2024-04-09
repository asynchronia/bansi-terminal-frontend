import React, { useEffect, useRef, useState,useCallback } from "react";
// import React, { useState } from 'react';
// import { useCallback } from 'react';
import { Card, CardBody, Row, Col } from 'reactstrap';
import Chip from '@mui/material/Chip';
import { getUserRoleListReq } from '../../service/usersService';
import { ReactComponent as Edit } from "../../assets/images/svg/edit-button.svg"
import { ReactComponent as Delete } from "../../assets/images/svg/delete-button.svg"

const UserCardDetails = (user) => {

    const [userRole, setUserRole] = useState('');
    const effectCalled = useRef(false); 
    const color = user?.usersData?.status==="active" ? '#2ecc71' : "red";
    const roleData = useCallback(async (body) => {
      const response = await getUserRoleListReq(user.usersData.role);
      if (response && response.payload) {
          setUserRole(response?.payload.roles.filter(role=>role._id===user.usersData.role)[0].title);
      } 
    });  

    
    useEffect(() => {
      if (!effectCalled.current) {
        roleData();
        effectCalled.current=true;
      }
    },[]); 
    // warehouseData();

    return (
    <Card style={ user?.usersData?.associatedBranch?.isPrimary ? { border: '2px solid blue' } : {border: 'none'}}>
      <CardBody>
        <Row className="align-items-center">
          <Col xs="auto">
            <div className="circle-active" style={{ backgroundColor: color , width: '15px', height: '15px', borderRadius: '50%' }}></div>
          </Col>
          <Col>
            <h3 className="card-title">{user?.usersData?.firstName} {user?.usersData?.lastName}</h3>
          </Col>
          <Col xs="auto" className="ml-auto">
            <Edit style={{cursor:'pointer', marginRight:'0.4rem'}} />
            <Delete style={{cursor:'pointer'}}/>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <div className="d-flex flex-wrap">
              {user?.usersData?.associatedWarehouses.map((warehouse, index) => (
                <Chip key={index} label={warehouse.code} className="mr-2"/>
              ))}
            </div>
          </Col>
        </Row>
        <Row className="mt-3">
        <Col xs="6">
            <p>Role</p>
        </Col>
        <Col xs="6">
            <p>{userRole}</p>
        </Col>
        <Col xs="6">
            <p>Contact</p>
        </Col>
        <Col xs="6">
            <p>{user?.usersData?.email}</p>
        </Col> 
        </Row>
      </CardBody>
      { user?.usersData?.associatedBranch?.isPrimary ? <div style={{fontSize:'0.9em', backgroundColor: '#e5f3f7', width:'8.5rem', borderRadius: '0.2rem', margin: '0 17rem', marginLeft: '34.99rem', textAlign: 'center'}}>Primary Warehouse</div> : <div></div> }  
        
    </Card>
  );
};

export default UserCardDetails;
