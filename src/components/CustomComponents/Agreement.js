import React, { useCallback, useEffect, useState, useRef } from "react";
import { Button, Card, CardBody, Col, Row, Table } from "reactstrap";
import { searchItemReq } from "../../service/itemService";
import { v4 as uuidv4 } from "uuid";
import AgreementTable from "./AgreementTable";
import { Chip, CircularProgress, TableHead } from "@mui/material";
import { getUploadUrlReq } from "../../service/fileService";
import axios from "axios";
import StyledButton from "../Common/StyledButton";

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
    setAdditionalData,
  } = props;
  const [rowData, setRowData] = useState([]);
  const [showRowData, setShowRowData] = useState(false);
  const [loadedData, setLoadedData] = useState(false);
  const [fileData, setFileData] = useState({
    name: null,
    url: null,
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleShowData = (value) => {
    setShowRowData(value);
    setLoadedData(false);
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
      setLoadedData(true);
      getListOfRowData(data);
    }
  };

  const getListOfRowData = async (data) => {
    const response = await searchItemReq(data);

    setRowData(response?.payload?.items);
  };

  const handleFileUpload = async (event) => {
    setIsUploading(true);
    const file = event.target.files[0];
    const getUploadUrl = async () => {
      const { url } = await getUploadUrlReq();
      return url;
    };
    const fileUrl = await getUploadUrl();
    console.log('fileUrl', fileUrl);

    const parsedUrl = new URL(fileUrl);
    const fileKey = parsedUrl.pathname.substring(1);

    console.log('fileKey', fileKey);

    await axios.put(fileUrl, file, {
      headers: {
        "Content-Type": "application/pdf",
      },
    });
    setFileData({
      name: file.name,
      url: fileUrl,
    });
    setAdditionalData((prevData) => ({
      ...prevData,
      url: fileKey,
    }));
    setIsUploading(false);
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
              <StyledButton
                color={"primary"}
                className={"w-md"}
                onClick={handleButtonClick}
                isLoading={isUploading}
              >
                {fileData.name ? (
                  <div>{fileData.name}</div>
                ) : (
                  <div>
                    <i className="ion ion-md-cloud-download mx-2"></i>
                    Upload PDF
                  </div>
                )}
              </StyledButton>
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
                height: "500px",
                overflowY: "scroll",
              }}
            >
              <Row
                className="mt-3"
                style={{ width: "750px", fontWeight: "bold" }}
              >
                <Col>Title</Col>
                <Col>SKU</Col>
                <Col>Cost Price</Col>
                <Col>Selling Price</Col>
              </Row>
              <hr />
              {loadedData ? (
                rowData.length === 0 ? (
                  <Row>
                    <p className="form-text-lg text-center">No Data Found</p>{" "}
                  </Row>
                ) : (
                  rowData?.map((item) =>
                    item?.variant?.map((variant) => {

                      const attributePresent = agreementData.some(
                        (agreementItem) =>
                          agreementItem.variants.some(
                            (agreementVariant) =>
                              agreementVariant.variant === variant._id
                          )
                      );


                      if (!attributePresent) {
                        return (
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
                              <div sx={{ display: "flex", gap: "3px" }}>
                                {variant.attributes
                                  ? variant?.attributes?.map((attribute) => (
                                    <Chip
                                      size="small"
                                      key={attribute._id}
                                      label={`${attribute.name}-${attribute.value}`}
                                    />
                                  ))
                                  : null}
                              </div>
                            </Col>
                            <Col>{variant.sku}</Col>
                            <Col>{variant.costPrice}</Col>
                            <Col>{variant.sellingPrice}</Col>
                          </Row>
                        );
                      } else {
                        return null;
                      }
                    })
                  )
                )
              ) : (
                <Row>
                  <Col></Col>
                  <Col></Col>
                  <Col>
                    <CircularProgress />
                  </Col>
                  <Col></Col>
                </Row>
              )}
            </div>
          ) : null}
        </div>
        <div style={{ height: "400px", overflowY: "scroll" }}>
          <AgreementTable
            editable={true}
            agreementData={agreementData}
            displayTableData={displayTableData}
            setAgreementData={setAgreementData}
            setDisplayTableData={setDisplayTableData}
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default Agreement;

//check the file type in file manager
//get object API in backend
//download the file from the url