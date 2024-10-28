import React, { useEffect, useState } from "react";
import { Col, FormGroup, Input, Label, Row } from "reactstrap";
import { STATES_NAME_ENUM } from "../../utility/constants";

const AddBranch = ({ edit = false, setEdit, validation, warehouseList = [] }) => {

  return (
    <>
      {edit && <h4>Edit Branch</h4>}
      <Row>
        <Col>
          <FormGroup>
            <Label className="col-form-label">Branch Name</Label>
            <Input
              className="form-control"
              type="text"
              placeholder="Enter Branch Name"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation?.values?.primaryBranch?.name || ""}
              name="primaryBranch.name"
              invalid={
                validation?.touched?.primaryBranch &&
                validation?.touched?.primaryBranch?.name &&
                validation?.errors?.primaryBranch &&
                validation?.errors?.primaryBranch?.name
              }
            />
            {validation?.touched?.primaryBranch &&
              validation?.touched?.primaryBranch?.name &&
              validation?.errors?.primaryBranch &&
              validation?.errors?.primaryBranch?.name ? (
              <p style={{ color: "red" }}>
                {validation.errors?.primaryBranch?.name}
              </p>
            ) : null}
          </FormGroup>
        </Col>
        <Col>
          <FormGroup>
            <label className="col-form-label">Associated Warehouse</label>
            <select
              name="primaryBranch.associatedWarehouse"
              id="associatedWarehouse"
              className="form-select focus-width"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation?.values?.primaryBranch?.associatedWarehouse || ""}
              invalid={
                validation?.touched?.primaryBranch &&
                validation?.touched?.primaryBranch?.associatedWarehouse &&
                validation?.errors?.primaryBranch &&
                validation?.errors?.primaryBranch?.associatedWarehouse
              }
            >
              <option value="" disabled>Select Associated Warehouse</option>
              {warehouseList.map((e) => (
                <option value={e._id}>{e.name}</option>
              ))}
            </select>
            {validation?.touched?.primaryBranch &&
              validation?.touched?.primaryBranch?.associatedWarehouse &&
              validation?.errors?.primaryBranch &&
              validation?.errors?.primaryBranch?.associatedWarehouse ? (
              <p style={{ color: "red" }}>
                {validation?.errors?.primaryBranch?.associatedWarehouse}
              </p>
            ) : null}
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <FormGroup>
            <label className="item-name">Branch Contact Number</label>
            <Input
              name="primaryBranch.contact"
              id="contact"
              className="form-control"
              type="text"
              placeholder="Enter Branch Contact Number"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation?.values?.primaryBranch?.contact || ""}
              invalid={
                validation?.touched?.primaryBranch &&
                validation?.touched?.primaryBranch?.contact &&
                validation?.errors?.primaryBranch &&
                validation?.errors?.primaryBranch?.contact
              }
            />
            {validation?.touched?.primaryBranch &&
              validation?.touched?.primaryBranch?.contact &&
              validation?.errors?.primaryBranch &&
              validation?.errors?.primaryBranch?.contact ? (
              <p style={{ color: "red" }}>
                {validation?.errors?.primaryBranch?.contact}
              </p>
            ) : null}
          </FormGroup>
        </Col>
        <Col>
        <FormGroup>
            <label className="item-name">Branch Code</label>
            <Input
              name="primaryBranch.code"
              id="code"
              className="form-control"
              type="text"
              placeholder="Enter Branch Code"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation?.values?.primaryBranch?.code || ""}
              invalid={
                validation?.touched?.primaryBranch &&
                validation?.touched?.primaryBranch?.code &&
                validation?.errors?.primaryBranch &&
                validation?.errors?.primaryBranch?.code
              }
            />
            {validation?.touched?.primaryBranch &&
              validation?.touched?.primaryBranch?.code &&
              validation?.errors?.primaryBranch &&
              validation?.errors?.primaryBranch?.code ? (
              <p style={{ color: "red" }}>
                {validation?.errors?.primaryBranch?.code}
              </p>
            ) : null}
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <FormGroup>
            <Label>Branch Address Line 1</Label>
            <Input
              type="text"
              id="addressLine1"
              name="primaryBranch.addressLine1"
              placeholder="Enter Branch Address Line 1"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.primaryBranch?.addressLine1 || ""}
              invalid={
                validation.touched?.primaryBranch &&
                validation.touched?.primaryBranch?.addressLine1 &&
                validation.errors?.primaryBranch &&
                validation.errors?.primaryBranch?.addressLine1
              }
            />
            <span className="badgecount badge badge-success"></span>
            {validation.touched?.primaryBranch &&
              validation.touched?.primaryBranch?.addressLine1 &&
              validation.errors?.primaryBranch &&
              validation.errors?.primaryBranch?.addressLine1 ? (
              <p style={{ color: "red" }}>
                {validation.errors?.primaryBranch?.addressLine1}
              </p>
            ) : null}
          </FormGroup>
          </Col>
        <Col>
          <FormGroup>
            <Label>Branch Address Line 2</Label>
            <Input
              type="text"
              id="addressLine2"
              name="primaryBranch.addressLine2"
              placeholder="Enter Branch Address Line 2"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.primaryBranch?.addressLine2 || ""}
              invalid={
                validation.touched?.primaryBranch &&
                validation.touched?.primaryBranch?.addressLine2 &&
                validation.errors?.primaryBranch &&
                validation.errors?.primaryBranch?.addressLine2
              }
            />
            <span className="badgecount badge badge-success"></span>
            {validation.touched?.primaryBranch &&
              validation.touched?.primaryBranch?.addressLine2 &&
              validation.errors?.primaryBranch &&
              validation.errors?.primaryBranch?.addressLine2 ? (
              <p style={{ color: "red" }}>
                {validation.errors?.primaryBranch?.addressLine2}
              </p>
            ) : null}
          </FormGroup>
          </Col>
      </Row>
      <Row>
        <Col>
          <FormGroup>
            <Label>City</Label>
            <Input
              type="text"
              id="city"
              name="primaryBranch.city"
              placeholder="Enter Branch City"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.primaryBranch?.city || ""}
              invalid={
                validation.touched?.primaryBranch &&
                validation.touched?.primaryBranch?.city &&
                validation.errors?.primaryBranch &&
                validation.errors?.primaryBranch?.city
              }
            />
            <span className="badgecount badge badge-success"></span>
            {validation.touched?.primaryBranch &&
              validation.touched?.primaryBranch?.city &&
              validation.errors?.primaryBranch &&
              validation.errors?.primaryBranch?.city ? (
              <p style={{ color: "red" }}>
                {validation.errors?.primaryBranch?.city}
              </p>
            ) : null}
          </FormGroup>
          </Col>
        <Col>
          <FormGroup>
            <label className="col-form-label">Associated Warehouse</label>
            <select
              name="primaryBranch.state"
              id="state"
              className="form-select focus-width"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation?.values?.primaryBranch?.state || ""}
              invalid={
                validation?.touched?.primaryBranch &&
                validation?.touched?.primaryBranch?.state &&
                validation?.errors?.primaryBranch &&
                validation?.errors?.primaryBranch?.state
              }
            >
              <option value="" disabled>Select State</option>
              {Object.entries(STATES_NAME_ENUM).map(([key, name]) => (
                <option key={key} value={name}>{name}</option>
              ))}
            </select>
            {validation.touched?.primaryBranch &&
              validation.touched?.primaryBranch?.state &&
              validation.errors?.primaryBranch &&
              validation.errors?.primaryBranch?.state ? (
              <p style={{ color: "red" }}>
                {validation.errors?.primaryBranch?.state}
              </p>
            ) : null}
          </FormGroup>
        </Col>
      </Row>
      <Row>
      <Col>
          <FormGroup>
            <Label>Pincode</Label>
            <Input
              type="text"
              id="pincode"
              name="primaryBranch.pincode"
              placeholder="Enter Branch pincode"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.primaryBranch?.pincode || ""}
              invalid={
                validation.touched?.primaryBranch &&
                validation.touched?.primaryBranch?.pincode &&
                validation.errors?.primaryBranch &&
                validation.errors?.primaryBranch?.pincode
              }
            />
            <span className="badgecount badge badge-success"></span>
            {validation.touched?.primaryBranch &&
              validation.touched?.primaryBranch?.pincode &&
              validation.errors?.primaryBranch &&
              validation.errors?.primaryBranch?.pincode ? (
              <p style={{ color: "red" }}>
                {validation.errors?.primaryBranch?.pincode}
              </p>
            ) : null}
          </FormGroup>
        </Col>
        <Col>
          <FormGroup>
            <label className="item-name">ZOHO Address Id</label>
            <Input
              name="primaryBranch.zohoAddressId"
              id="zohoAddressId"
              className="form-control"
              type="text"
              placeholder="Enter ZOHO Address Id"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation?.values?.primaryBranch?.zohoAddressId || ""}
              invalid={
                validation?.touched?.primaryBranch &&
                validation?.touched?.primaryBranch?.zohoAddressId &&
                validation?.errors?.primaryBranch &&
                validation?.errors?.primaryBranch?.zohoAddressId
              }
            />
            {validation?.touched?.primaryBranch &&
              validation?.touched?.primaryBranch?.zohoAddressId &&
              validation?.errors?.primaryBranch &&
              validation?.errors?.primaryBranch?.zohoAddressId ? (
              <p style={{ color: "red" }}>
                {validation?.errors?.primaryBranch?.zohoAddressId}
              </p>
            ) : null}
          </FormGroup>
        </Col>
      </Row>
    </>
  );
};

export default AddBranch;
