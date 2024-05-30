import React from "react";
import { Card, CardBody } from "reactstrap";

const ApproveConfirm = ({ setApproveModal,handlePurchaseOrderStatusChange }) => {
  return (
    <Card>
      <CardBody>
        <h3 className="text-center mt-3">Are You sure you Want to Approve?</h3>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <button
            onClick={() => {
              setApproveModal(false);
              handlePurchaseOrderStatusChange();

            }}
            className="btn btn-secondary mx-3 mt-3 w-lg"
          >
            Yes
          </button>
          <button
          className="btn btn-primary mx-3 mt-3 w-lg"
            onClick={() => {
              setApproveModal(false);
            }}
          >
            No
          </button>
        </div>
      </CardBody>
    </Card>
  );
};

export default ApproveConfirm;
