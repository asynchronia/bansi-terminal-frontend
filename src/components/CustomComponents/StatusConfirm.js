import React from "react";
import { Col, ModalBody, ModalHeader, Row } from "reactstrap";

const StatusConfirm = (props) => {
  const { type, openModal, setOpenModal, handleSubmitStatus } = props;
  return (
    <ModalBody>
      <h5 className="text-center my-3">Do you want to change the {type} status?</h5>
      <div className="d-flex justify-content-center gap-2">
        <button onClick={handleSubmitStatus} className="btn btn-primary w-md">Yes</button>
        <button onClick={() => {
          setOpenModal({ ...openModal, status: false })
        }} className="btn btn-secondary w-md">No</button>
      </div>
    </ModalBody>
  );
};

export default StatusConfirm;
