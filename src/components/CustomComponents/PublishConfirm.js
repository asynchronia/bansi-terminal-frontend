import React from "react";
import { Button, ModalBody } from "reactstrap";

const PublishConfirm = ({ setPublishModal, setStatus }) => {
  return (
    <ModalBody className="p-4">
      <h4 className="text-center mb-4">Are You sure you Want to Publish?</h4>
      <div className="d-flex justify-content-center gap-2">
        <Button color="primary" block
          onClick={() => {
            setPublishModal(false);
            setStatus("published");
          }}
        >
          Yes
        </Button>
        <Button outline color="primary" block
          onClick={() => {
            setPublishModal(false);
            setStatus("draft");
          }}
        >
          No
        </Button>
      </div>
    </ModalBody>
  );
};

export default PublishConfirm;
