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
import { ReactComponent as Add } from "../../assets/images/svg/add-button.svg";

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

  // Form field usestates
  const [userName, setUserName] = useState("");
  const [warehouseEmail, setWarehouseEmail] = useState("");
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

  //Handles BreadCrumbs
  const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Users", link: "#" },
    { title: "Add User", link: "#" },
  ];

  const getUsersData = useCallback(async (body) => {
    const response = await getUserListReq();
    if (response && response.payload) {
      setUsersData(response?.payload);
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

  useEffect(() => {
    props.setBreadcrumbItems("Users", breadcrumbItems);
    if (!effectCalled.current) {
      getUsersData();
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

  const handleRoleChange = (event) => {
    setSelectRole(event.target.value);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate form fields
    const errors = {};
    if (!userName) {
      errors.userName = "User name is required";
    } else if (!/^[a-zA-Z]+$/.test(userName)) {
      errors.userName = "User name should contain only alphabets";
    }
    if (!warehouseEmail) {
      errors.warehouseEmail = "Warehouse Email is required";
    } else if (!/\S+@\S+\.\S+/.test(warehouseEmail)) {
      errors.warehouseEmail = "Warehouse Email is invalid";
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
                  <Col xs="12">
                    <div className="mb-0">
                      <label className="userName">User Name</label>
                      <input
                        id="UserName"
                        name="UserName"
                        className="form-control"
                        type="text"
                        placeholder="Enter User Name"
                        onChange={(e) => setUserName(e.target.value)}
                        onBlur={null}
                        value={userName}
                        invalid={null}
                      />
                      {errors.userName && (
                        <span style={{ color: "red" }}>{errors.userName}</span>
                      )}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs="12">
                    <div className="mt-3 mb-0">
                      <label className="warehouse email">Warehouse Email</label>
                      <input
                        id="warehouse email"
                        name="warehouse email"
                        className="form-control"
                        type="text"
                        placeholder="Enter Warehouse Email id"
                        onChange={(e) => setWarehouseEmail(e.target.value)}
                        onBlur={null}
                        value={warehouseEmail}
                        invalid={null}
                      />
                      {errors.warehouseEmail && (
                        <span style={{ color: "red" }}>{errors.warehouseEmail}</span>
                      )}
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
                <Row>
                <Col xs="12">
                  <div className="mt-3 mb-0">
                    <button type="submit" className="btn btn-primary w-xl mx-3">
                    <Add style={{ marginRight: "5px" }} />
                      Add New Warehouse
                    </button>
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
