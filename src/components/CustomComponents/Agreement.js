import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Row, Table } from "reactstrap";
import { searchItemReq } from "../../service/itemService";
import { v4 as uuidv4 } from "uuid";
import AgreementTable from "./AgreementTable";

const Agreement = (props) => {

  const {agreementData, setAgreementData, setOpenModal }= props;
  const [rowData, setRowData] = useState([]);
  const [showRowData, setShowRowData] = useState(false);

  const handleShowData = (value) => {
    setShowRowData(value);
  };

  const handleAddToAgreement = (id, variant, title) => {
    let obj = {
      id: id,
      title: title,
      sku: variant.sku,
      costPrice: variant.costPrice,
      sellingPrice: variant.sellingPrice,
    };
    setAgreementData([...agreementData, obj]);
    handleShowData(false);
  };

  const handleSearchQuery = (event) => {
    if (event.key === "Enter") {
      let data = {
        search: event.target.value,
        limit: 10,
      };
      setShowRowData(true);
      getListOfRowData(data);
    }
  };

  const getListOfRowData = async (data) => {
    const response = await searchItemReq(data);
    setRowData(response?.payload?.items);
  };

  return (
    <Card>
      <CardBody>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h4 className="card-title mt-2">Items</h4>
          <Row>
            <Col>
              <Button
                type="button"
                outline
                color="danger"
                className="waves-effect waves-light"
                onClick={() => {
                  setOpenModal(false);
                }}
              >
                Close
              </Button>
            </Col>
            <Col>
              {" "}
              <button
                type="button"
                className="btn btn-primary waves-effect waves-light "
                onClick={() => {
                  setOpenModal(false);
                }}
              >
                Save
              </button>
            </Col>
          </Row>
        </div>
        <div>
          <input
            id="searchQuery"
            name="searchQuery"
            placeholder="Search Item"
            className="form-control mt-3"
            onKeyDown={(event) => {
              handleSearchQuery(event);
            }}
          />

          {showRowData ? (
            <div
              className="form-control"
              style={{
                textAlign: "center",
                position: "absolute",
                zIndex: 2,
                width: "750px",
              }}
            >
              {rowData.map((item) =>
                item.variant.map((variant) => (
                  <Row
                    onClick={() => {
                      handleAddToAgreement(variant._id, variant, item.title);
                    }}
                    className="py-3"
                    style={{
                      borderBottom: "1px solid #f4f4f4",
                      cursor: "pointer",
                    }}
                    key={variant._id}
                  >
                    <Col>{item.title}</Col>
                    <Col>{variant.sku}</Col>
                    <Col>{variant.costPrice}</Col>
                    <Col>{variant.sellingPrice}</Col>
                  </Row>
                ))
              )}
            </div>
          ) : null}
        </div>

        <AgreementTable agreementData={agreementData} setAgreementData={setAgreementData}/>
      </CardBody>
    </Card>
  );
};

export default Agreement;
