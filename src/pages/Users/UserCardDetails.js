import React, { useState } from 'react';
import { useCallback } from 'react';
import { Card, CardBody, Row, Col, Button } from 'reactstrap';
import Chip from '@mui/material/Chip';
import { getUserRoleListReq, getUserWarehouseListReq } from '../../service/usersService';


const UserCardDetails = (user) => {

    const [userRole, setUserRole] = useState('');

    // console.log("user"+JSON.stringify(user));
    const color = user?.usersData?.status==="active" ? '#2ecc71' : "red";
    // console.log(user?.usersData?.associatedBranch?.isPrimary);
    
    const roleData = useCallback(async (body) => {
      const response = await getUserRoleListReq(user.usersData.role);
      if (response && response.payload) {
          // console.log(user.usersData.role);
          // console.log(response?.payload.roles.filter(role=>role._id===user.usersData.role)[0].title);
          setUserRole(response?.payload.roles.filter(role=>role._id===user.usersData.role)[0].title);
      } 
    });  
     

    roleData();
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
            <Button color="secondary">
              <i className="mdi mdi-account-edit"></i>
            </Button>
            <Button color="danger">
              <i className="mdi mdi-close-circle"></i>
            </Button>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <div className="d-flex flex-wrap">
              {user?.usersData?.associatedBranch?.name ?
               <Chip label={user?.usersData?.associatedBranch?.name} className="mr-2"/>
                : null }
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
