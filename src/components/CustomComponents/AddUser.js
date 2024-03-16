import React from "react"
import { Card, CardBody } from "reactstrap"

const AddUser = ({ validation }) => {
  return (
    <Card>
      <CardBody>
        <h4 className="card-title">Primary User</h4>
        <div className="mt-4">
          <label className="item-name">First Name</label>
          <input
            name="primaryUser.firstName" // Update the name attribute
            id="firstName"
            className="form-control"
            type="text"
            placeholder="Enter First Name"
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            value={validation.values.primaryUser.firstName || ""}
            invalid={
              validation.touched.primaryUser &&
              validation.touched.primaryUser.firstName &&
              validation.errors.primaryUser &&
              validation.errors.primaryUser.firstName
            }
          />
          {validation.touched.primaryUser &&
          validation.touched.primaryUser.firstName &&
          validation.errors.primaryUser &&
          validation.errors.primaryUser.firstName ? (
            <p style={{ color: "red" }}>
              {validation.errors.primaryUser.firstName}
            </p>
          ) : null}
        </div>
        <div className="mt-3">
          <label className="item-name">Last Name</label>
          <input
            name="primaryUser.lastName" // Update the name attribute
            id="LastName"
            className="form-control"
            type="text"
            placeholder="Enter Last Name"
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            value={validation.values.primaryUser.lastName || ""}
            invalid={
              validation.touched.primaryUser &&
              validation.touched.primaryUser.lastName &&
              validation.errors.primaryUser &&
              validation.errors.primaryUser.lastName
            }
          />
          {validation.touched.primaryUser &&
          validation.touched.primaryUser.lastName &&
          validation.errors.primaryUser &&
          validation.errors.primaryUser.lastName ? (
            <p style={{ color: "red" }}>
              {validation.errors.primaryUser.lastName}
            </p>
          ) : null}
        </div>
        <div className="mt-3">
          <label className="item-name">Email</label>
          <input
            name="primaryUser.email" // Update the name attribute
            id="email"
            className="form-control"
            type="email"
            placeholder="Enter Email"
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            value={validation.values.primaryUser.email || ""}
            invalid={
              validation.touched.primaryUser &&
              validation.touched.primaryUser.email &&
              validation.errors.primaryUser &&
              validation.errors.primaryUser.email
            }
          />
          {validation.touched.primaryUser &&
          validation.touched.primaryUser.email &&
          validation.errors.primaryUser &&
          validation.errors.primaryUser.email ? (
            <p style={{ color: "red" }}>
              {validation.errors.primaryUser.email}
            </p>
          ) : null}
        </div>
        <div className="mt-3">
          <label className="item-name">Gender</label>
          <select
            className="form-select focus-width"
            name="primaryUser.gender" 
            id="gender"
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            value={validation.values.primaryUser.gender || ""}
            invalid={
              validation.touched.primaryUser &&
              validation.touched.primaryUser.gender &&
              validation.errors.primaryUser &&
              validation.errors.primaryUser.gender
            }
          >
            <option>Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Others</option>
          </select>
          {validation.touched.primaryUser &&
          validation.touched.primaryUser.gender &&
          validation.errors.primaryUser &&
          validation.errors.primaryUser.gender ? (
            <p style={{ color: "red" }}>
              {validation.errors.primaryUser.gender}
            </p>
          ) : null}
        </div>
        <div className="mt-3">
          <label className="col-form-label">User Role</label>
          <select
            className="form-select focus-width"
            name="primaryUser.role" // Update the name attribute
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            value={validation.values.primaryUser.role || ""}
            invalid={
              validation.touched.primaryUser &&
              validation.touched.primaryUser.role &&
              validation.errors.primaryUser &&
              validation.errors.primaryUser.role
            }
          >
            <option>Select User Role</option>
            <option>Option 1</option>
            <option>Option 2</option>
          </select>
          {validation.touched.primaryUser &&
          validation.touched.primaryUser.role &&
          validation.errors.primaryUser &&
          validation.errors.primaryUser.role ? (
            <p style={{ color: "red" }}>
              {validation.errors.primaryUser.role}
            </p>
          ) : null}
        </div>
        <div className="mt-3">
          <label className="item-name">User Contact</label>
          <input
            name="primaryUser.contact" // Update the name attribute
            id="contact"
            className="form-control"
            type="number"
            placeholder="Enter User Contact Number"
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            value={validation.values.primaryUser.contact || ""}
            invalid={
              validation.touched.primaryUser &&
              validation.touched.primaryUser.contact &&
              validation.errors.primaryUser &&
              validation.errors.primaryUser.contact
            }
          />
          {validation.touched.primaryUser &&
          validation.touched.primaryUser.contact &&
          validation.errors.primaryUser &&
          validation.errors.primaryUser.contact ? (
            <p style={{ color: "red" }}>
              {validation.errors.primaryUser.contact}
            </p>
          ) : null}
        </div>
        <div className="mt-3">
          <label className="item-name">Set Password</label>
          <input
            name="primaryUser.password" // Update the name attribute
            id="password"
            className="form-control"
            type="text"
            placeholder="Xyz#123"
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            value={validation.values.primaryUser.password || ""}
            invalid={
              validation.touched.primaryUser &&
              validation.touched.primaryUser.password &&
              validation.errors.primaryUser &&
              validation.errors.primaryUser.password
            }
          />
          {validation.touched.primaryUser &&
          validation.touched.primaryUser.password &&
          validation.errors.primaryUser &&
          validation.errors.primaryUser.password ? (
            <p style={{ color: "red" }}>
              {validation.errors.primaryUser.password}
            </p>
          ) : null}
        </div>
      </CardBody>
    </Card>
  );
};

export default AddUser
