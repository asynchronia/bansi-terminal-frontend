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
import { getClientUsersReq } from "../../service/usersService";
import { AgGridReact } from "ag-grid-react"; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css";
import ActionComponent from "./ActionComponent";

import * as Yup from "yup";
import AddUser from "./AddUser";
import { Chip } from "@mui/material";
// import { getBranchListReq, getUserRoleReq } from "../../service/branchService";

const UserData = (props) => {
  const { handleSubmit, clientId, openModal, setOpenModal, handleToggle } =
    props;

  const gridRef = useRef();
  const [userData, setUserData] = useState([]);
  const [edit, setEdit] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  const getUserData = async () => {
    try {
      const response = await getClientUsersReq({
        clientId: clientId,
      });
      let array = response?.payload;

      const newArray = array.map((item) => ({
        _id: item._id,
        UserName: item.firstName + " " + item.lastName,
        UserRole: item.role.title,
        Contact: item.contact,
        associatedBranches: item.associatedBranches,
      }));

      setUserData(newArray);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

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
              <h4 className="card-title mt-2">Add User</h4>
              <Row>
                <Col>
                  <Button
                    type="button"
                    outline
                    color="danger"
                    className="waves-effect waves-light"
                    onClick={() => {
                      setOpenModal({ ...openModal, user: false });
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
                      setOpenModal({ ...openModal, user: false });
                    }}
                  >
                    Save
                  </button>
                </Col>
              </Row>
            </div>
            <AddUser
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
              clientId={clientId}
              modal={openModal.user}
              validation={validation}
            />
          </Form>
        </div>
      </Modal>
      <div style={{ maxHeight: 309, width: "100%", overflowX: "scroll" }}>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Contact</th>
              <th>Associated Branches</th>
            </tr>
          </thead>
          <tbody>
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
