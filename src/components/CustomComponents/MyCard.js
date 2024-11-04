import React, { useState } from 'react';
import { Button, Row, Col, Input, Card, CardBody } from 'reactstrap';
import { CircularProgress } from '@mui/material';
import { formatNumberWithCommasAndDecimal } from '../../pages/Invoices/invoiceUtil';
const MyCard = ({
  showRowData,
  loadedData,
  rowData,
  agreementData,
  handleAddToAgreement,
  displayTableData,
  setAgreementData,
  setDisplayTableData,
  getListOfRowData
}) => {
  const [quantities, setQuantities] = useState({});

  const handleQuantityChange = (variantId, delta) => {
    setQuantities(prev => ({
      ...prev,
      [variantId]: Math.max(0, (prev[variantId] || 0) + delta)
    }));
  };

  const handleSearchQuery = (event) => {
    if (event.key === "Enter") {
      let data = {
        search: event.target.value,
        limit: 10,
      };
      getListOfRowData(data);
    }
  };


  const renderRowData = () => {
    if (!loadedData && !rowData) {
      return (
        <Row>
          <Col></Col>
          <Col>
            <CircularProgress />
          </Col>
          <Col></Col>
        </Row>
      );
    }

    if (rowData && rowData.length === 0) {
      return (
        <Row>
          <p className="form-text-lg text-center">No items Added.</p>
        </Row>
      );
    }
    return rowData.map(item => (
      item.variants.map(variant => (
        <Row key={variant._id} className="mt-3" style={{ width: "750px" }}>
          <Col>{item.title}</Col>
          <Col>{item.hsnCode}</Col>
          <Col>{item.category.name}</Col>
          <Col>{formatNumberWithCommasAndDecimal(variant.price)}</Col>
          <Col>{variant.inventory}</Col>
          <Col>{item.taxes.map(tax => `${tax.name}`).join(', ')}</Col>
          <Col>{(variant.price * 1 * (1 + item.taxes[0].rate / 100)).toFixed(2)}</Col>
          <Col></Col>
        </Row>
      ))
    ));
  };

  return (
    <Card style={{ height: "100%" }}>
      <CardBody>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h4 className="card-title mt-1">Order Details</h4>
        </div>
        <div>
          <Row>
            <Col xl="12">
              <Input
                id="searchQuery"
                name="searchQuery"
                placeholder="Search Item"
                className="form-control m-1"
                onKeyDown={handleSearchQuery}
              />
            </Col>
          </Row>

          {showRowData && (
            <div
              className="form-control"
              style={{
                textAlign: "center",
                position: "absolute",
                zIndex: 2,
                width: "775px",
                overflowY: "auto"
              }}
            >
              <Row className="mt-3" style={{ width: "750px", fontWeight: "bold" }}>
                <Col>Item Name</Col>
                <Col>HSN Code</Col>
                <Col>Category</Col>
                <Col>Cost</Col>
                <Col>Qty</Col>
                <Col>GST</Col>
                <Col>Total</Col>
                <Col></Col>
              </Row>
              <hr />
              {renderRowData()}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default MyCard;
