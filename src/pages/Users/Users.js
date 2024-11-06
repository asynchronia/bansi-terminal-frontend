import React, { useEffect, useRef, useState, useCallback } from "react";
import { Row, Col, Card, CardBody, Form, Modal, ModalBody } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import { toast } from "react-toastify";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getUserListReq } from "../../service/usersService";
import UserCardDetails from "./UserCardDetails";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import { InputLabel } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FormControl from "@mui/material/FormControl";
import {
  getUserRoleListReq,
} from "../../service/usersService";
import { ReactComponent as Add } from "../../assets/images/svg/add-button.svg";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getWarehouseListReq } from "../../service/branchService";
import { signinReq } from "../../service/authService";
import StyledButton from "../../components/Common/StyledButton";
import AddUserModal from "./AddUserModal";


function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const Users = (props) => {
  const navigate = useNavigate();
  const effectCalled = useRef(false);
  const [usersData, setUsersData] = useState([]);
  const [chips, setChips] = useState([]);
  const theme = useTheme();
  const [selectRole, setSelectRole] = useState();
  const [selectedRole, setSelectedRole] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [warehouseList, setWarehouseList] = useState([]);
  const [editUserData, setEditUserData] = useState("")
  const [isButtonLoading, setIsButtonLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const clientId = JSON.parse(localStorage.getItem("user")).clientId

  const notify = (type, message) => {
    if (type === "Error") {
      toast.error(message, {
        position: "top-center",
        theme: "colored",
      });
    } else {
      toast.success(message, {
        position: "top-center",
        theme: "colored",
      });
    }
  };

  //Handles BreadCrumbs
  const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Users", link: "#" },
    /* { title: "Add User", link: "#" } */,
  ];

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
        firstName: null,
        lastName: null,
        email: null,
        password: null,
        contact: null,
        gender: null,
        role: null,
        associatedWarehouses: []
    },
    validationSchema: Yup.object({
        firstName: Yup.string().required("Please Enter First Name"),
        lastName: Yup.string().required("Please Enter Last Name"),
        email: Yup.string().required("Please Enter Email Id"),
        password: Yup.string().required("Please Enter Password"),
        contact: Yup.string().required("Please Enter Valid Contact Number"),
        gender: Yup.string().required("Please Enter Gender"),
        role: Yup.string().required("Please select user role")
    }),
    onSubmit: (values) => {
      const warehouseArray = selectedItems.map((e) => {
        return e._id;
      });

      const newUser = {
        ...values,
        clientId: clientId,
        associatedWarehouses: warehouseArray,
      };

      handleSubmitUser(newUser);
    },
  });

  const getUsersData = useCallback(async (body) => {
    const response = await getUserListReq();
    if (response && response.payload) {
      setUsersData(response?.payload);
    }
  });

  const rolesData = useCallback(async (body) => {
    const response = await getUserRoleListReq(true);
    if (response && response.payload) {
      setSelectedRole(response?.payload?.roles);
    }
  });

  const searchAllWareHouses = async () => {
    try {
      const response = await getWarehouseListReq();
      setWarehouseList(response?.payload?.warehouses);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
    if(validation?.values?.associatedWarehouses?.length > 0){
      setSelectedItems(validation.values?.associatedWarehouses)
    }
  }, [])

  useEffect(() => {
    props.setBreadcrumbItems("Users", breadcrumbItems);
    if (!effectCalled.current) {
      getUsersData();
      rolesData();
      // getCategories();
      searchAllWareHouses()
      effectCalled.current = true;
    }
  }, []);

  const renderUserCards = () => {
    return usersData?.map((user, index) => (
      <UserCardDetails key={index} usersData={user} setOpenModal={setOpenModal} setEditUserData={setEditUserData} setSelectedItems={setSelectedItems} />
    ));
  };

  const handleRoleChange = (event) => {
    setSelectRole(event.target.value);
  };

  const handleWarehouseChange = (event) => {
    setSelectedItems(event.target.value);
  };

  const handleSubmitUser = async (data) => {
    try {
      setIsButtonLoading(true)
      const response = await signinReq(data);

      if (response.success) {
        notify("Success", response.message)
        validation.resetForm()
        setSelectedItems([])
        getUsersData()
      }
      setIsButtonLoading(false)
    } catch (error) {
      notify("Error", error.message)
      setIsButtonLoading(false)
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <AddUserModal
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        selectedRole={selectedRole}
        warehouseList={warehouseList}
        editUserData={editUserData}
        getUsersData={getUsersData}
        notify={notify}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />

      <Form className="form-horizontal mt-4" onSubmit={validation.handleSubmit}>
        <Row>
          {/* TODO: Add admin users form */}
          <Col xl="4">
            <Card>
              <CardBody>
                <h4 className="card-title">Add User</h4>
                <hr />
                <Row>
                  <Col className="mt-4">
                    <label className="item-name">First Name</label>
                    <input
                      name="firstName" // Update the name attribute
                      id="firstName"
                      className="form-control"
                      type="text"
                      placeholder="Enter First Name"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.firstName || ""}
                      invalid={
                        validation.touched &&
                        validation.touched.firstName &&
                        validation.errors &&
                        validation.errors.firstName
                      }
                    />
                    {validation.touched &&
                    validation.touched.firstName &&
                    validation.errors &&
                    validation.errors.firstName ? (
                      <p style={{ color: "red" }}>
                        {validation.errors.firstName}
                      </p>
                    ) : null}
                  </Col>
                </Row>
                <Row>
                  <Col className="mt-4">
                    <label className="item-name">Last Name</label>
                    <input
                      name="lastName" // Update the name attribute
                      id="LastName"
                      className="form-control"
                      type="text"
                      placeholder="Enter Last Name"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.lastName || ""}
                      invalid={
                        validation.touched &&
                        validation.touched.lastName &&
                        validation.errors &&
                        validation.errors.lastName
                      }
                    />
                    {validation.touched &&
                    validation.touched.lastName &&
                    validation.errors &&
                    validation.errors.lastName ? (
                      <p style={{ color: "red" }}>
                        {validation.errors.lastName}
                      </p>
                    ) : null}
                  </Col>
                </Row>
                <Row>
                  <Col className="mt-3">
                    <label className="item-name">Email</label>
                    <input
                      name="email" // Update the name attribute
                      id="email"
                      className="form-control"
                      type="email"
                      placeholder="Enter Email"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.email || ""}
                      invalid={
                        validation.touched &&
                        validation.touched.email &&
                        validation.errors &&
                        validation.errors.email
                      }
                    />
                    {validation.touched &&
                    validation.touched.email &&
                    validation.errors &&
                    validation.errors.email ? (
                      <p style={{ color: "red" }}>
                        {validation.errors.email}
                      </p>
                    ) : null}
                  </Col>
                </Row>
                <Row>
                  <Col className="mt-3">
                    <label className="item-name">User Contact</label>
                    <input
                      name="contact" // Update the name attribute
                      id="contact"
                      className="form-control"
                      type="text"
                      placeholder="Enter User Contact Number"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.contact || ""}
                      invalid={
                        validation.touched &&
                        validation.touched.contact &&
                        validation.errors &&
                        validation.errors.contact
                      }
                    />
                    {validation.touched &&
                    validation.touched.contact &&
                    validation.errors &&
                    validation.errors.contact ? (
                      <p style={{ color: "red" }}>
                        {validation.errors.contact}
                      </p>
                    ) : null}
                  </Col>
                </Row>
                <Row>
                <Col className="mt-3">
                    <label className="item-name">Gender</label>
                    <select
                      className="form-select focus-width"
                      name="gender"
                      id="gender"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.gender || ""}
                      invalid={
                        validation.touched &&
                        validation.touched.gender &&
                        validation.errors &&
                        validation.errors.gender
                      }
                    >
                      <option>Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="others">Others</option>
                    </select>
                    {validation.touched &&
                    validation.touched.gender &&
                    validation.errors &&
                    validation.errors.gender ? (
                      <p style={{ color: "red" }}>
                        {validation.errors.gender}
                      </p>
                    ) : null}
                  </Col>
                  <Col className="mt-3">
                    <label className="item-name">Set Password</label>
                    <input
                      name="password" // Update the name attribute
                      id="password"
                      className="form-control"
                      type="text"
                      placeholder="Xyz#123"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.password || ""}
                      invalid={
                        validation.touched &&
                        validation.touched.password &&
                        validation.errors &&
                        validation.errors.password
                      }
                    />
                    {validation.touched &&
                    validation.touched.password &&
                    validation.errors &&
                    validation.errors.password ? (
                      <p style={{ color: "red" }}>
                        {validation.errors.password}
                      </p>
                    ) : null}
                  </Col>
                </Row>
                <Row className="mt-3 px-3">
                  <FormControl>
                    <label className="item-name">Associated Warehouses</label>
                    <Select
                    size="small"
                      name="associatedWarehouses"
                      labelId="multiple-select-label"
                      id="multiple-select"
                      multiple
                      value={selectedItems}
                      onChange={handleWarehouseChange}
                      renderValue={(selected) => (
                        <div>
                          {selected.map((value) => (
                            <Chip className="mx-2" size="small" key={value._id} label={value.code ? value.code : value.name} />
                          ))}
                        </div>
                      )}
                    >
                      {warehouseList.length>0? warehouseList.map((option) => (
                        <MenuItem key={option._id} value={option}>
                          {option.code ? option.code : option.name}
                        </MenuItem>
                      )):null}
                    </Select>
                  </FormControl>
                </Row>
                <Row className="mt-3 px-3">
                  <label className="form-label">User Role</label>
                  <select
                    className="form-select focus-width"
                    name="role" // Update the name attribute
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.role || ""}
                    invalid={
                      validation.touched &&
                      validation.touched.role &&
                      validation.errors &&
                      validation.errors.role
                    }
                  >
                    <option>Select User Role</option>
                    {selectedRole.map((e) => (
                      <option key={e._id} value={e._id}>{e.title}</option>
                    ))}
                  </select>
                  {validation.touched &&
                  validation.touched.role &&
                  validation.errors &&
                  validation.errors.role ? (
                    <p style={{ color: "red" }}>
                      {validation.errors.role}
                    </p>
                  ) : null}
                </Row>
                <Row>
                  <Col xs="12">
                    <div className="mt-3 mb-0">
                      <StyledButton type="submit" isLoading={isButtonLoading} className="btn btn-primary w-xl mx-2">
                        Add User
                      </StyledButton>
                  </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>

          <Col xl="8">{renderUserCards()}</Col>
        </Row>
      </Form>
    </div>
  );
};

export default connect(null, { setBreadcrumbItems })(Users);
