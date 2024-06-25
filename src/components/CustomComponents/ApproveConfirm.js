import React from "react";
import { Card, CardBody } from "reactstrap";

const ApproveConfirm = ({ setApproveModal, handlePurchaseOrderStatusChange, status }) => {
  console.log(`APPROVE CONFIRM MODAL CALLED WITH SET STATUS VALUE: ${status}`);
  const statusToTextMap = {
    "draft": "Draft",
    "published": "Publish",
    "sent": "Approve",
    "accepted": "Accept",
    "rejected": "Reject",
  }
  return (
    <Card>
      <CardBody>
        <h3 className="text-center mt-3">{`Are You sure you Want to ${statusToTextMap[status]}?`}</h3>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <button
            onClick={() => {
              setApproveModal(false);
              handlePurchaseOrderStatusChange(status);
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

//Merge the published popup and approve reject popup
//Make the accept and decline work in the same popup
