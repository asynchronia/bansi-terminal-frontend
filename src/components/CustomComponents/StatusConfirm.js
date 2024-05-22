import React from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";

const StatusConfirm = (props) => {
  const { type, openModal, setOpenModal, handleSubmitStatus } = props;
  return (
    <Card className="text-center">
     
      <CardBody>
      <CardHeader>
        <h2>Do you want to change the {type} status?</h2>
      </CardHeader>
        <Row>
          <Col>
            <button onClick={handleSubmitStatus} className="btn btn-primary w-xl mb-1">Yes</button>
          </Col>
          <Col>
            <button onClick={()=>{
                setOpenModal({...openModal, status:false})
            }} className="btn btn-secondary w-xl mb-1">No</button>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default StatusConfirm;
