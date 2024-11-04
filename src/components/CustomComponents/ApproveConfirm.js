import { Info } from "@mui/icons-material";
import React from "react";
import { ModalBody } from "reactstrap";
import StyledButton from "../Common/StyledButton";

const ApproveConfirm = ({ setApproveModal, handlePurchaseOrderStatusChange, status, isButtonLoading }) => {
  const statusToTextMap = {
    "draft": "Draft",
    "published": "Publish",
    "sent": "Approve",
    "accepted": "Accept",
    "rejected": "Reject",
    "declined": "Declined"
  }
  return (
    <ModalBody className="text-center">
      {/* <Info color="primary" /> */}
      <h5 className="my-3">{`Are You sure you Want to ${statusToTextMap[status]}?`}</h5>
      <div className="d-flex justify-content-center gap-2 my-2">
        <StyledButton
          onClick={() => {
            handlePurchaseOrderStatusChange(status);
          }}
          className="btn btn-primary w-md"
          isLoading={isButtonLoading}
        >
          Yes
        </StyledButton>
        <StyledButton
          onClick={() => {
            setApproveModal(false);
          }}
          className="btn btn-secondary w-md"
        >
          No
        </StyledButton>
      </div>
    </ModalBody>
  );
};

export default ApproveConfirm;

//Merge the published popup and approve reject popup
//Make the accept and decline work in the same popup
