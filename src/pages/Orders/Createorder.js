import { CircularProgress } from "@mui/material";
import { useFormik } from "formik";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  Label,
  Modal,
  Row,
  Table,
} from "reactstrap";
import * as Yup from "yup";
import StyledButton from "../../components/Common/StyledButton";
import PublishConfirm from "../../components/CustomComponents/PublishConfirm";
import { getClientBranchListReq } from "../../service/branchService";
import { getAgreementItemsReq } from "../../service/itemService";
import {
  createPurchaseOrderReq,
  getPurchaseOrderDetailsReq,
  getPurchaseOrderSequenceReq,
  updatePurchaseOrderReq,
} from "../../service/purchaseService";
import { setBreadcrumbItems } from "../../store/Breadcrumb/actions";
import { changePreloader } from "../../store/actions";
import { formatNumberWithCommasAndDecimal } from "../Invoices/invoiceUtil";
import "./styles/CreateOrder.scss";
import "./styles/CreateOrderCard.scss";

import { HighlightOff } from "@mui/icons-material";
import Hero from "../../components/Common/Hero";
import RequirePermission from "../../routes/middleware/requirePermission";
import { MODULES_ENUM, PERMISSIONS_ENUM } from "../../utility/constants";
import { getClientWithIdReq } from "../../service/clientService";
import useAuth from "../../hooks/useAuth";

const CreateOrder = (props) => {
  let { id } = useParams();

  document.title = id ? "Edit Purchase Order" : "Create Purchase Order";
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const [branchList, setBranchList] = useState([]);
  const effectCalled = useRef(false);
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
  const [agreementId, setAgreementId] = useState(0);
  const [status, setStatus] = useState("draft");
  const [publishModal, setPublishModal] = useState(false);
  const [poPrefix, setPoPrefix] = useState("");
  const [terms, setTerms] = useState(`1. All the invoices should mandatorily be mentioned with Bansi Office Solutions Private Limited PO Number & should be attached with PO copy ,without which the invoice would be considered invalid.
2. All the invoices should be mentioned with vendor bank details.`)

  const [minDate, setMinDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
    const day = String(today.getDate() + 1).padStart(2, "0"); // Add leading zero if needed
    return `${year}-${month}-${day}`;
  });

  const [purchaseOrder, setPurchaseOrder] = useState(null);
  const { auth } = useAuth()

  const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Purchase Order", link: "#" },
    { title: id ? "Edit Purchase Order" : "Create Purchase Order", link: "#" },
  ];

  const bodyObject = {
    page: 1,
    limit: 200,
  };

  const columnDefs = ["Item Name", "HSN Code", "Category", "Cost", "Quantity", "Unit", "Total", "GST", "",]
  const clientColumnDefs = columnDefs.filter(
    (colDef) => !["Cost", "Total"].includes(colDef)
  );
  const clientId = JSON.parse(localStorage.getItem("user")).clientId
  const [clientName, setClientName] = useState()

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

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleChangeDate = (event) => {
    const selectedDate = new Date(event.target.value);
    const today = new Date(minDate);

    // Check if the selected date is before today
    if (selectedDate < today) {
      // Reset to today's date
      event.target.value = minDate;
    }
    formik.setFieldValue("deliveryDate", event.target.value);
  };

  const formik = useFormik({
    initialValues: {
      billingAddress: "",
      shippingAddress: "",
      deliveryDate: "",
      terms: terms
    },
    validationSchema: Yup.object({
      billingAddress: Yup.string().required("Please Select Billing Address"),
      shippingAddress: Yup.string().required("Please Select Shipping Address"),
      deliveryDate: Yup.string().required("Please Enter Delivery Date"),
      terms: Yup.string().optional()
    }),
    onSubmit: (values) => {
      saveOrUpdatePurchaseOrder(values);
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

  const fetchClientData = async () => {
    try {
      const data = { _id: clientId };
      const res = await getClientWithIdReq(data);

      setClientName(res.payload.client.name)

    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchPurchaseOrderSequence = async () => {
    try {
      const res = await getPurchaseOrderSequenceReq();
      
      // set the PO Number
      setPoPrefix(res.purchaseOrderNumber)
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleItemSelect = (item, variant) => {
    const taxName = item.taxes.map((tax) => tax.name).join(", ");
    const newItem = {
      itemId: item._id,
      zohoItemId: item.zohoItemId,
      itemName: item.title,
      itemDescription: item.description ? item.description : item.title,
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
    debugger;
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

    return selectedItems.map((item) => {
      const handleDescriptionChange = (e) => {
        const newDescription = e.target.value;
  
        // Create a new array with updated item descriptions
        const updatedItems = selectedItems.map((currentItem) => {
          if (currentItem.itemId === item.itemId && currentItem.variantId === item.variantId) {
            // Update the itemDescription for the matching item
            return {
              ...currentItem,
              itemDescription: newDescription,
            };
          }
          return currentItem; // Keep the rest of the items unchanged
        });
  
        // Update the selectedItems state
        setSelectedItems(updatedItems);
      };

      return (
        <tr
          key={`${item.itemId}-${item.variantId}`}
          style={{ verticalAlign: "start" }}
        >
          <td>
            {item.itemName}
            <Input
              type="text"
              id="itemDescription"
              name="itemDescription"
              onChange={handleDescriptionChange}
              value={item.itemDescription}
              placeholder="Description for the item"
            />
          </td>
          <td>{item.hsnCode}</td>
          <td style={{ whiteSpace: "nowrap" }}>{item.category}</td>
          <RequirePermission module={MODULES_ENUM.ORDERS} permission={PERMISSIONS_ENUM.CREATE}>
            <td style={{ whiteSpace: "nowrap" }}>
              {formatNumberWithCommasAndDecimal(item.unitPrice)}
            </td>
          </RequirePermission>
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
          <td style={{ whiteSpace: "nowrap" }}>{item.itemUnit}</td>
          <RequirePermission module={MODULES_ENUM.ORDERS} permission={PERMISSIONS_ENUM.CREATE}>
            <td style={{ whiteSpace: "nowrap" }}>
              {formatNumberWithCommasAndDecimal(
                item.unitPrice *
                  (selectedQuantities[`${item.itemId}-${item.variantId}`] || 1)
              )}
            </td>
          </RequirePermission>
          <td style={{ whiteSpace: "nowrap" }}>{item.gst}</td>
          <td>
            <HighlightOff
              color="error"
              style={{ cursor: "pointer" }}
              onClick={() => handleItemDelete(item.itemId, item.variantId)}
            />
          </td>
        </tr>
    )});
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
      formik.resetForm();
      setPurchaseOrder(null);
      setSelectedItems([]);
    };
  }, [id, rowData]);

  const getPurchaseOrderDetails = async (id) => {
    const response = await getPurchaseOrderDetailsReq(id);
    const purchaseOrder = response?.purchaseOrder;

    setPurchaseOrder(purchaseOrder);

    formik.setValues({
      billingAddress: purchaseOrder.billing.branchId,
      shippingAddress: purchaseOrder.shipping.branchId,
      purchaseOrderNumber: purchaseOrder.purchaseOrderNumber,
      deliveryDate: formatDate(purchaseOrder.deliveryDate),
      terms: purchaseOrder.terms ? purchaseOrder.terms : terms
    });
    purchaseOrder.terms && setTerms(purchaseOrder.terms)

    let items = purchaseOrder.items;
    items.forEach((item) => {
      item.category = rowData.find(
        (data) => data._id === item.itemId
      )?.category.name;
      item.gst = item.taxes.map((tax) => tax.taxName).join(", ");
      item.taxes = item.taxes.map(({ _id, ...rest }) => rest);
    });

    const result = items.reduce((acc, item) => {
      const key = `${item.itemId}-${item.variantId}`;
      acc[key] = item.quantity;
      return acc;
    }, {});

    setSelectedQuantities(result);
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
    props.setBreadcrumbItems(id ? "Edit Purchase Order" : "Create Purchase Order", breadcrumbItems);
    if (!effectCalled.current) {
      getBranchData();
      getListOfRowData();
      fetchPurchaseOrderSequence()
      fetchClientData()
      effectCalled.current = true;
    }
  }, [props, breadcrumbItems, getBranchData]);

  useEffect(() => {
    formik.setFieldValue("purchaseOrderNumber", poPrefix)
  },[poPrefix])
  
  useEffect(() => {
    formik.setFieldValue("terms", terms)
  },[terms])

  const saveOrUpdatePurchaseOrder = (values) => {
    if (selectedItems.length === 0) {
      toast.error("Please select at least 1 item!", {
        position: "top-center",
        theme: "light",
      });
      return;
    } else {
      setIsButtonLoading(true);
      // e.preventDefault();

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
          }, 1000);
          toast.success(
            id
              ? "Purchase Order Updated Successfully"
              : "Purchase Order Created Successfully",
            {
              position: "top-center",
              theme: "light",
            }
          );
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
      const {
        deliveryDate,
        billingAddress,
        shippingAddress,
        terms
      } = values;
      const body = {
        agreementId,
        status,
        deliveryDate,
        billingBranchId: billingAddress,
        shippingBranchId: shippingAddress,
        items: selectedItems.map(({ category, gst, _id, ...rest }) => ({
          ...rest,
          quantity:
            selectedQuantities[`${rest.itemId}-${rest.variantId}`] ||
            rest.quantity,
        })),
        terms
      };

      if (id) {
        body.purchaseOrderId = id;
      }

      handlePurchaseOrderCreation();
      return false;
    }
  };

  const handleClickPO = () => {
    const purchaseOrderNumber = formik.values.purchaseOrderNumber;
    if (!purchaseOrderNumber) {
      formik.setFieldValue("purchaseOrderNumber", poPrefix);
    }
  };

  const handleChangePO = (e) => {
    let value = e.target.value;
    if (value.length < poPrefix.length) {
      formik.setFieldValue("purchaseOrderNumber", poPrefix);
    } else {
      formik.setFieldValue("purchaseOrderNumber", value);
    }
  };

  const handleChangeTerms = (e) => {
    let value = e.target.value;
    formik.setFieldValue("terms", value)
    setTerms(value)
  }

  return (
    <form onSubmit={formik.handleSubmit} autoComplete="off">
      <div style={{ position: "relative" }}>
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
              id={id}
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
            type="submit"
            className={"w-md mx-2"}
            isLoading={isButtonLoading}
          >
            {id ? "Update" : "Save"}
          </StyledButton>
        </div>
      </div>
      <Card>
        <CardBody>
          <div className="card-content">
            <div className="details">
              <h3 className="fw-bolder">
                {clientName}
              </h3>
              <p className="m-0">
                {formik.values.billingAddress ?
                  branchList.find(
                    (branch) =>
                      branch._id === formik.values.billingAddress
                  )?.name
                  : branchList[0]?.name
                }
              </p>
              <p className="m-0">
                {formik.values.billingAddress ?
                  branchList.find(
                    (branch) =>
                      branch._id === formik.values.billingAddress
                  )?.address
                  : branchList[0]?.address
                }
              </p>
              <p className="m-0">
                {formik.values.billingAddress ?
                  branchList.find(
                    (branch) =>
                      branch._id === formik.values.billingAddress
                  )?.contact
                  : branchList[0]?.contact
                }
              </p>
            </div>
            <div>
              <span className="purchase-order">Purchase Order</span>
              <br />
              <span className="purchase-order-no">
                {poPrefix}
              </span>
            </div>
          </div>
        </CardBody>
      </Card>
      <Row className="mb-3">
        <div style={{ position: "relative" }}>
          <Row className="equal-height-cards">
            <Col xl="8">
              <Card>
                <CardHeader>Billing & Shipping</CardHeader>
                <CardBody>
                  <div className="d-flex">
                    <div className="p-2" style={{ width: "49%" }}>
                      <div>
                        <label className="col-form-label">
                          Billing Address
                        </label>
                        <select
                          name="billingAddress"
                          id="billingAddress"
                          value={formik.values.billingAddress}
                          placeholder="Please Select Billing Address"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="form-select focus-width"
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
                        {formik.touched.billingAddress &&
                        formik.errors.billingAddress ? (
                          <div className="text-danger">
                            {formik.errors.billingAddress}
                          </div>
                        ) : null}
                        <h5 className="my-3">
                          {
                            branchList.find(
                              (branch) =>
                                branch._id === formik.values.billingAddress
                            )?.address
                          }
                        </h5>
                      </div>
                    </div>
                    <div className="p-2">
                      <div className="vr h-100"></div>
                    </div>
                    <div className="p-2" style={{ width: "49%" }}>
                      <div>
                        <label className="col-form-label">Shipping</label>
                        <select
                          name="shippingAddress"
                          id="shippingAddress"
                          value={formik.values.shippingAddress}
                          placeholder="Please Select Shipping Address"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="form-select focus-width"
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
                        {formik.touched.shippingAddress &&
                        formik.errors.shippingAddress ? (
                          <div className="text-danger">
                            {formik.errors.shippingAddress}
                          </div>
                        ) : null}
                        <h5 className="my-3">
                          {
                            branchList.find(
                              (branch) =>
                                branch._id === formik.values.shippingAddress
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
                      <Label htmlFor="purchaseOrderNumber">
                        Purchase Order Number
                      </Label>
                      <Input
                        type="text"
                        name="purchaseOrderNumber"
                        id="purchaseOrderNumber"
                        value={poPrefix}
                        placeholder="PO/BLR/#123"
                        onChange={handleChangePO}
                        onClick={handleClickPO}
                        onBlur={formik.handleBlur}
                        disabled={true}
                      />
                      {formik.touched.purchaseOrderNumber &&
                      formik.errors.purchaseOrderNumber ? (
                        <div className="text-danger">
                          {formik.errors.purchaseOrderNumber}
                        </div>
                      ) : null}
                    </div>
                  </Row>
                  <Row>
                    <div className="mt-3 mb-0">
                      <Label htmlFor="deliveryDate">
                        Expected Delivery Date
                      </Label>
                      <Input
                        type="date"
                        name="deliveryDate"
                        id="deliveryDate"
                        placeholder="dd-mm-yyyy"
                        value={formik.values.deliveryDate}
                        min={minDate}
                        onClick={(e) => e.target.showPicker()}
                        onChange={handleChangeDate}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.deliveryDate &&
                      formik.errors.deliveryDate ? (
                        <div className="text-danger">
                          {formik.errors.deliveryDate}
                        </div>
                      ) : null}
                    </div>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl="8">
              <Card className="mt-3" style={{ height: "fit-content" }}>
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
                          {auth?.permissions?.some(
                            (p) =>
                              p.module === MODULES_ENUM.ORDERS &&
                              [PERMISSIONS_ENUM.READ, PERMISSIONS_ENUM.CREATE].every((perm) => p.operations.includes(perm))
                          )
                          ? columnDefs.map((col, index) => <th key={`col-${col}-${index}`}>{col}</th>)
                          : auth?.permissions?.some(
                              (p) =>
                                p.module === MODULES_ENUM.ORDERS && p.operations.includes(PERMISSIONS_ENUM.READ)
                            )
                          ?  clientColumnDefs.map((col, index) => <th key={`col-${col}-${index}`}>{col}</th>)
                          : []}
                        </tr>
                      </thead>
                      <tbody>{renderSelectedItems()}</tbody>
                    </Table>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <RequirePermission module={MODULES_ENUM.ORDERS} permission={PERMISSIONS_ENUM.CREATE}>
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
            </RequirePermission>
          </Row>
          <Row>
            <Col xl="8">
              <Card>
                <CardBody>
                  <Label htmlFor="terms">
                    Terms & Conditions
                  </Label>
                  <Input
                    type="textarea"
                    name="terms"
                    id="terms"
                    value={terms}
                    placeholder="Terms & Conditions"
                    onChange={handleChangeTerms}
                    onBlur={formik.handleBlur}
                    rows={10}
                  />
                  {formik.touched.terms &&
                  formik.errors.terms ? (
                    <div className="text-danger">
                      {formik.errors.terms}
                    </div>
                  ) : null}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </Row>
    </form>
  );
};

export default connect(null, { setBreadcrumbItems })(CreateOrder);
