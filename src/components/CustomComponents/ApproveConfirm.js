import { Info } from "@mui/icons-material";
import React from "react";
import { Button, ModalBody } from "reactstrap";

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
    <ModalBody className="text-center">
      <Info color="primary" />
      <h5 className="my-3">{`Are You sure you Want to ${statusToTextMap[status]}?`}</h5>
      <div className="d-flex justify-content-center gap-1 my-2">
        <Button color="primary" block
          onClick={() => {
            setApproveModal(false);
            handlePurchaseOrderStatusChange(status);
          }}
        >
          Yes
        </Button>
        <Button outline color="primary" block
          onClick={() => {
            setApproveModal(false);
          }}
        >
          No
        </Button>
      </div>
    </ModalBody>
  );
};

export default ApproveConfirm;

//Merge the published popup and approve reject popup
//Make the accept and decline work in the same popup
