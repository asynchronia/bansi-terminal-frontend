import React from "react";
import { Card, CardBody } from "reactstrap";

const DeleteConfirm = ({ setDeleteModal }) => {
  return (
    <Card>
      <CardBody>
        <h3 className="text-center mt-3">Are You sure you Want to delete?</h3>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <button
            onClick={() => {
              setDeleteModal(false);
            }}
            className="btn btn-secondary mx-3 mt-3 w-lg"
          >
            Yes
          </button>
          <button
          className="btn btn-primary mx-3 mt-3 w-lg"
            onClick={() => {
              setDeleteModal(false);
            }}
          >
            No
          </button>
        </div>
      </CardBody>
    </Card>
  );
};

export default DeleteConfirm;
