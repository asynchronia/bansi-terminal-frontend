import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Input, Label, Row } from "reactstrap";

const AddBranch = ({ validation }) => {
  const [warehouseList, setWarehouseList] = useState([]);

  const searchAllWareHouses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/branches/warehouse-list"
      );
      let data = await response.data;
      setWarehouseList(data?.payload?.warehouses);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    searchAllWareHouses();
  }, []);

  return (
    <Card>
      <CardBody>
        <h4 className="card-title">Add Branch</h4>
        <Row className="mt-4">
          <Col>
            <div>
              <label className="item-name">Branch Name</label>
              <input
                className="form-control"
                type="text"
                placeholder="Enter Branch Name"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.primaryBranch.name || ""}
                name="primaryBranch.name" 
                invalid={
                  validation.touched.primaryBranch &&
                  validation.touched.primaryBranch.name &&
                  validation.errors.primaryBranch &&
                  validation.errors.primaryBranch.name
                }
              />
              {validation.touched.primaryBranch &&
              validation.touched.primaryBranch.name &&
              validation.errors.primaryBranch &&
              validation.errors.primaryBranch.name ? (
                <p style={{ color: "red" }}>
                  {validation.errors.primaryBranch.name}
                </p>
              ) : null}
            </div>
          </Col>
          <Col>
            <div>
              <label className="col-form-label">Associated Warehouse</label>
              <select
                name="primaryBranch.associatedWarehouse"
                id="associatedWarehouse"
                className="form-select focus-width"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.primaryBranch.associatedWarehouse || ""}
                invalid={
                  validation.touched.primaryBranch &&
                  validation.touched.primaryBranch.associatedWarehouse &&
                  validation.errors.primaryBranch &&
                  validation.errors.primaryBranch.associatedWarehouse
                }
              >
                <option>Select Associated Warehouse</option>
                {warehouseList.map((e) => (
                  <option value={e._id}>{e.name}</option>
                ))}
              </select>
              {validation.touched.primaryBranch &&
              validation.touched.primaryBranch.associatedWarehouse &&
              validation.errors.primaryBranch &&
              validation.errors.primaryBranch.associatedWarehouse ? (
                <p style={{ color: "red" }}>
                  {validation.errors.primaryBranch.associatedWarehouse}
                </p>
              ) : null}
            </div>
          </Col>
        </Row>
        <Row>
          <div className="mt-3">
            <label className="item-name">Branch Contact Number</label>
            <input
              name="primaryBranch.contact"
              id="contact"
              className="form-control"
              type="text"
              placeholder="Enter Branch Contact Number"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.primaryBranch.contact || ""}
              invalid={
                validation.touched.primaryBranch &&
                validation.touched.primaryBranch.contact &&
                validation.errors.primaryBranch &&
                validation.errors.primaryBranch.contact
              }
            />
            {validation.touched.primaryBranch &&
            validation.touched.primaryBranch.contact &&
            validation.errors.primaryBranch &&
            validation.errors.primaryBranch.contact ? (
              <p style={{ color: "red" }}>
                {validation.errors.primaryBranch.contact}
              </p>
            ) : null}
          </div>
        </Row>
        <Row>
          <div className="mt-3">
            <Label>Branch Address</Label>
            <Input
              type="textarea"
              id="address"
              name="primaryBranch.address" 
              rows="3"
              placeholder="Enter Branch Address"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.primaryBranch.address || ""}
              invalid={
                validation.touched.primaryBranch &&
                validation.touched.primaryBranch.address &&
                validation.errors.primaryBranch &&
                validation.errors.primaryBranch.address
              }
            />
            <span className="badgecount badge badge-success"></span>
            {validation.touched.primaryBranch &&
            validation.touched.primaryBranch.address &&
            validation.errors.primaryBranch &&
            validation.errors.primaryBranch.address ? (
              <p style={{ color: "red" }}>
                {validation.errors.primaryBranch.address}
              </p>
            ) : null}
          </div>
        </Row>
      </CardBody>
    </Card>
  );
};

export default AddBranch;
