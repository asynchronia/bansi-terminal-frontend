import React, { useCallback, useEffect, useState, useRef } from "react";
import { Button, Card, CardBody, Col, Row, Table, ModalBody, ModalHeader } from "reactstrap";
import { searchItemReq } from "../../service/itemService";
import { v4 as uuidv4 } from "uuid";
import AgreementTable from "./AgreementTable";
import { Chip, CircularProgress, IconButton, TableHead } from "@mui/material";
import { getUploadUrlReq } from "../../service/fileService";
import axios from "axios";
import StyledButton from "../Common/StyledButton";
import { debounce } from 'lodash';
import { toast } from "react-toastify";
import { Close } from "@mui/icons-material";
import { PAYMENT_TERM_ENUM } from "../../utility/constants";

const Agreement = (props) => {
  const {
    allTaxes,
    handleSubmitAgreement,
    tableData,
    agreementData,
    setAgreementData,
    additionalData,
    setAdditionalData,
    displayTableData,
    setDisplayTableData,
    openModal,
    setOpenModal,
    isButtonLoading
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

  const debouncedFetchResults = useCallback(debounce((searchQuery) => {
    getListOfRowData(searchQuery);
  }, 500), []);

  const handleSearchQuery = (event) => {
    let data = {
      limit: 10,
      search: event.target.value
    };

    if(event.target.value === ""){
      setShowRowData(false);
    } else {
      setShowRowData(true);
      setLoadedData(false);
      debouncedFetchResults(data);
    }
  };

  const getListOfRowData = async (data) => {
    const response = await searchItemReq(data);

    setRowData(response?.payload?.items);
    setLoadedData(true)
  };

  const handleFileUpload = async (event) => {
    setIsUploading(true);
    const file = event.target.files[0];
    const getUploadUrl = async () => {
      const { url } = await getUploadUrlReq();
      return url;
    };
    const fileUrl = await getUploadUrl();

    const parsedUrl = new URL(fileUrl);
    const fileKey = parsedUrl.pathname.substring(1);

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
    <>
      <div className="modal-header">
        <div className="d-flex justify-content-between align-items-center w-100">
          <h5 className="modal-title">Items</h5>
          <div className="d-flex gap-1">
            <Button
              outline
              color="danger"
              className="waves-effect waves-light"
              onClick={() => {
                setOpenModal({ ...openModal, agreement: false });
              }}
            >
              Close
            </Button>
            <StyledButton
              className="btn btn-primary waves-effect waves-light "
              onClick={() => {
                let isCostError = false;
                for (let i = 0; i < displayTableData.length; i++) {
                  const sellingPrice = displayTableData[i].sellingPrice;
                  if (!sellingPrice) {
                    isCostError = true;
                    toast.error(`Please enter Cost for ${displayTableData[i].title}`);
                  } else if (sellingPrice <= 0) {
                    isCostError = true;
                    toast.error(`Please enter valid Cost for ${displayTableData[i].title}`);
                  }
                }
                if (!additionalData.validity) {
                  toast.error('Please enter validity');
                } else if (additionalData.paymentTerms === null || additionalData.paymentTerms === undefined) {
                  toast.error('Please enter Payment Terms');
                }
                else {
                  if (!isCostError) {
                    handleSubmitAgreement();
                    setOpenModal({ ...openModal, agreement: false });
                  }
                }
              }}
              isLoading={isButtonLoading}
            >
              Save
            </StyledButton>
          </div>
        </div>
      </div>
      <ModalBody>
        <div>
          <Row>
            <Col xs="6">
              <label>Validity</label>
              <input
                id="validity"
                type="date"
                name="validity"
                placeholder="Validity"
                className="form-control"
                autoComplete="off"
                value={additionalData.validity}
                onChange={e => setAdditionalData((prevData) => ({
                  ...prevData,
                  validity: e.target.value
                }))}
              />
            </Col>
            <Col xs="6">
              <label>Payment Terms</label>
              <select
                id="paymentTerms"
                name="paymentTerms"
                placeholder="Payment Terms"
                autoComplete="off"
                value={additionalData.paymentTerms}
                className="form-control form-select focus-width"
                onChange={e => setAdditionalData((prevData) => ({
                  ...prevData,
                  paymentTerms: e.target.value
                }))}
              >
                <option value={PAYMENT_TERM_ENUM.ADVANCE}>ADVANCE</option>
                <option value={PAYMENT_TERM_ENUM["50% ADVANCE"]}>50% ADVANCE</option>
                <option value={PAYMENT_TERM_ENUM[15]}>15</option>
                <option value={PAYMENT_TERM_ENUM[30]}>30</option>
                <option value={PAYMENT_TERM_ENUM[45]}>45</option>
              </select>
            </Col>

            <Col xs="9">
              <input
                id="searchQuery"
                name="searchQuery"
                placeholder="Search Item"
                className="form-control mt-3"
                autoComplete="off"
                onChange={handleSearchQuery}
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
                position: "absolute",
                zIndex: 2,
                height: "500px",
                overflow: "auto",
              }}
            >
              <IconButton className="float-end"><Close onClick={() => setShowRowData(false)} /></IconButton>
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
                    <p className="form-text-lg text-center">No Data Found</p>
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
                            className="py-2"
                            style={{
                              borderBottom: "1px solid #f4f4f4",
                              cursor: "pointer",
                            }}
                            key={variant._id}
                          >
                            <Col>
                              <p className="m-0">{item.title}</p>
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
        <div style={{ maxHeight: "400px", overflow: "auto" }}>
          <AgreementTable
            editable={true}
            agreementData={agreementData}
            tableData={tableData}
            displayTableData={displayTableData}
            setAgreementData={setAgreementData}
            setDisplayTableData={setDisplayTableData}
          />
        </div>
      </ModalBody>
    </>
  );
};

export default Agreement;

//check the file type in file manager
//get object API in backend
//download the file from the url