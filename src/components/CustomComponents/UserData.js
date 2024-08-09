import { useFormik } from "formik";
import React, { useRef, useState } from "react";
import {
  Button,
  Form,
  Modal,
  ModalBody,
  Spinner,
  Table
} from "reactstrap";

import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css";
import ActionComponent from "./ActionComponent";

import { Chip } from "@mui/material";
import * as Yup from "yup";
import AddUser from "./AddUser";
// import { getBranchListReq, getUserRoleReq } from "../../service/branchService";

const UserData = (props) => {
  const { userData, loading, handleSubmit, clientId, openModal, setOpenModal, handleToggle } =
    props;

  const gridRef = useRef();
  const [edit, setEdit] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  const [colDefs, setColDefs] = useState([
    { field: "UserName" },
    { field: "UserRole" },
    { field: "Contact" },
    { field: "Associated Branches" },
    {
      headerName: "Action",
      field: "action",
      cellClass: "actions-button-cell",
      cellRenderer: ActionComponent,
      sortable: false,
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
    },
  ]);

  //For creating new User need Formik for validation schema
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      primaryUser: {
        firstName: null,
        lastName: null,
        email: null,
        password: null,
        contact: null,
        gender: null,
        role: "65b4e43b671d73cc3c1bbf90",
        clientId: clientId,
        associatedBranches: [],
      },
    },
    validationSchema: Yup.object({
      primaryUser: Yup.object().shape({
        firstName: Yup.string().required("Please Enter First Name"),
        lastName: Yup.string().required("Please Enter Last Name"),
        email: Yup.string().required("Please Enter Email Id"),
        password: Yup.string().required("Please Enter Password"),
        contact: Yup.string().required("Please Enter Valid Contact Number"),
        gender: Yup.string().required("Please Enter Gender"),
      }),
    }),
    onSubmit: (values) => {
      const branchArray = selectedItems.map((e) => {
        return e._id;
      });

      const newUser = {
        ...values.primaryUser,
        clientId: clientId.toString(),
        associatedBranches: branchArray,
      };

      handleSubmit(newUser, edit);
    },
  });

  return (
    <div>
      <Modal
        size="lg"
        isOpen={openModal.user}
        toggle={() => {
          handleToggle("user");
        }}
      >
        <div>
          <Form
            className="form-horizontal"
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
          >
            <div className="modal-header">
              <div className="d-flex justify-content-between align-items-center w-100">
                <h5 className="modal-title">{edit ? 'Edit' : 'Add'} User</h5>
                <div className="d-flex gap-1">
                  <Button
                    type="button"
                    outline
                    color="danger"
                    className="waves-effect waves-light"
                    onClick={() => {
                      validation.resetForm();
                      setOpenModal({ ...openModal, user: false });
                    }}
                  >
                    Close
                  </Button>
                  <Button
                    type="submit"
                    className="btn btn-primary waves-effect waves-light "
                    onClick={() => {
                      //   handleSubmitAgreement();
                      // setOpenModal({ ...openModal, user: false });
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>


            <ModalBody>
              <AddUser
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                clientId={clientId}
                modal={openModal.user}
                validation={validation}
              />
            </ModalBody>
          </Form>
        </div>
      </Modal>
      <div style={{ maxHeight: 300, width: "100%", overflow: "auto" }}>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Contact</th>
              <th colSpan={2}>Associated Branches</th>
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
              <>
                {userData.length > 0 ? (
                  userData.map((user) => (
                    <tr key={user._id}>
                      <td>{user.UserName}</td>
                      <td>{user.UserRole}</td>
                      <td>{user.Contact}</td>
                      <td style={{ width: "min-content" }}>
                        {
                          <div
                            style={{
                              display: "flex",
                              gap: "3px",
                              flexWrap: "wrap",
                            }}
                          >
                            {user.associatedBranches.map((branch, index) => (
                              <Chip
                                size="small"
                                key={index}
                                label={`${branch.address}`}
                              />
                            ))}
                          </div>
                        }
                      </td>
                      <td>
                        <ActionComponent
                          openModal={openModal}
                          setOpenModal={setOpenModal}
                          type={"user"}
                          data={user}
                          clientId={clientId}
                          validation={validation}
                          setEdit={setEdit}
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
              </>}
          </tbody>
        </Table>
      </div>
      {/* <div className="ag-theme-quartz" style={{ height: 309 }}>
        <AgGridReact
          ref={gridRef}
          rowData={userData}
          columnDefs={colDefs}
          suppressAggFuncInHeader={true}
          onGridReady={onGridReady}
        />
      </div> */}
      <div className="text-center">
        <Button
          onClick={() => {
            setOpenModal({ ...openModal, user: true });
          }}
          className="mt-3 btn-primary"
        >
          Add User
        </Button>
      </div>
    </div>
  );
};

export default UserData;
