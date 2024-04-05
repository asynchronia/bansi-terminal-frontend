import React, { useEffect, useRef, useState,useCallback } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Form,
} from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import { ToastContainer, toast } from "react-toastify";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getUserListReq } from "../../service/usersService";
import UserCardDetails from "./UserCardDetails";
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import {InputLabel} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import { getUserWarehouseListReq, getUserRoleListReq } from "../../service/usersService";

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
  const [usersData,setUsersData] = useState([]);
  const [chips, setChips] = useState([]);
  const [warehouseList, setWarehouseList] = useState([]);
  const [warehouseListData, setWarehouseListData] = useState([]);
  const theme = useTheme();
  const [selectRole, setSelectRole] = useState();
  const [selectedRole, setSelectedRole] = useState([]);

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
    setTimeout(()=>{
      navigate('/items');
    }, [5000])
  };

  const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
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
          
            setWarehouseListData(response?.payload?.warehouses.map((item, i)=>(
              <div key={i}>{item?.name}</div>
              )));
          } 
    }); 
   
    const rolesData = useCallback(async (body) => {
        const response = await getUserRoleListReq(usersData.role);
        if (response && response.payload) {
          
            setSelectedRole(response?.payload?.roles.map((item, i)=>(
              <div key={i}>{item?.title}</div>
              )));
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
      effectCalled.current=true;
    }
  },[]); 

  const renderUserCards = () => {
    
    return usersData?.map((user, index) => (
      <UserCardDetails key={index} usersData={user} />
    ));
  };

  const handleInputChange = (e) =>{
        if(e.key === 'Enter') {
          e.preventDefault();
        const inputText = e.target.value.trim();
        if(inputText) {
          setChips([...chips, inputText]);
          e.target.value = '';
        }
  }
  };

  const handleWarehouseChange = (event) =>{
    const {
      target: { value },
    } = event;
    setWarehouseList(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleRoleChange = (event) =>{
    setSelectRole(event.target.value);
  }

  return (
    <div style={{ position: "relative" }}>
      <ToastContainer position="top-center" theme="colored" />
      <Form
        className="form-horizontal mt-4"
        onSubmit={(e) => {}}
      >
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
                  onChange={null}
                  onBlur={null}
                  value={null}
                  invalid={null}
                />
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
                  onChange={null}
                  onBlur={null}
                  value={null}
                  invalid={null}
                />
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
                  onChange={null}
                  onBlur={null}
                  value={null}
                  invalid={null}
                />
              </div>
            </Col>
            <Col xs="6">
              <div className="mt-3 mb-0">
                <label className="lastName">Set Password</label>
                <input
                  id="password"
                  name="password"
                  className="form-control"
                  type="text"
                  placeholder="Set Password"
                  onChange={null}
                  onBlur={null}
                  value={null}
                  invalid={null}
                />
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
                  onChange={null}
                  onBlur={null}
                  value={null}
                  invalid={null}
                />
              </div>
            </Col>
            <Col xs="6">
              <div className="mt-3 mb-0">
                <label className="Gender">Gender</label>
                <input
                  id="gender"
                  name="gender"
                  className="form-control"
                  type="text"
                  placeholder="Enter Gender"
                  onChange={null}
                  onBlur={null}
                  value={null}
                  invalid={null}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs="12">
              <div className="mt-3 mb-0">
                <label className="contact">Warehouse Access</label>
                
                <Row>
                <FormControl sx={{ m: 1, width: 300 }} >
                  <InputLabel id="demo-multiple-chip-label">Warehouse</InputLabel>
                  <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={warehouseList}
                    onChange={handleWarehouseChange}
                    input={<OutlinedInput id="select-multiple-chip" label="Warehouse" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
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
                            style={getStyles(name, warehouseListData, theme)}
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
                <div className="dropdown dropdown-topbar pt-3 mt-1 d-inline-block" >
                    <label className="contact">User Role</label>
                  <Row>
                  <FormControl sx={{ m: 1, minWidth: 283 }}>
                        <InputLabel id="demo-simple-select-helper-label" >User Role</InputLabel>
                        <Select
                          labelId="demo-simple-select-helper-label"
                          id="demo-simple-select-helper"
                          value={selectRole}
                          label="User Role"
                          onChange={handleRoleChange}
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

    <Col xl="8">
      {renderUserCards()}
    </Col>
    </Row>
      </Form>
    </div>
  );
};

export default connect(null, { setBreadcrumbItems })(Users);