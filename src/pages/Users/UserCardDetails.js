import React from 'react';
import { Card, CardBody, Row, Col, Button } from 'reactstrap';
import Chip from '@mui/material/Chip';


const UserCardDetails = (user) => {

    console.log("user"+JSON.stringify(user));
    const color = user?.usersData?.status==="active" ? '#2ecc71' : "red";

    return (
    <Card>
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
              <Chip label="Chip 1" className="mr-2"/>
            </div>
          </Col>
        </Row>
        <Row className="mt-3">
        <Col xs="6">
            <p>Role</p>
        </Col>
        <Col xs="6">
            <p>{user?.usersData?.role}</p>
        </Col>
        <Col xs="6">
            <p>Contact</p>
        </Col>
        <Col xs="6">
            <p>{user?.usersData?.email}</p>
        </Col> 
        </Row>
      </CardBody>
    </Card>
  );
};

export default UserCardDetails;
