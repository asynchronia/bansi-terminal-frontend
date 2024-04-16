import React, { useEffect, useRef, useState, useCallback } from "react";
import { Row, Col, Card, CardBody, Form } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import { ToastContainer, toast } from "react-toastify";
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
  getUserWarehouseListReq,
  getUserRoleListReq,
} from "../../service/usersService";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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
  const [warehouseList, setWarehouseList] = useState([]);
  const [warehouseListData, setWarehouseListData] = useState([]);
  const theme = useTheme();
  const [selectRole, setSelectRole] = useState();
  const [selectedRole, setSelectedRole] = useState([]);
  const [gender, setGender] = useState("");

  // Form field usestates
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [errors, setErrors] = useState({});

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
    setTimeout(() => {
      navigate("/items");
    }, [5000]);
  };

  const names = [
    "Oliver Hansen",
    "Van Henry",
    "April Tucker",
    "Ralph Hubbard",
    "Omar Alexander",
    "Carlos Abbott",
    "Miriam Wagner",
    "Bradley Wilkerson",
    "Virginia Andrews",
    "Kelly Snyder",
  ];

  //Handles BreadCrumbs
  const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Users", link: "#" },
  ];

  const getUsersData = useCallback(async (body) => {
    const response = await getUserListReq();
    if (response && response.payload) {
      setUsersData(response?.payload);
    }
  });

  const warehouseData = useCallback(async (body) => {
    const response = await getUserWarehouseListReq(usersData.role);
    if (response && response.payload) {
      setWarehouseListData(
        response?.payload?.warehouses.map((item, i) => (
          <div key={i}>{item?.name}</div>
        ))
      );
    }
  });

  const rolesData = useCallback(async (body) => {
    const response = await getUserRoleListReq(usersData.role);
    if (response && response.payload) {
      setSelectedRole(
        response?.payload?.roles.map((item, i) => (
          <div key={i}>{item?.title}</div>
        ))
      );
    }
  });

  // const handleDelete = (chipToDelete) => () =>{
  //   setWarehouseList((warehouseList)=>warehouseList.filter((chips)=>chips!==chipToDelete));
  // }

  useEffect(() => {
    props.setBreadcrumbItems("Users", breadcrumbItems);
    if (!effectCalled.current) {
      getUsersData();
      warehouseData();
      rolesData();
      // getCategories();
      effectCalled.current = true;
    }
  }, []);

  const renderUserCards = () => {
    return usersData?.map((user, index) => (
      <UserCardDetails key={index} usersData={user} />
    ));
  };

  const handleInputChange = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const inputText = e.target.value.trim();
      if (inputText) {
        setChips([...chips, inputText]);
        e.target.value = "";
      }
    }
  };

  const handleWarehouseChange = (event) => {
    const {
      target: { value },
    } = event;
    setWarehouseList(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleRoleChange = (event) => {
    setSelectRole(event.target.value);
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate form fields
    const errors = {};
    if (!firstName) {
      errors.firstName = "First name is required";
    } else if (!/^[a-zA-Z]+$/.test(firstName)) {
      errors.firstName = "First name should contain only alphabets";
    }
    if (!lastName) {
      errors.lastName = "Last name is required";
    } else if (!/^[a-zA-Z]+$/.test(lastName)) {
      errors.lastName = "Last name should contain only alphabets";
    }
    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid";
    }
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(password)) {
      errors.password =
        "Password must contain at least one digit, one lowercase, one uppercase letter and one special character";
    }
    if (!contactNumber) {
      errors.contactNumber = "Contact number is required";
    } else if (!/^\d{10}$/.test(contactNumber)) {
      errors.contactNumber = "Contact number must be 10 digits";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
    } else {
      console.log("Form submitted");
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <ToastContainer position="top-center" theme="colored" />
      <Form className="form-horizontal mt-4" onSubmit={handleSubmit}>
        <Row>
          <Col xl="4">
            <Card>
              <CardBody>
                <h4 className="card-title">Add User</h4>
                <hr />
                <Row>
                  <Col xs="6">
                    <div className="mt-3 mb-0">
                      <label className="userName">First Name</label>
                      <input
                        id="firstName"
                        name="firstName"
                        className="form-control"
                        type="text"
                        placeholder="Enter First Name"
                        onChange={(e) => setFirstName(e.target.value)}
                        onBlur={null}
                        value={firstName}
                        invalid={null}
                      />
                      {errors.firstName && (
                        <span style={{ color: "red" }}>{errors.firstName}</span>
                      )}
                    </div>
                  </Col>
                  <Col xs="6">
                    <div className="mt-3 mb-0">
                      <label className="lastName">Last Name</label>
                      <input
                        id="lastName"
                        name="lastName"
                        className="form-control"
                        type="text"
                        placeholder="Enter Last Name"
                        onChange={(e) => setLastName(e.target.value)}
                        onBlur={null}
                        value={lastName}
                        invalid={null}
                      />
                      {errors.lastName && (
                        <span style={{ color: "red" }}>{errors.lastName}</span>
                      )}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs="6">
                    <div className="mt-3 mb-0">
                      <label className="email">Email</label>
                      <input
                        id="email"
                        name="email"
                        className="form-control"
                        type="text"
                        placeholder="Enter Email id"
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={null}
                        value={email}
                        invalid={null}
                      />
                      {errors.email && (
                        <span style={{ color: "red" }}>{errors.email}</span>
                      )}
                    </div>
                  </Col>
                  <Col xs="6">
                    <div className="mt-3 mb-0">
                      <label className="lastName">Set Password</label>
                      <input
                        id="password"
                        name="password"
                        className="form-control"
                        type="password"
                        placeholder="Set Password"
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={null}
                        value={password}
                        invalid={null}
                      />
                      {errors.password && (
                        <span style={{ color: "red" }}>{errors.password}</span>
                      )}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs="6">
                    <div className="mt-3 mb-0">
                      <label className="contact">Contact Number</label>
                      <input
                        id="contact"
                        name="contact"
                        className="form-control"
                        type="text"
                        placeholder="Enter Contact Number"
                        onChange={(e) => setContactNumber(e.target.value)}
                        onBlur={null}
                        value={contactNumber}
                        invalid={null}
                      />
                      {errors.contactNumber && (
                        <span style={{ color: "red" }}>
                          {errors.contactNumber}
                        </span>
                      )}
                    </div>
                  </Col>
                  <Col xs="6">
                    <div className="mt-3 mb-0">
                      <label className="gender">Gender</label>
                      <select
                        onChange={handleGenderChange}
                        id="gender"
                        name="gender"
                        value={gender}
                        className="form-control"
                      >
                        <option value="" selected>
                          {"Gender"}
                        </option>
                        <option value={"male"}>Male</option>
                        <option value={"female"}>Female</option>
                      </select>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs="12">
                    <div className="mt-3 mb-0">
                      <label className="contact">Warehouse Access</label>

                      <Row>
                        <FormControl
                          sx={{ m: 1, width: 300, mr: 1.5, ml: "auto" }}
                        >
                          <InputLabel
                            sx={{ mt: -1.2 }}
                            id="demo-multiple-chip-label"
                          >
                            Warehouse
                          </InputLabel>
                          <Select
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            multiple
                            value={warehouseList}
                            onChange={handleWarehouseChange}
                            input={
                              <OutlinedInput
                                id="select-multiple-chip"
                                label="Warehouse"
                                sx={{ height: 35 }}
                              />
                            }
                            renderValue={(selected) => (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 0.5,
                                }}
                              >
                                {selected.map((value) => (
                                  <Chip key={value} label={value} />
                                ))}
                              </Box>
                            )}
                            MenuProps={MenuProps}
                          >
                            {warehouseListData.map((name) => (
                              <MenuItem
                                key={name}
                                value={name}
                                style={getStyles(
                                  name,
                                  warehouseListData,
                                  theme
                                )}
                              >
                                {name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Row>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs="12">
                    <div className="dropdown dropdown-topbar pt-1 mt-1 d-inline-block">
                      <label className="contact">User Role</label>
                      <Row>
                        <FormControl
                          sx={{ m: 1, minWidth: 283, mr: 0.8, ml: 1.4 }}
                        >
                          <InputLabel
                            sx={{ mt: -1.2 }}
                            id="demo-simple-select-helper-label"
                          >
                            User Role
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            value={selectRole}
                            label="User Role"
                            onChange={handleRoleChange}
                            sx={{ height: 35 }}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {selectedRole.map((name) => (
                              <MenuItem
                                key={name}
                                value={name}
                                style={getStyles(name, selectedRole, theme)}
                              >
                                {name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Row>
                    </div>
                  </Col>
                </Row>
                <div className="mt-3 mb-0">
                  <button type="submit" className="btn btn-primary w-xl mx-3">
                    Add New User
                  </button>
                </div>
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
