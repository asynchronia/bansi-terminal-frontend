import React, { useEffect, useState, useRef, useCallback } from "react";
import { connect, useDispatch } from "react-redux";
import {
  Row,
  Col,
  Card,
  CardBody,
  Input,
  Label,
  Table,
  Modal,
  ModalHeader,
  CardHeader,
} from "reactstrap";
import { CircularProgress, TableBody } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { setBreadcrumbItems } from "../../store/Breadcrumb/actions";
import { changePreloader } from "../../store/actions";
import "./styles/CreateOrder.scss";
import "./styles/CreateOrderCard.scss";
import { getClientBranchListReq } from "../../service/branchService";
import { formatNumberWithCommasAndDecimal } from "../Invoices/invoiceUtil";
import { getAgreementItemsReq } from "../../service/itemService";
import { ReactComponent as Delete } from "../../assets/images/svg/delete-button.svg";
import StyledButton from "../../components/Common/StyledButton";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  createPurchaseOrderReq,
  getPurchaseOrderDetailsReq,
  updatePurchaseOrderReq,
} from "../../service/purchaseService";
import PublishConfirm from "../../components/CustomComponents/PublishConfirm";
import generatePDF, { Resolution, Margin, Options } from "react-to-pdf";

import { isEmpty } from 'lodash'

const CreateOrder = (props) => {
  let { id } = useParams();

  document.title = "Create Purchase Order";
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const [branchList, setBranchList] = useState([]);
  const effectCalled = useRef(false);
  const [billingAddress, setBillingAddress] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [rowData, setRowData] = useState([]);
  const [showRowData, setShowRowData] = useState(false);
  const [loadedData, setLoadedData] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [selectedVariants, setSelectedVariants] = useState({});
  const [subTotal, setSubTotal] = useState(0);
  const [gstTotal, setGstTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [purchaseOrderNumber, setPurchaseOrderNumber] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [shippingAddressError, setShippingAddressError] = useState("");
  const [billingAddressError, setBillingAddressError] = useState("");
  const [validDate, setValidDate] = useState();
  const [deliveryDateError, setDeliveryDateError] = useState("");
  const [poNumberError, setPoNumberError] = useState("");
  const [agreementId, setAgreementId] = useState(0);
  const [status, setStatus] = useState("draft");
  const [publishModal, setPublishModal] = useState(false);

  const [minDate, setMinDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
    const day = String(today.getDate()).padStart(2, '0'); // Add leading zero if needed
    return `${year}-${month}-${day}`;
  });

  const [purchaseOrder, setPurchaseOrder] = useState(null);

  const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Purchase Order", link: "#" },
    { title: "Create Purchase Order", link: "#" },
  ];

  const bodyObject = {
    page: 1,
    limit: 200,
  };

  const redirectToPurchaseDetails = (id) => {
    let path = `/purchase-orders/${id}`;
    setTimeout(() => {
      navigate(path, id);
    }, 300);
  };

  const handleSearchQuery = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    if (query.length > 0) {
      const filteredData = rowData.filter((item) =>
        item.title.toLowerCase().includes(query)
      );
      setFilteredRowData(filteredData);
      setShowRowData(true);
    } else {
      setShowRowData(false);
    }
  };

  const getBranchData = useCallback(async () => {
    dispatch(changePreloader(true));
    const response = await getClientBranchListReq();
    if (response) {
      setBranchList(response?.payload?.branches);
    }
    dispatch(changePreloader(false));
  }, [dispatch]);

  const handleBillingChange = (event) => {
    const selectedBranch = event.target.value;
    setBillingAddress(selectedBranch);
    validation.setFieldValue("billingAddress", selectedBranch);
  };

  const handleShippingChange = (event) => {
    const selectedBranch = event.target.value;
    setShippingAddress(selectedBranch);
    validation.setFieldValue("shippingAddress", selectedBranch);
  };

  const handleStatusChange = (event) => {
    if (event.target.value === "published") {
      setPublishModal(true);
    }
    setStatus(event.target.value);
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      billingAddress: "",
      shippingAddress: "",
      purchaseOrderNumber: "",
      deliveryDate: "",
      selectedItems: [],
    },
    validationSchema: Yup.object({
      billingAddress: Yup.string().required("Please Select Billing Address"),
      shippingAddress: Yup.string().required("Please Select Shipping Address"),
      purchaseOrderNumber: Yup.string().required("Please Enter PO Number"),
      deliveryDate: Yup.string().required("Please Enter Delivery Date"),
      selectedItems: Yup.array().min(1, "Please select at least one item"),
    }),
    onSubmit: (values) => {
      debugger
      redirectToPurchaseDetails();
    },
  });

  const getListOfRowData = async () => {
    try {
      const response = await getAgreementItemsReq(bodyObject);
      setAgreementId(response[0]?.agreementId);
      if (response) {
        setRowData(response);
      } else {
        console.error("Invalid response structure", response);
      }
    } catch (error) {
      console.error("Error fetching agreement items", error);
    } finally {
      setLoadedData(true);
    }
  };

  const handleItemSelect = (item, variant) => {
    const taxName = item.taxes.map((tax) => tax.name).join(", ");
    const newItem = {
      itemId: item._id,
      zohoItemId: item.zohoItemId,
      itemName: item.title,
      itemDescription: item.description,
      itemType: item.itemType,
      itemUnit: item.itemUnit,
      hsnCode: item.hsnCode,
      taxPreference: item.taxPreference,
      category: item.category.name,
      unitPrice: variant.price,
      quantity: 1,
      gst: taxName,
      variantId: variant._id,
      taxes: item.taxes.map((tax) => ({
        taxId: tax._id,
        taxName: tax.name,
        taxPercentage: tax.rate,
      })),
    };

    if (
      !selectedItems.some(
        (selectedItem) =>
          selectedItem.itemId === newItem.itemId &&
          selectedItem.variantId === variant._id
      )
    ) {
      setSelectedItems([...selectedItems, newItem]);
      setSelectedQuantities({
        ...selectedQuantities,
        [`${item._id}-${variant._id}`]: 1,
      });
      setSelectedVariants({ ...selectedVariants, [item._id]: variant._id });
    }
    setShowRowData(false);
  };

  const handleItemDelete = (itemId, variantId) => {
    const updatedItems = selectedItems.filter(
      (item) => item.itemId !== itemId || item.variantId !== variantId
    );
    setSelectedItems(updatedItems);
    const updatedQuantities = { ...selectedQuantities };
    delete updatedQuantities[`${itemId}-${variantId}`];
    setSelectedQuantities(updatedQuantities);
    const updatedVariants = { ...selectedVariants };
    delete updatedVariants[itemId];
    setSelectedVariants(updatedVariants);
  };

  // Render selected items in a table
  const renderSelectedItems = () => {
    if (!selectedItems || selectedItems.length === 0) {
      return (
        <tr>
          <td colSpan={8}>
            <p className="m-2 text-center">No items Added.</p>
          </td>
        </tr>
      );
    }

    return selectedItems.map((item) => (
      <tr
        key={`${item.itemId}-${item.variantId}`}
        style={{ verticalAlign: "middle" }}
      >
        <td>{item.itemName}</td>
        <td>{item.hsnCode}</td>
        <td style={{ whiteSpace: "nowrap" }}>{item.category}</td>
        <td style={{ whiteSpace: "nowrap" }}>
          {formatNumberWithCommasAndDecimal(item.unitPrice)}
        </td>
        <td style={{ width: "10%" }}>
          <Input
            type="number"
            min="1"
            value={selectedQuantities[`${item.itemId}-${item.variantId}`] || 1}
            onChange={(e) => {
              const quantity = parseInt(e.target.value, 10);
              setSelectedQuantities({
                ...selectedQuantities,
                [`${item.itemId}-${item.variantId}`]: quantity,
              });
              updateTotals();
            }}
          />
        </td>
        <td style={{ whiteSpace: "nowrap" }}>
          {formatNumberWithCommasAndDecimal(
            item.unitPrice *
            (selectedQuantities[`${item.itemId}-${item.variantId}`] || 1)
          )}
        </td>
        <td style={{ whiteSpace: "nowrap" }}>{item.gst}</td>
        <td>
          <Delete
            style={{ cursor: "pointer" }}
            onClick={() => handleItemDelete(item.itemId, item.variantId)}
          />
        </td>
      </tr>
    ));
  };

  const updateTotals = () => {
    let subTotal = 0;
    let gstTotal = 0;

    selectedItems.forEach((item) => {
      const quantity =
        selectedQuantities[`${item.itemId}-${item.variantId}`] || 1;
      const itemTotal = item.unitPrice * quantity;
      subTotal += itemTotal;
      // Check if item.taxes is defined and not empty
      if (item.gst) {
        const gstRate = item.taxes[0].rate || item.taxes[0].taxPercentage;
        gstTotal += (itemTotal * gstRate) / 100;
      }
    });

    setSubTotal(subTotal);
    setGstTotal(gstTotal);
    setTotal(subTotal + gstTotal);
  };

  useEffect(() => {
    updateTotals();
  }, [selectedItems, selectedQuantities]);

  useEffect(() => {
    id && rowData && getPurchaseOrderDetails(id);

    return () => {
      setPurchaseOrderNumber("");
      setPurchaseOrder(null);
      setBillingAddress("");
      setShippingAddress("");
      setSelectedItems([]);
    };
  }, [id, rowData]);

  const getPurchaseOrderDetails = async (id) => {
    const response = await getPurchaseOrderDetailsReq(id);
    const purchaseOrder = response?.purchaseOrder;

    setPurchaseOrder(purchaseOrder);
    setPurchaseOrderNumber(purchaseOrder.purchaseOrderNumber);
    setBillingAddress(purchaseOrder.billing.branchId);
    setShippingAddress(purchaseOrder.shipping.branchId);

    let items = purchaseOrder.items;
    items.forEach((item) => {
      item.category = rowData.find(
        (data) => data._id === item.itemId
      )?.category.name;
      item.gst = item.taxes.map((tax) => tax.taxName).join(", ");
      item.taxes = item.taxes.map(({ _id, ...rest }) => rest);
    });

    setDeliveryDate(formatDate(purchaseOrder.deliveryDate));
    setSelectedItems(items);
  };

  function formatDate(dateStr) {
    const date = new Date(dateStr);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    props.setBreadcrumbItems("Create Purchase Order", breadcrumbItems);
    if (!effectCalled.current) {
      getBranchData();
      getListOfRowData();
      effectCalled.current = true;
    }
  }, [props, breadcrumbItems, getBranchData]);

  const onCreatePurchaseOrderClick = (e) => {

    if (isEmpty(purchaseOrderNumber)) {
      console.log('-----------------------')
      validation.setFieldError('purchaseOrderNumber')
    }
    console.log(validation.errors);


    if (selectedItems.length === 0) {
      toast.error("Please select at least 1 item!", {
        position: "top-center",
        theme: "light",
      });
      return;
    } else {
      setIsButtonLoading(true);
      e.preventDefault();

      async function handlePurchaseOrderCreation() {
        try {
          const response = id
            ? await updatePurchaseOrderReq(body)
            : await createPurchaseOrderReq(body);
          const _id = id
            ? response?.payload?.updatedPurchaseOrder?._id
            : response?.payload?.purchaseOrder?._id;
          setTimeout(() => {
            redirectToPurchaseDetails(_id);
          }, 1000)
          toast.success(id ? 'Purchase Order Created Successfully' : 'Purchase Order Updated Successfully', {
            position: "top-center",
            theme: "light",
          });
        } catch (error) {
          toast.error(error.response.data.message, {
            position: "top-center",
            theme: "light",
          });
        } finally {
          setIsButtonLoading(false);
        }
      }
      // validation.handleSubmit();

      const body = {
        purchaseOrderNumber, agreementId, status, deliveryDate,
        billingBranchId: billingAddress,
        shippingBranchId: shippingAddress,
        items: selectedItems.map(({ category, gst, _id, ...rest }) => ({
          ...rest,
          quantity:
            selectedQuantities[`${rest.itemId}-${rest.variantId}`] ||
            rest.quantity,
        })),
      };

      if (id) {
        body.purchaseOrderId = id;
      }

      handlePurchaseOrderCreation();
      return false;
    }
  };

  const handleClickPO = () => {
    if (!purchaseOrderNumber.startsWith("PO ")) {
      setPurchaseOrderNumber("PO ");
    }
  };

  const handleChangePO = (e) => {
    let value = e.target.value;

    if (value === "PO ") {
      setPurchaseOrderNumber(value);
    } else if (value.length <= 2 && !value.startsWith("PO")) {
      setPurchaseOrderNumber("PO ");
    } else if (!value.startsWith("PO")) {
      setPurchaseOrderNumber("PO " + value);
    } else {
      setPurchaseOrderNumber(value);
    }
    validation.setFieldValue("purchaseOrderNumber", purchaseOrderNumber);
  };

  const handleChangeDate = (event) => {

    const selectedDate = new Date(event.target.value);
    const today = new Date(minDate);

    // Check if the selected date is before today
    if (selectedDate < today) {
      // Reset to today's date
      event.target.value = minDate;
    }
    setDeliveryDate(event.target.value);
  }

  return (
    <>
      <div style={{ position: "relative" }}>
        {/* <ToastContainer position="top-center" theme="colored" /> */}
        <div
          style={{
            position: "absolute",
            top: -50,
            right: 10,
            display: "flex",
          }}
        >
          <Modal size="sm" isOpen={publishModal} centered={true}>
            <PublishConfirm
              setPublishModal={setPublishModal}
              setStatus={setStatus}
            />
          </Modal>
          <select
            className="form-select focus-width"
            name="status"
            value={status}
            onChange={handleStatusChange}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <StyledButton
            color={"primary"}
            className={"w-md mx-2"}
            onClick={onCreatePurchaseOrderClick}
            isLoading={isButtonLoading}
          >
            {id ? "Update" : "Save"}
          </StyledButton>
        </div>
      </div>
      <Card>
        <CardBody>
          <div className="card-content">
            <div className="image-container">
              <img
                src={require("../../assets/images/Willsmeet-Logo.png")}
                alt="Company Logo"
                className="card-image"
              />
            </div>
            <div className="details">
              <h3 className="fw-bolder">
                Bansi Office Solutions Private Limited
              </h3>
              <p className="m-0">
                #1496, 19th Main Road, Opp Park Square Apartment, HSR Layout,
                Bangalore Karnataka 560102, India
              </p>
              <p className="m-0">
                GSTIN: 29AAJCB1807A1Z3 CIN:U74999KA2020PTC137142
              </p>
              <p className="m-0">MSME No : UDYAM-KR-03-0065095</p>
              <p className="m-0">
                Web: www.willsmeet.com, Email:sales@willsmeet.com
              </p>
            </div>
            <div>
              <span className="purchase-order">Purchase Order</span>
              <br />
              <span className="purchase-order-no">{purchaseOrderNumber}</span>
            </div>
          </div>
        </CardBody>
      </Card>
      <Row className="mb-3">
        <div style={{ position: "relative" }}>
          <ToastContainer position="top-center" theme="colored" />
          <Row className="equal-height-cards">
            <Col xl="8">
              <Card>
                <CardHeader>Billing & Shipping</CardHeader>
                <CardBody>
                  <div class="d-flex">
                    <div class="p-2" style={{ width: '49%' }}>
                      <div>
                        <label className="col-form-label">
                          Billing Address
                        </label>
                        <select
                          name="billingAddress"
                          id="billingAddress"
                          className="form-select focus-width"
                          onChange={handleBillingChange}
                          onBlur={validation.handleBlur}
                          value={billingAddress}
                        >
                          <option value="" disabled>
                            Select Billing Address
                          </option>
                          {branchList.map((branch) => (
                            <option key={branch._id} value={branch._id}>
                              {branch.name}
                            </option>
                          ))}
                        </select>
                        {billingAddressError && (
                          <span style={{ color: "red" }}>
                            {billingAddressError}
                          </span>
                        )}
                        <h5 className="my-3">
                          {
                            branchList.find(
                              (branch) => branch._id === billingAddress
                            )?.address
                          }
                        </h5>
                      </div>
                    </div>
                    <div class="p-2">
                      <div class="vr h-100"></div>
                    </div>
                    <div class="p-2" style={{ width: '49%' }}>
                      <div>
                        <label className="col-form-label">Shipping</label>
                        <select
                          name="shippingAddress"
                          id="shippingAddress"
                          className="form-select focus-width"
                          onChange={handleShippingChange}
                          onBlur={validation.handleBlur}
                          value={shippingAddress}
                        >
                          <option value="" disabled>
                            Select Shipping Address
                          </option>
                          {branchList.map((branch) => (
                            <option key={branch._id} value={branch._id}>
                              {branch.name}
                            </option>
                          ))}
                        </select>
                        {shippingAddressError && (
                          <span style={{ color: "red" }}>
                            {shippingAddressError}
                          </span>
                        )}
                        <h5 className="my-3">
                          {
                            branchList.find(
                              (branch) => branch._id === shippingAddress
                            )?.address
                          }
                        </h5>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl="4">
              <Card>
                <CardHeader>Order Info</CardHeader>
                <CardBody>
                  <Row>
                    <div>
                      <Label for="Po Number">Po Number</Label>
                      <Input
                        type="text"
                        name="purchaseOrderNumber"
                        id="purchaseOrderNumber"
                        value={purchaseOrderNumber}
                        placeholder="PO BLR/#123"
                        onClick={handleClickPO}
                        onChange={handleChangePO}
                        onBlur={validation.handleBlur}
                      />
                      {poNumberError && (
                        <span style={{ color: "red" }}>{poNumberError}</span>
                      )}
                    </div>
                  </Row>
                  <Row>
                    <div className="mt-3 mb-0">
                      <Label for="deliveryDate">Expected Delivery Date</Label>
                      <Input
                        type="date"
                        name="deliveryDate"
                        id="deliveryDate"
                        placeholder="dd-mm-yyyy"
                        value={deliveryDate}
                        min={minDate}
                        onClick={(e) => e.target.showPicker()}
                        onChange={handleChangeDate}
                        onBlur={validation.handleBlur}
                      />
                      {deliveryDateError && (
                        <span style={{ color: "red" }}>
                          {deliveryDateError}
                        </span>
                      )}
                    </div>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl="8">
              <Card className="mt-3" style={{ height: "100%" }}>
                <CardHeader>Order Details</CardHeader>
                <CardBody>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  ></div>
                  <div>
                    <Row>
                      <Col xl="12">
                        <Input
                          id="searchQuery"
                          name="searchQuery"
                          placeholder="Search Item"
                          className="form-control m-1"
                          value={searchQuery}
                          onChange={handleSearchQuery}
                          autoComplete="off"
                        />
                      </Col>
                    </Row>

                    {showRowData && (
                      <div
                        className="form-control"
                        style={{
                          position: "absolute",
                          zIndex: 4,
                          width: "750px",
                          overflowY: "auto",
                        }}
                      >
                        <Table hover striped>
                          <thead>
                            <tr>
                              <th>Item Title</th>
                              <th>HSN Code</th>
                              <th>Category</th>
                              <th>Cost</th>
                              <th>GST</th>
                            </tr>
                          </thead>
                          <tbody>
                            {!loadedData && (
                              <tr>
                                <td
                                  colSpan={5}
                                  className="form-text-lg text-center"
                                >
                                  <CircularProgress />
                                </td>
                              </tr>
                            )}
                            {filteredRowData.map((item) =>
                              item.variants.map((variant) => (
                                <tr
                                  key={variant._id}
                                  className="row-clickable cursor-pointer"
                                  onClick={() => {
                                    handleItemSelect(item, variant);
                                    setSearchQuery("");
                                  }}
                                >
                                  <td>{item.title}</td>
                                  <td>{item.hsnCode}</td>
                                  <td>{item.category.name}</td>
                                  <td>
                                    {formatNumberWithCommasAndDecimal(
                                      variant.price
                                    )}
                                  </td>
                                  <td>
                                    {item.taxes
                                      .map((tax) => tax.name)
                                      .join(", ")}
                                  </td>
                                </tr>
                              ))
                            )}
                            {(!filteredRowData ||
                              filteredRowData.length === 0) && (
                                <tr>
                                  <td
                                    colSpan={5}
                                    className="form-text-lg text-center"
                                  >
                                    No items found.
                                  </td>
                                </tr>
                              )}
                          </tbody>
                        </Table>
                      </div>
                    )}
                  </div>
                  <Row className="mt-1 table-responsive fw-medium">
                    <Table hover striped>
                      <thead>
                        <tr>
                          <th>Item Name</th>
                          <th>HSN Code</th>
                          <th>Category</th>
                          <th>Cost</th>
                          <th>Quantity</th>
                          <th>Total</th>
                          <th>GST</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>{renderSelectedItems()}</tbody>
                    </Table>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col xl="4">
              <Card className="mt-3">
                <CardHeader>Order Info</CardHeader>
                <CardBody style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <h5
                      className="mb-0"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Sub Total :</span>
                      <span>{formatNumberWithCommasAndDecimal(subTotal)}</span>
                    </h5>
                    <div style={{ fontSize: "0.7rem" }}>
                      Total Quantity: {selectedItems.length}
                    </div>
                    <hr />
                    <h5
                      className="mb-0"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>GST :</span>
                      <span>{formatNumberWithCommasAndDecimal(gstTotal)}</span>
                    </h5>
                    <hr />
                    <h5
                      className="mb-0"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Total :</span>
                      <span>{formatNumberWithCommasAndDecimal(total)}</span>
                    </h5>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </Row>
    </>
  );
};

export default connect(null, { setBreadcrumbItems })(CreateOrder);
