import React, { useState } from "react";
import { Button, ModalBody } from "reactstrap";
import { purchaseOrderStatusChangeReq } from "../../service/purchaseService";
import { toast } from "react-toastify";
import StyledButton from "../Common/StyledButton";

const PublishConfirm = ({ setPublishModal, setStatus, id }) => {
  const [isLoading, setIsLoading] = useState(false);
  async function updateStatusToPublished() {
    try {
      setIsLoading(true);
      const res = await purchaseOrderStatusChangeReq({ purchaseOrderId: id, status: "published" });
      if (res.payload.success) {
        setStatus("published");
        toast.success("Purchase Order Published Successfully!");
      } else {
        toast.error("Sorry, something went wrong!");
      }
    } catch (error) {
      toast.error("Sorry, something went wrong!");
    } finally {
      setPublishModal(false);
      setIsLoading(false);
    }
  }
  return (
    <ModalBody className="p-4">
      <h4 className="text-center mb-4">Are You sure you Want to Publish?</h4>
      <div className="d-flex justify-content-center gap-2">
        <StyledButton
          color={"primary"}
          className={"w-md"}
          onClick={updateStatusToPublished}
          isLoading={isLoading}
        >
          Yes
        </StyledButton>
        <StyledButton
          color={"secondary"}
          className={"w-md"}
          onClick={() => {
            setPublishModal(false);
            setStatus("draft");
          }}
        >
          No
        </StyledButton>
      </div>
    </ModalBody>
  );
};

export default PublishConfirm;
