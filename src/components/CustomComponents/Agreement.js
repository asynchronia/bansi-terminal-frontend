import React, { useCallback, useEffect, useState, useRef } from "react";
import { Button, Card, CardBody, Col, Row, Table } from "reactstrap";
import { searchItemReq } from "../../service/itemService";
import { v4 as uuidv4 } from "uuid";
import AgreementTable from "./AgreementTable";
import { Chip } from "@mui/material";

const Agreement = (props) => {
  const {
    allTaxes,
    handleSubmitAgreement,
    agreementData,
    setAgreementData,
    displayTableData,
    setDisplayTableData,
    openModal,
    setOpenModal,
  } = props;
  const [rowData, setRowData] = useState([]);
  const [showRowData, setShowRowData] = useState(false);
  const [fileData, setFileData] = useState({
    name: null,
    url: null,
  });

  const handleShowData = (value) => {
    setShowRowData(value);
  };

  const handleDisplayData = (item, itemId, id, variant, title) => {
    let taxes = allTaxes;
    let taxName;
    for (let i = 0; i < taxes.length; i++) {
      if (taxes[i]._id === item.taxes[0]) {
        taxName = taxes[i].name;
      }
    }
    let obj = {
      id: variant._id,
      itemId: variant.itemId,
      title: item.title,
      sku: variant.sku,
      sellingPrice: variant.sellingPrice,
      attributes: variant.attributes,
      tax: taxName,
      unit: item.itemUnit,
      type: item.itemType,
    };
    // console.log(obj);
    setDisplayTableData([...displayTableData, obj]);
    handleShowData(false);
  };

  const handleAddToAgreement = (itemId, variantId, price) => {
    const itemIndex = agreementData.findIndex((item) => item.item === itemId);

    if (itemIndex === -1) {
      // If itemId doesn't exist, create a new object and add it to agreementArray
      setAgreementData((prevArray) => [
        ...prevArray,
        {
          item: itemId,
          variants: [
            {
              variant: variantId,
              price: price,
            },
          ],
        },
      ]);
    } else {
      const variantIndex = agreementData[itemIndex].variants.findIndex(
        (variant) => variant.variant === variantId
      );

      if (variantIndex === -1) {
        // If variantId doesn't exist, add it to variants array
        setAgreementData((prevArray) => {
          const newArray = [...prevArray];
          newArray[itemIndex].variants.push({
            variant: variantId,
            price: price,
          });
          return newArray;
        });
      }
      handleShowData(false);
      // If variantId exists, do nothing
    }
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
    // console.log(response.payload.items);
    setRowData(response?.payload?.items);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const fileUrl = URL.createObjectURL(file);
    setFileData({
      name: file.name,
      url: fileUrl,
    });
  };

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
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
                  setOpenModal({ ...openModal, agreement: false });
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
                  handleSubmitAgreement();
                  setOpenModal({ ...openModal, agreement: false });
                }}
              >
                Save
              </button>
            </Col>
          </Row>
        </div>
        <div>
          <Row className="mt-3">
            <Col xs="9">
              <input
                id="searchQuery"
                name="searchQuery"
                placeholder="Search Item"
                className="form-control mt-3"
                onKeyDown={(event) => {
                  handleSearchQuery(event);
                }}
              />
            </Col>
            <Col xs="3" className="mt-3">
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
              <Button className="btn-primary" onClick={handleButtonClick}>
                {fileData.name ? (
                  <div>{fileData.name}</div>
                ) : (
                  <div>
                    <i className="ion ion-md-cloud-download mx-2"></i>
                    Upload PDF
                  </div>
                )}
              </Button>
            </Col>
          </Row>

          {showRowData ? (
            <div
              className="form-control"
              style={{
                textAlign: "center",
                position: "absolute",
                zIndex: 2,
                width: "750px",
                height:'500px', overflowY:'scroll'
              }}
            >
              {rowData.length === 0 ? (
                <Row>
                  <p className="form-text-lg text-center">No Data Found</p>{" "}
                </Row>
              ) : (
                rowData?.map((item) =>
                  item?.variant?.map((variant) => (
                    <Row 
                      onClick={() => {
                        handleAddToAgreement(
                          item._id,
                          variant._id,
                          variant.sellingPrice
                        );
                        handleDisplayData(
                          item,
                          item._id,
                          variant._id,
                          variant,
                          item.title
                        );
                      }}
                      className="py-3"
                      style={{
                        borderBottom: "1px solid #f4f4f4",
                        cursor: "pointer",
                      }}
                      key={variant._id}
                    >
                      <Col>
                        <p>{item.title}</p>
                        <div sx={{display:'flex', gap:'3px'}}>
                          {variant.attributes
                            ? variant?.attributes?.map((attribute) => (
                                <Chip size="small" key={attribute._id} label= {`${attribute.name}-${attribute.value}`}/>
                               
                              ))
                            : null}
                        </div>
                      </Col>
                      <Col>{variant.sku}</Col>
                      <Col>{variant.costPrice}</Col>
                      <Col>{variant.sellingPrice}</Col>
                    </Row>
                  ))
                )
              )}
            </div>
          ) : null}
        </div>

        <AgreementTable
          editable={true}
          agreementData={agreementData}
          displayTableData={displayTableData}
          setAgreementData={setAgreementData}
          setDisplayTableData={setDisplayTableData}
        />
      </CardBody>
    </Card>
  );
};

export default Agreement;
