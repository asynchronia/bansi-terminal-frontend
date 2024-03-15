import { AvField, AvForm } from "availity-reactstrap-validation";
import React from "react";
import { Row, Col } from "reactstrap";

const AllVariantRows = (props) => {
  const { _id, onDelete, variantOptions, disabledDelete, onChange, data } = props;

  const handleInputChange = (e) => {
    const {name, value } = e.target;
    if(name.startsWith('attribute-')){
        var arr= name.trim().split("-");
        var obj={};
        obj.name=arr[1];
        obj.value=value;
       
        onChange(data._id, "attributes", obj );
    }else{
        onChange(_id,name, value);
    }
 
  };
 


  return (
    <AvForm>
    <Row>
      <Col>
      
        <label className="form-label mt-3">SKU</label>
        <AvField
          validate={{ required: { value: true } }}
          value={data?.sku || ""}
          errorMessage=" Please enter SKU"
          name="sku"
          className="form-control"
          type="text"
          placeholder="Enter SKU"
          onChange={handleInputChange}
        />
      </Col>
      <Col>
        <label className="form-label mt-3">Stock Quantity</label>
        <AvField
          name="inventory"
          value={data?.inventory || ""}
          validate={{ required: { value: true } }}
          errorMessage=" Please enter Stock Quantity"
          className="form-control"
          type="text"
          placeholder="Enter Quantity"
          onChange={handleInputChange}
        />
      </Col>

      {variantOptions.map((option, idx) =>  (
       
        <Col key={option.id}>
        
          <div>
            <label className="col-form-label mt-2">
              {option.name !== null && option.name !== ""
                ? option.name
                : "Attribute"}
            </label>
            <AvField type="select"
            value={data?.attributes[idx]?.value}
            validate={{ required: { value: true } }}
            errorMessage="Please select valid option"
            onChange={handleInputChange}
            name={`attribute-${option.name}`} id={`attribute-${option.name}`} className="form-control">
            <option>Select</option>
              {option.chips ? (
                
                option.chips.map((chip) => (
                  <option key={chip} value={chip}>
                    {chip}
                  </option>
                ))
              ) : (
                <option>Value</option>
              )}
            </AvField>
          </div>
        </Col>
      ))}

      <Col>
        <label className="form-label mt-3">Cost Price</label>
        <AvField
          validate={{ required: { value: true } }}
          errorMessage=" Please enter Cost Price"
          name="costPrice"
          value={data?.costPrice || ""}
          className="form-control"
          type="text"
          placeholder="Enter Price"
          onChange={handleInputChange}
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
          value={data?.sellingPrice ||""}
          onChange={handleInputChange}
        />
      </Col>
      <Col>
        <button
          type="button"
          className="btn btn-primary waves-effect waves-light mt-5"
          onClick={() => onDelete(_id)}
          disabled={disabledDelete}
        >
          <i className="mdi mdi-18px mdi-delete"></i>
        </button>
      </Col>
    </Row>
    </AvForm>
  );
};

export default AllVariantRows;