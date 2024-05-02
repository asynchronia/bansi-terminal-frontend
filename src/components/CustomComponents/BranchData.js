import { useFormik } from "formik";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  Modal,
  Row,
  TabContent,
  Table,
} from "reactstrap";
import { getBranchListReq } from "../../service/branchService";
import { AgGridReact } from "ag-grid-react"; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css";
import AddBranch from "./AddBranch";
import * as Yup from "yup";
import { TableHead } from "@mui/material";
import ActionComponent from "./ActionComponent";

const BranchData = (props) => {
  const { handleSubmit, clientId, openModal, setOpenModal, handleToggle } =
    props;

  const [branchData, setBranchData] = useState([]);
  const [page, setPage] = useState(1);

  const getBranchData = async () => {
    try {
      const response = await getBranchListReq({
        clientId: clientId,
        page: page,
        limit: 5,
      });
      let array = response?.payload?.branches;
      const newArray = array.map((item) => ({
        _id: item._id,
        Name: item.name,
        isPrimary: item.isPrimary,
        AssociatedWarehouse: item.associatedWarehouse.code,
        Contact: item.contact,
      }));

      setBranchData(newArray);
    } catch (error) {}
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
      handleSubmit(newBranch);
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
            className="form-horizontal mt-4"
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "15px 15px 0px",
              }}
            >
              <h4 className="card-title mt-2">Add Branch</h4>
              <Row>
                <Col>
                  <Button
                    type="button"
                    outline
                    color="danger"
                    className="waves-effect waves-light"
                    onClick={() => {
                      setOpenModal({ ...openModal, branch: false });
                    }}
                  >
                    Close
                  </Button>
                </Col>
                <Col>
                  {" "}
                  <button
                    type="submit"
                    className="btn btn-primary waves-effect waves-light "
                    onClick={() => {
                      //   handleSubmitAgreement();
                      setOpenModal({ ...openModal, branch: false });
                    }}
                  >
                    Save
                  </button>
                </Col>
              </Row>
            </div>
            <AddBranch validation={validation} />
          </Form>
        </div>
      </Modal>
      <div style={{ maxHeight: 309, width: "100%", overflowX: "scroll" }}>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Associated Warehouse</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            {branchData.length > 0 ? (
              branchData.map((branch) => (
                <tr key={branch._id}>
                  <td>{branch.Name}</td>
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
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td></td>
                <td style={{ textAlign: "center" }}>No Rows to Show</td>
                <td></td>
              </tr>
            )}
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
