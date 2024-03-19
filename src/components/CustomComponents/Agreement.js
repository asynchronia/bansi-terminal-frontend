import React, { useCallback, useEffect, useState } from "react";
import { Card, CardBody, Table } from "reactstrap";
import { searchItemReq } from "../../service/itemService";

const Agreement = ({setOpenModal}) => {

  const handleSearchQuery = (event) => {
    if (event.key === 'Enter') {
        let data={
            search:event.target.value,
            limit:10
        }
        getListOfRowData(data);
    }
    
  };

  const [rowData, setRowData] = useState([]);


  const getListOfRowData = async (data) => {
    const response = await searchItemReq(data);
    
    setRowData(response?.payload?.items);
  };



  return (
    <Card>
      <CardBody>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h4 className="card-title mt-2">Items</h4>
          <button
            type="button"
            className="btn btn-primary waves-effect waves-light "
            onClick={()=>{
                setOpenModal(false);
            }}
          >
            Save
          </button>
        </div>
        <div>
          <input
            id="searchQuery"
            name="searchQuery"
            placeholder="Search Item"
            className="form-control mt-3"
            onKeyDown={(event)=>{handleSearchQuery(event)}} 
        />
        </div>

        <Table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>SKU</th>
              <th>Cost Price</th>
              <th> Selling Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {rowData.map(item => (
          item.variant.map(variant => (
            <tr key={variant._id}>
              <td  className="pt-4">{item.title}</td>
              <td  className="pt-4">{variant.sku}</td>
              <td className="pt-4">{variant.costPrice}</td>
              <td>
                <input type="text" value={variant.sellingPrice} className="form-control" />
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-primary waves-effect waves-light"
                >
                  <i className="mdi mdi-18px mdi-delete"></i>
                </button>
              </td>
            </tr>
          ))
        ))}
           
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default Agreement;
