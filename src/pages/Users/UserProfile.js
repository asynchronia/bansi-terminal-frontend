import React, { useState } from "react";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import { Row, Col, Card, CardBody, Form } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

const UserProfile = () =>{
    const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(()=>{

  },[]);
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
  
  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };
  return(
    <>
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
                        <option value={"others"}>Others</option>
                      </select>
                    </div>
                  </Col>
                </Row>
                </CardBody>
            </Card>
          </Col>
          </Row>
      </Form>
    </div>

    </>
  );
}
export default connect(null, { setBreadcrumbItems })(UserProfile);