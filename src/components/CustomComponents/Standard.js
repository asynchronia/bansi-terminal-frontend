import { AvField, AvForm } from 'availity-reactstrap-validation'
import React from 'react'
import { Col, Row } from 'reactstrap'

const Standard = (props) => {

    const {editPage, data, type, onChange}=props
    const handleInputChange = (e) => {
        const {name, value } = e.target;
        onChange(name, value);
    }
  return (
    <AvForm>
    <Row>
      <Col>
        <label className="form-label mt-3">SKU</label>
        <AvField
          validate={{ required: { value: true } }}
          errorMessage=" Please enter SKU"
          name="sku"
          className="form-control"
          type="text"
          placeholder="Enter SKU"
          onChange={handleInputChange}
          value={data?.sku ||""}
          disabled={editPage}
        />
      </Col>
     { type === "standard" ? <Col>
        <label className="form-label mt-3">Stock Quantity</label>
        <AvField
          name="inventory"
          validate={{ required: { value: true } }}
          errorMessage=" Please enter Stock Quantity"
          className="form-control"
          type="text"
          placeholder="Enter Quantity"
          onChange={handleInputChange}
          value={data?.inventory ||""}
        />
      </Col>:null}
      <Col>
        <label className="form-label mt-3">Cost Price</label>
        <AvField
          validate={{ required: { value: true } }}
          errorMessage=" Please enter Cost Price"
          name="costPrice"
          className="form-control"
          type="text"
          placeholder="Enter Price"
          onChange={handleInputChange}
          value={data?.costPrice||""}
        />
      </Col>
      <Col>
        <label className="form-label mt-3">Selling Price</label>
        <AvField
          validate={{ required: { value: true } }}
          errorMessage="Please enter Selling Quantity"
          name="sellingPrice"
          className="form-control"
          type="text"
          placeholder="Enter Price"
          onChange={handleInputChange}
          value={data?.sellingPrice || ""}
        />
      </Col>
      
    </Row>
    </AvForm>
  )
}

export default Standard
