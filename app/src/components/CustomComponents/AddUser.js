import React from "react"
import { Card, CardBody } from "reactstrap"

const AddUser = () => {
  return (
    <Card>
      <CardBody>
        <h4 className="card-title">Primary User</h4>
        <div className="mt-4">
            <label className="item-name">User Name</label>
            <input
              name="title"
              id="title"
              className="form-control"
              type="text"
              placeholder="Enter User Name"
            />
          </div>
          <div className="mt-3">
              <label className="col-form-label">User Role</label>
              <select className="form-control">
                <option>Select User Role</option>
                <option>Option 1</option>
                <option>Option 2</option>
              </select>
            </div>
            <div className="mt-3">
            <label className="item-name">User Contact</label>
            <input
              name="title"
              id="title"
              className="form-control"
              type="number"
              placeholder="Enter User Contact Number"
            />
          </div>
          <div className="mt-3">
            <label className="item-name">Set Password</label>
            <input
              name="title"
              id="title"
              className="form-control"
              type="text"
              placeholder="Xyz#123"
            />
          </div>
      </CardBody>
    </Card>
  )
}

export default AddUser
