import React, { useEffect, useRef, useState,useCallback } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Label,
  Input,
  CardTitle,
  Form,
  Button,
} from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import Dropzone from "react-dropzone";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import InputWithChips from "../../components/CustomComponents/InputWithChips";
import { v4 as uuidv4 } from "uuid";
import * as Yup from "yup";
import { useFormik } from "formik";
import AllVariantRows from "../../components/CustomComponents/AllVariantRows";
import axios from "axios";
import { createItemReq } from "../../service/itemService";
import { ToastContainer, toast } from "react-toastify";
import Standard from "../../components/CustomComponents/Standard";
import MultipleLayerSelect from "../../components/CustomComponents/MultipleLayerSelect";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getUserListReq } from "../../service/usersService";
import UserCardDetails from "./UserCardDetails";


const Users = (props) => {
  
  const navigate = useNavigate();
  const effectCalled = useRef(false);
  const [usersData,setUsersData] = useState([]);
  const [chips, setChips] = useState([]);

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

  //Handles BreadCrumbs
  const breadcrumbItems = [
    { title: "Dashboard", link: "#" },
    { title: "Users", link: "#" },
  ];  

  const getUsersData = useCallback(async (body) => {
    const response = await getUserListReq();
    if (response && response.payload) {
      setUsersData(response?.payload);
    } 
  });  

  useEffect(() => {
    props.setBreadcrumbItems("Users", breadcrumbItems);
    if (!effectCalled.current) {
      getUsersData();
      // getCategories();
      effectCalled.current=true;
    }
  },[]); 

  const renderUserCards = () => {
    console.log(usersData);
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
                <label className="contact">Branch Access</label>
                <input
                  id="contact"
                  name="contact"
                  className="form-control"
                  type="text"
                  placeholder="Enter Branch Access"
                  onKeyDown={handleInputChange}
                  value={chips.join(',')}
                  onBlur={null}
                  invalid={null}
                />
              </div>
            </Col>
            </Row>
            <Row>
            <Col xs="12">
              <div className="mt-3 mb-0">
                <label className="Gender">User Role</label>
                <input
                  id="gender"
                  name="gender"
                  className="form-control"
                  type="text"
                  placeholder="Enter User Role"
                  onChange={null}
                  onBlur={null}
                  value={null}
                  invalid={null}
                />
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