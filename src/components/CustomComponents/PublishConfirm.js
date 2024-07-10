import React from "react";
import { Card, CardBody } from "reactstrap";

const PublishConfirm = ({ setPublishModal, setStatus }) => {
  return (
    <Card>
      <CardBody>
        <h4 className="text-center my-4">Are You sure you Want to Publish?</h4>
        <div className="d-flex justify-content-center gap-2">
          <button
            onClick={() => {
              setPublishModal(false);
              setStatus("published");
            }}
            className="btn btn-secondary w-md"
          >
            Yes
          </button>
          <button
            className="btn btn-primary w-md"
            onClick={() => {
              setPublishModal(false);
              setStatus("draft");
            }}
          >
            No
          </button>
        </div>
      </CardBody>
    </Card>
  );
};

export default PublishConfirm;
