import axios from "axios"
import React, { useEffect, useState } from "react"
import { Card, CardBody, Col, Input, Label, Row } from "reactstrap"

const AddBranch = () => {
  const [warehouseList, setWarehouseList] = useState([])

  const searchAllWareHouses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/branches/warehouse-list",
      )
      let data = await response.data
      setWarehouseList(data?.payload?.warehouses)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    searchAllWareHouses()
  }, [])

  return (
    <Card>
      <CardBody>
        <h4 className="card-title">Add Branch</h4>
        <Row className="mt-4">
          <Col>
            <div>
              <label className="item-name">Branch Name</label>
              <input
                name="title"
                id="title"
                className="form-control"
                type="text"
                placeholder="Enter Branch Name"
              />
            </div>
          </Col>
          <Col>
            <div>
              <label className="col-form-label">Associated Warehouse</label>
              <select className="form-control">
                <option>Select Associated Warehouse</option>
                {warehouseList.map(e => (
                  <option value={e._id}>{e.name}</option>
                ))}
              </select>
            </div>
          </Col>
        </Row>
        <Row>
          <div className="mt-3">
            <label className="item-name">Branch Contact Number</label>
            <input
              name="title"
              id="title"
              className="form-control"
              type="text"
              placeholder="Enter Branch Contact Number"
            />
          </div>
        </Row>
        <Row>
          <div className="mt-3">
            <Label>Branch Address</Label>
            <Input
              type="textarea"
              id="description"
              name="description"
              rows="3"
              placeholder="Enter Branch Address"
            />
            <span className="badgecount badge badge-success"></span>
          </div>
        </Row>
      </CardBody>
    </Card>
  )
}

export default AddBranch
