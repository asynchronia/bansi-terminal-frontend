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
  Table,
} from "reactstrap";
import { getBranchListReq } from "../../service/branchService";
import { AgGridReact } from "ag-grid-react"; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css";
import AddBranch from "./AddBranch";
import * as Yup from "yup";

const BranchData = (props) => {
  const { handleSubmit, clientId, openModal, setOpenModal, handleToggle } =
    props;

  const gridRef = useRef();
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
        Name: item.name,
        isPrimary: item.isPrimary,
        AssociatedWarehouse: item.associatedWarehouse,
        Contact: item.contact,
      }));

      setBranchData(newArray);
    } catch (error) {}
  };

  const onGridReady = useCallback((params) => {
    getBranchData();
  }, []);

  const onPaginationChanged = useCallback((event) => {
    const page = gridRef.current.api.paginationGetCurrentPage() + 1;
    setPage(page);
  }, []);

  const [colDefs, setColDefs] = useState([
    { field: "Name", minWidth: 220 },
    { field: "AssociatedWarehouse", minWidth: 220 },
    { field: "Contact", minWidth: 220 },
    // { field: "Action", minWidth:150},
  ]);

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
      <div className="ag-theme-quartz" style={{ height: 309 }}>
        <AgGridReact
          ref={gridRef}
          rowData={branchData}
          columnDefs={colDefs}
          onPaginationChanged={onPaginationChanged}
          pagination={true}
          paginationAutoPageSize={true}
          suppressAggFuncInHeader={true}
          onGridReady={onGridReady}
        />
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
