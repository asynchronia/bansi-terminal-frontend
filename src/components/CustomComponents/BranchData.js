import { Chip } from "@mui/material";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal, ModalBody, ModalHeader, Spinner, Table } from "reactstrap";
import * as Yup from "yup";
import { getBranchListReq } from "../../service/branchService";
import ActionComponent from "./ActionComponent";
import AddBranch from "./AddBranch";

const BranchData = (props) => {
  const { handleSubmit, clientId, openModal, setOpenModal, handleToggle } = props;

  const [branchData, setBranchData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(null);

  const getBranchData = async () => {
    try {
      setLoading(true);
      const response = await getBranchListReq({
        clientId: clientId,
        page: 1,
        limit: 5,
      });
      let array = response?.payload?.branches;
      const newArray = array.map((item) => ({
        _id: item._id,
        Name: item.name,
        isPrimary: item.isPrimary,
        AssociatedWarehouse: item.associatedWarehouse?.code,
        Contact: item.contact,
      }));
      setBranchData(newArray);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getBranchData();
  }, []);

  //For creating new Branch need Formik for validation schema
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      primaryBranch: {
        name: null,
        address: null,
        associatedWarehouse: "65f4b5d66959ec3852a37e60",
        contact: null,
      },
    },
    validationSchema: Yup.object({
      primaryBranch: Yup.object().shape({
        name: Yup.string().required("Please Enter Branch Name"),
        address: Yup.string().required("Please Enter Branch Address"),
        contact: Yup.string().required("Please Enter Valid Contact Number"),
      }),
    }),
    onSubmit: (values) => {
      const newBranch = { ...values.primaryBranch, clientId: clientId };
      handleSubmit(newBranch, edit);
    },
  });

  return (
    <div>
      <Modal
        size="lg"
        isOpen={openModal.branch}
        toggle={() => {
          handleToggle("branch");
        }}
      >
        <div>
          <Form
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
          >
            <div class="modal-header">
              <div className="d-flex justify-content-between align-items-center w-100">
                <h5 className="modal-title">Add Branch</h5>
                <div className="d-flex gap-1">
                  <Button color="primary" outline onClick={() => { setOpenModal({ ...openModal, branch: false }) }}>Close</Button>
                  <Button color="primary" type="submit" >Save</Button>
                </div>
              </div>
            </div>
            <ModalBody>
              <AddBranch validation={validation} />
            </ModalBody>
          </Form>
        </div>
      </Modal>
      <div style={{ maxHeight: 300, width: "100%", overflow: "auto" }}>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Associated Warehouse</th>
              <th colSpan={2}>Contact</th>
            </tr>
          </thead>
          <tbody>
            {loading ?
              <tr>
                <td colSpan={4} style={{ textAlign: "center" }}>
                  <Spinner />
                  <h5 className="m-2">Loading...</h5>
                </td>
              </tr> :
              <>{
                branchData.length > 0 ? (
                  branchData.map((branch) => (
                    <tr key={branch._id} style={{ verticalAlign: 'middle' }}>
                      <td>
                        {branch.Name}{" "}
                        <span>
                          {" "}
                          {branch.isPrimary ? (
                            <Chip className="mx-1" size="sm" label="Primary" />
                          ) : null}
                        </span>
                      </td>
                      <td>{branch.AssociatedWarehouse}</td>
                      <td>{branch.Contact}</td>
                      <td>
                        <ActionComponent
                          openModal={openModal}
                          setOpenModal={setOpenModal}
                          type={"branch"}
                          data={branch}
                          clientId={clientId}
                          validation={validation}
                          setEdit={setEdit}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center" }}>No Rows to Show</td>
                  </tr>
                )
              }</>}
          </tbody>
        </Table>
      </div>
      <div className="text-center">
        <Button
          onClick={() => {
            setOpenModal({ ...openModal, branch: true });
          }}
          className="mt-3 btn-primary"
        >
          Add Branch
        </Button>
      </div>
    </div>
  );
};

export default BranchData;
