import React, { useEffect, useState } from "react";
import { Col, FormGroup, Input, Label, Row } from "reactstrap";

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
      <FormGroup>
        <Label>Branch Address</Label>
        <Input
          type="textarea"
          id="address"
          name="primaryBranch.address"
          rows="3"
          placeholder="Enter Branch Address"
          onChange={validation.handleChange}
          onBlur={validation.handleBlur}
          value={validation.values.primaryBranch?.address || ""}
          invalid={
            validation.touched?.primaryBranch &&
            validation.touched?.primaryBranch?.address &&
            validation.errors?.primaryBranch &&
            validation.errors?.primaryBranch?.address
          }
        />
        <span className="badgecount badge badge-success"></span>
        {validation.touched?.primaryBranch &&
          validation.touched?.primaryBranch?.address &&
          validation.errors?.primaryBranch &&
          validation.errors?.primaryBranch?.address ? (
          <p style={{ color: "red" }}>
            {validation.errors?.primaryBranch?.address}
          </p>
        ) : null}
      </FormGroup>
      <Row>
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
