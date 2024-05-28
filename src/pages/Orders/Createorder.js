import React, { useEffect, useState, useRef, useCallback } from "react";
import { connect, useDispatch } from "react-redux";
import { Row, Col, Card, CardBody, Input, Label, Table } from "reactstrap";
import { CircularProgress, TableBody } from "@mui/material";
import { ToastContainer } from "react-toastify";
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
import { useNavigate } from "react-router-dom";

const CreateOrder = (props) => {
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
  const [orderDate, setOrderDate] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [shippingAddressError, setShippingAddressError] = useState("");
  const [billingAddressError, setBillingAddressError] = useState("");
  const [validDate, setValidDate] = useState();

  const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Purchase Order", link: "#" },
    { title: "Create Purchase Order", link: "#" },
  ];

  const bodyObject = {
    page: 1,
    limit: 200,
  };

  const redirectToPurchaseDetails = () => {
    let path = `/purchase-order-details/`;
    setTimeout(() => {
      navigate(path);
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
    const selectedId = event.target.value;
    const selectedBranch = branchList.find(
      (branch) => branch._id === selectedId
    );
    setBillingAddress(selectedBranch?.address || "");
  };

  const handleShippingChange = (event) => {
    const selectedId = event.target.value;
    const selectedBranch = branchList.find(
      (branch) => branch._id === selectedId
    );
    setShippingAddress(selectedBranch?.address || "");
  };

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      billingAddress: "",
      shippingAddress: "",
      poNumber: "",
      orderDate: "",
      selectedItems: [],
      selectedQuantities: {},
      // Any other fields you need
    },
    validationSchema: Yup.object({
      billingAddress: Yup.string().required("Please Select Billing Address"),
      shippingAddress: Yup.string().required("Please Select Shipping Address"),
      poNumber: Yup.string().required("Please Enter PO Number"),
      orderDate: Yup.string().required("Please Enter Order Date"),
      selectedItems: Yup.array().of(
        Yup.object().shape({
          id: Yup.string().required(),
          title: Yup.string().required(),
          hsnCode: Yup.string().required(),
          category: Yup.string().required(),
          price: Yup.number().required().positive(),
          qty: Yup.number().required().positive().integer(),
          gst: Yup.string().required(),
          variant: Yup.object().shape({
            _id: Yup.string().required(),
            itemId: Yup.string().required(),
            sku: Yup.string().required(),
            inventory: Yup.number().required().integer(),
            price: Yup.number().required().positive(),
            agreementVariant: Yup.string().required(),
          }),
        })
      ),
      selectedQuantities: Yup.object().shape({
        // to be added
      }),
    }),
    onSubmit: (values) => {
      console.log("Submit");
    },
  });

  const getListOfRowData = async () => {
    try {
      const response = await getAgreementItemsReq(bodyObject);
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
      id: item._id,
      title: item.title,
      hsnCode: item.hsnCode,
      category: item.category.name,
      price: variant.price,
      qty: 1,
      gst: taxName,
      variant: variant,
    };

    if (
      !selectedItems.some(
        (selectedItem) =>
          selectedItem.id === newItem.id &&
          selectedItem.variant._id === variant._id
      )
    ) {
      setSelectedItems([...selectedItems, newItem]);
      setSelectedQuantities({
        ...selectedQuantities,
        [`${newItem.id}-${variant._id}`]: 1,
      });
      setSelectedVariants({ ...selectedVariants, [newItem.id]: variant._id });
    }
    setShowRowData(false);
  };

  const handleItemDelete = (itemId, variantId) => {
    const updatedItems = selectedItems.filter(
      (item) => item.id !== itemId || item.variant._id !== variantId
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
        <Row className="form-text-lg" style={{ marginLeft: "-0.5rem" }}>
          <Col className="text-center">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p style={{ alignItems: "center" }}>No items Added.</p>
            </div>
          </Col>
        </Row>
      );
    }

    return selectedItems.map((item) => (
      <tbody key={`${item.id}-${item.variant._id}`}>
        <tr>
          <td style={{ whiteSpace: "nowrap" }}>{item.title}</td>
          <td>{item.hsnCode}</td>
          <td style={{ whiteSpace: "nowrap" }}>{item.category}</td>
          <td style={{ whiteSpace: "nowrap" }}>
            {formatNumberWithCommasAndDecimal(item.price)}
          </td>
          <td>
            <Input
              type="number"
              min="1"
              value={selectedQuantities[`${item.id}-${item.variant._id}`] || 1}
              onChange={(e) => {
                const quantity = parseInt(e.target.value, 10);
                setSelectedQuantities({
                  ...selectedQuantities,
                  [`${item.id}-${item.variant._id}`]: quantity,
                });
                updateTotals();
              }}
            />
          </td>
          <td style={{ whiteSpace: "nowrap" }}>
            {formatNumberWithCommasAndDecimal(
              item.price *
                (selectedQuantities[`${item.id}-${item.variant._id}`] || 1)
            )}
          </td>
          <td style={{ whiteSpace: "nowrap" }}>{item.gst}</td>
          <td>
            <Delete
              style={{ cursor: "pointer" }}
              onClick={() => handleItemDelete(item.id, item.variant._id)}
            />
          </td>
        </tr>
      </tbody>
    ));
  };

  const updateTotals = () => {
    let subTotal = 0;
    let gstTotal = 0;

    selectedItems.forEach((item) => {
      const quantity =
        selectedQuantities[`${item.id}-${item.variant._id}`] || 1;
      const itemTotal = item.variant.price * quantity;
      subTotal += itemTotal;

      // Check if item.taxes is defined and not empty
      if (item.gst) {
        // Extract the GST rate from the gst string (e.g., "gst 18%")
        const gstRate = parseFloat(item.gst.split(" ")[1]); // Extracts "18" from "gst 18%"
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
    props.setBreadcrumbItems("Create Purchase Order", breadcrumbItems);
    if (!effectCalled.current) {
      getBranchData();
      getListOfRowData();
      effectCalled.current = true;
    }
  }, [props, breadcrumbItems, getBranchData]);

  const onCreatePurchaseOrderClick = (e) => {
    e.preventDefault();
    if (selectedItems.length > 0) {
      redirectToPurchaseDetails();
    } else {
      alert("Please select an atleast 1 item!");
    }
    // validation.handleSubmit();

    // const formData = {
    //   shippingAddress: shippingAddress,
    //   billingAddress: billingAddress,
    //   // Add other form fields here if needed
    // };

    // const validationErrors = validation.validationSchema.validate(
    //   { billingAddress, shippingAddress },
    //   { abortEarly: false }
    // );
    // console.log(validationErrors);

    // if (validationErrors) {
    //   // Check if shippingAddress has an error
    //   if (validationErrors.shippingAddress) {
    //     setShippingAddressError("Please select shipping address.");
    //   } else {
    //     setShippingAddressError("");
    //   }

    //   if (validationErrors.billingAddress) {
    //     setBillingAddressError("Please select shipping address.");
    //   } else {
    //     setBillingAddressError("");
    //   }
    // }

    return false;
  };

  const handleClickPO = () => {
    if (!orderDate.startsWith("PO ")) {
      setOrderDate("PO ");
    }
  };

  const handleChangePO = (e) => {
    const value = e.target.value;

    if (!value.startsWith("PO")) {
      setOrderDate("PO" + value.replace(/^PO/, ""));
    } else {
      setOrderDate(value);
    }
  };

  const handleChangeDate = (e) => {
    let input = e.target.value.replace(/\D/g, "");

    if (e.nativeEvent.inputType === "deleteContentBackward") {
      const lastHyphenIndex = date.lastIndexOf("-");
      console.log("Last hyphen Index: ", lastHyphenIndex);
      if (lastHyphenIndex !== -1) {
        input = input.slice(0, lastHyphenIndex - 1);
      } else {
        input = input.slice(0, -1);
      }
    } else {
      input = input.slice(0, 8);

      if (input.length >= 2 && input.charAt(2) !== "-") {
        input = input.slice(0, 2) + "-" + input.slice(2);
      }
      if (input.length >= 5 && input.charAt(5) !== "-") {
        input = input.slice(0, 5) + "-" + input.slice(5);
      }
    }

    setDate(input);

    // if (input.length === 10) {
    //   const [day, month, year] = input.split("-").map(Number);

    //   if (month < 1 || month > 12) {
    //     setError("Invalid month");
    //   } else if (day < 1 || day > 31) {
    //     setError("Invalid day");
    //   } else {
    //     setError("");
    //   }
    // } else {
    //   setError("");
    // }
  };

  useEffect(() => {
    // regex for DD-MM-YYYY
    const regexddmmyyyy =
      /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/;

    if (regexddmmyyyy.test(date)) {
      setValidDate(true);
    } else {
      setValidDate(false);
    }
  }, [date]);

  const renderRowData = () => {
    if (!loadedData) {
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

    if (!filteredRowData || filteredRowData.length === 0) {
      return (
        <Row>
          <p className="form-text-lg text-center">No items found.</p>
        </Row>
      );
    }

    return filteredRowData.map((item) =>
      item.variants.map((variant) => (
        <Row
          key={variant._id}
          className="row-clickable"
          onClick={() => {
            handleItemSelect(item, variant);
            setSearchQuery("");
          }}
          style={{
            borderBottom: "1px solid #f4f4f4",
            cursor: "pointer",
          }}
        >
          <Table hover size="sm">
            <TableBody>
              <tr>
                <td>{item.title}</td>
                <td>{item.hsnCode}</td>
                <td>{item.category.name}</td>
                <td>{formatNumberWithCommasAndDecimal(variant.price)}</td>
                <td>{item.taxes.map((tax) => tax.name).join(", ")}</td>
              </tr>
            </TableBody>
          </Table>
        </Row>
      ))
    );
  };

  return (
    <>
      <div style={{ position: "relative" }}>
        <ToastContainer position="top-center" theme="colored" />
        <div
          style={{
            position: "absolute",
            top: -50,
            right: 10,
            display: "flex",
          }}
        >
          <select className="form-select focus-width" name="status">
            <option value="draft">Draft</option>
            <option value="active">Published</option>
          </select>
          <StyledButton
            color={"primary"}
            className={"w-md mx-2"}
            onClick={onCreatePurchaseOrderClick}
            isLoading={isButtonLoading}
          >
            Save
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
              <h3>
                <br />
                <span>Bansi Office Solutions Private Limited</span>
              </h3>
              #1496, 19th Main Road, Opp Park Square Apartment, HSR Layout,
              Bangalore Karnataka 560102, India
              <br />
              GSTIN: 29AAJCB1807A1Z3 CIN:U74999KA2020PTC137142
              <br />
              MSME No : UDYAM-KR-03-0065095
              <br />
              Web: www.willsmeet.com, Email:sales@willsmeet.com
              <br />
            </div>
            <div>
              <span className="purchase-order">Purchase Order</span>
              <br />
              <span className="purchase-order-no">PO #BLR/S0/11742</span>
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
                <CardBody>
                  <h4 className="card-title">Billing & Shipping</h4>
                  <hr />
                  <Row>
                    <Col xl="5">
                      <div>
                        <label className="col-form-label">Billing</label>
                        <select
                          name="billingAddress"
                          id="billingAddress"
                          className="form-select focus-width"
                          onChange={handleBillingChange}
                        >
                          <option>Select Billing Address</option>
                          {branchList.map((branch) => (
                            <option key={branch._id} value={branch._id}>
                              {branch.name}
                            </option>
                          ))}
                        </select>
                        {/* {billingAddressError && (
                          <span style={{ color: "red" }}>
                            {billingAddressError}
                          </span>
                        )} */}
                        <div className="mt-2">
                          <p />
                          {billingAddress}
                        </div>
                      </div>
                    </Col>
                    <Col xl="1">
                      <div className="vertical-line"></div>
                    </Col>
                    <Col xl="5">
                      <div>
                        <label className="col-form-label">Shipping</label>
                        <select
                          name="shippingAddress"
                          id="shippingAddress"
                          className="form-select focus-width"
                          onChange={handleShippingChange}
                        >
                          <option>Select Shipping Address</option>
                          {branchList.map((branch) => (
                            <option key={branch._id} value={branch._id}>
                              {branch.name}
                            </option>
                          ))}
                        </select>
                        {/* {shippingAddressError && (
                          <span style={{ color: "red" }}>
                            {shippingAddressError}
                          </span>
                        )} */}
                        <div className="mt-2">
                          <p />
                          {shippingAddress}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col xl="4">
              <Card>
                <CardBody>
                  <Row>
                    <div>
                      <h4 className="card-title">Order Info</h4>
                      <hr />
                      <Label for="orderDate">Po Number</Label>
                      <Input
                        type="text"
                        name="orderDate"
                        id="orderDate"
                        value={orderDate}
                        placeholder="PO BLR/#123"
                        onClick={handleClickPO}
                        onChange={handleChangePO}
                      />
                    </div>
                  </Row>
                  <Row>
                    <div className="mt-3 mb-0">
                      <Label for="orderDate">Expected Delivery Date</Label>
                      <Input
                        type="text"
                        name="orderDate"
                        id="orderDate"
                        placeholder="dd-mm-yyyy"
                        value={date}
                        onChange={handleChangeDate}
                      />
                      {date.length === 10 && !validDate ? (
                        <p className="text-danger">Invalid Date!</p>
                      ) : null}
                    </div>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl="8">
              <Card className="mt-3" style={{ height: "100%" }}>
                <CardBody>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
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
                          value={searchQuery}
                          onChange={handleSearchQuery}
                        />
                      </Col>
                    </Row>

                    {showRowData && (
                      <div
                        className="form-control"
                        style={{
                          textAlign: "center",
                          position: "absolute",
                          zIndex: 4,
                          width: "auto",
                          overflowY: "auto",
                        }}
                      >
                        <Row
                          className="mt-3"
                          style={{ width: "750px", fontWeight: "bold" }}
                        >
                          <Table>
                            <thead>
                              <th>Item Title</th>
                              <th>HSN Code</th>
                              <th>Category</th>
                              <th>Cost</th>
                              <th>GST</th>
                            </thead>
                          </Table>
                          {/* <Col>Item Name</Col>
                          <Col>HSN Code</Col>
                          <Col>Category</Col>
                          <Col>Cost</Col>
                          <Col>GST</Col> */}
                        </Row>
                        <hr />
                        {renderRowData()}
                      </div>
                    )}
                  </div>
                  <Row
                    className="mt-1"
                    style={{
                      width: "750px",
                      fontWeight: "bold",
                    }}
                  >
                    <Table hover>
                      <tr>
                        <thead>
                          <th>Item Name</th>
                          <th>HSN Code</th>
                          <th>Category</th>
                          <th>Cost</th>
                          <th>Quantity</th>
                          <th>Total</th>
                          <th>GST</th>
                          <th></th>
                        </thead>
                      </tr>
                      <tr
                        style={{
                          textAlign: "center",
                          justifyContent: "center",
                        }}
                      >
                        <thead
                          style={{
                            textAlign: "center",
                            justifyContent: "center",
                          }}
                        >
                          {renderSelectedItems()}
                        </thead>
                      </tr>
                    </Table>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col xl="4">
              <Card className="mt-3">
                <CardBody style={{ display: "flex", flexDirection: "column" }}>
                  <h4 className="card-title">Order Info</h4>
                  <hr />
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
