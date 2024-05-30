import React from "react";
import { Card, CardBody } from "reactstrap";

const PublishConfirm = ({ setPublishModal,setStatus }) => {
  return (
    <Card>
      <CardBody>
        <h3 className="text-center mt-3">Are You sure you Want to Publish?</h3>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <button
            onClick={() => {
              setPublishModal(false);
              setStatus("published");
            }}
            className="btn btn-secondary mx-3 mt-3 w-lg"
          >
            Yes
          </button>
          <button
          className="btn btn-primary mx-3 mt-3 w-lg"
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
