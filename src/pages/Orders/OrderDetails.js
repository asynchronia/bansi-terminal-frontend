import React, { useCallback, useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Card, CardBody, Col, Row } from "reactstrap";
import { setBreadcrumbItems } from "../../store/actions";

import { ArrowForward, DeleteOutline, Inventory, LocalShipping, MailOutline, Receipt } from '@mui/icons-material';
import { Badge, Chip, IconButton, Tooltip } from "@mui/material";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import { ReactComponent as Edit } from "../../assets/images/svg/edit-button.svg";
import { getOrderDetailsReq } from "../../service/orderService";
import { changePreloader } from "../../store/actions";
import { formatNumberWithCommasAndDecimal } from "../Invoices/invoiceUtil";
import OrderTrackingRenderer from "./OrderTrackingRenderer";

import { styled } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';


const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const OrderDetails = (props) => {
  let dispatch = useDispatch();
  const { id } = useParams();
  const [orderData, setOrderData] = useState();
  const [lineItems, setLineItems] = useState(0);
  const [rowCount, setRowCount] = useState(0);
  const effectCalled = useRef(false);
  const gridRef = useRef();
  const [totalItemTotal, setTotalItemTotal] = useState(0);
  const [totalCGST, setTotalCGST] = useState(0);
  const [totalSGST, setTotalSGST] = useState(0);
  const data = id;
  //Handles BreadCrumbs
  const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
    { title: "All Orders", link: "/ongoing-orders" },
    { title: "Order #" + orderData?.salesorder_number, link: "#" },
  ];

  const autoSizeStrategy = {
    type: "fitGridWidth",
  };

  const pagination = false;

  // sets 10 rows per page (default is 100)
  // allows the user to select the page size from a predefined list of page sizes
  const paginationPageSizeSelector = [5, 10, 25, 50];
  const [paginationPageSize, setPaginationPageSize] = useState(5);

  function OrderDetailsRenderer(params) {
    const { data } = params;
    const { quantity_shipped, quantity_packed, quantity_invoiced } = data;

    // Combine the quantities into a single string
    const combinedQuantity = `Shipped ${quantity_shipped} \n Packed ${quantity_packed} \n Invoiced ${quantity_invoiced}`;

    // Return the combined quantity as the cell value
    return (
      <div>
        <Tooltip title={`Shipped ${quantity_shipped}`}>
          <IconButton size="small" aria-label="Shipped">
            <StyledBadge badgeContent={quantity_shipped} color="primary" showZero>
              <LocalShipping />
            </StyledBadge>
          </IconButton>
        </Tooltip>

        <Tooltip title={`Packed ${quantity_packed}`}>
          <IconButton size="small" aria-label="Packed">
            <StyledBadge badgeContent={quantity_packed} color="secondary" showZero>
              <Inventory />
            </StyledBadge>
          </IconButton>
        </Tooltip>

        <Tooltip title={`Invoiced ${quantity_packed}`}>
          <IconButton size="small" aria-label="Invoiced">
            <StyledBadge badgeContent={quantity_packed} color="success" showZero>
              <Receipt />
            </StyledBadge>
          </IconButton>
        </Tooltip>
      </div>
    );
  }

  const AddressComponent = ({ address_ }) => {
    const
      {
        address = '',
        street2 = '',
        city = '',
        state = '',
        zip = '',
        country = ''
      } = address_ || {};

    return (
      <div className="fw-medium text-uppercase">
        {address && <span>{address}, </span>}
        {street2 && <span>{street2}, </span>}
        <br />
        {city && <span>{city}, </span>}
        {state && <span>{state}, </span>}
        {zip && <span>{zip}, </span>}
        {country && <span>{country}</span>}
      </div>
    );
  };

  const columnDefs = [
    {
      headerName: "Item & description",
      field: "description",
      suppressMenu: true, flex: 1,
      floatingFilterComponentParams: { suppressFilterButton: true },
    },
    {
      headerName: "Quantity",
      field: "quantity",
      suppressMenu: true, width: 100,
      floatingFilterComponentParams: { suppressFilterButton: true },
    },
    {
      headerName: "Warehouse Name",
      field: "warehouse_name",
      suppressMenu: true, flex: 1,
      floatingFilterComponentParams: { suppressFilterButton: true },
    },
    {
      headerName: "Status",
      field: "total",
      suppressMenu: true, width: 150,
      floatingFilterComponentParams: { suppressFilterButton: true },
      cellRenderer: OrderDetailsRenderer
    },
    {
      headerName: "Rate",
      field: "rate",
      suppressMenu: true, width: 120,
      floatingFilterComponentParams: { suppressFilterButton: true },
      valueFormatter: (params) =>
        formatNumberWithCommasAndDecimal(params.value),
    },
    {
      headerName: "Discount",
      field: "discount",
      suppressMenu: true, width: 120,
      floatingFilterComponentParams: { suppressFilterButton: true },
      valueFormatter: (params) =>
        formatNumberWithCommasAndDecimal(params.value),
    },
    {
      headerName: "Amount",
      field: "item_total",
      suppressMenu: true, width: 120,
      floatingFilterComponentParams: { suppressFilterButton: true },
      valueFormatter: (params) =>
        formatNumberWithCommasAndDecimal(params.value),
    },
  ];

  const onPaginationChanged = useCallback((event) => {
    // Workaround for bug in events order
    let pageSize = gridRef.current.api.paginationGetPageSize();
    setPaginationPageSize(pageSize);
  }, []);

  const processApiResponse = (response) => {
    const lineItems = response.line_items || [];

    // Extract item_total, CGST, and SGST from each line_item
    const itemTotals = lineItems.map((item) => item.item_total);
    const cgstTotals = lineItems.map((item) =>
      item.line_item_taxes
        .filter((tax) => tax.tax_name.includes("CGST"))
        .reduce((acc, tax) => acc + tax.tax_amount, 0)
    );
    const sgstTotals = lineItems.map((item) =>
      item.line_item_taxes
        .filter((tax) => tax.tax_name.includes("SGST"))
        .reduce((acc, tax) => acc + tax.tax_amount, 0)
    );

    // Calculate the total of all item_totals, CGST, and SGST
    const totalItem = itemTotals.reduce((acc, curr) => acc + curr, 0);
    const totalCGSTAmount = cgstTotals.reduce((acc, curr) => acc + curr, 0);
    const totalSGSTAmount = sgstTotals.reduce((acc, curr) => acc + curr, 0);

    // Set the totals to state
    setTotalItemTotal(totalItem);
    setTotalCGST(totalCGSTAmount);
    setTotalSGST(totalSGSTAmount);
  };

  const getOrderData = useCallback(async (body) => {
    dispatch(changePreloader(true));
    const response = await getOrderDetailsReq(body);
    if (
      response &&
      response.data &&
      response.data.line_items &&
      response.data.salesorder_number
    ) {
      console.log("Adi" + response.data.salesorder_number);
      setOrderData(response?.data);
      setLineItems(response?.data?.line_items);
      setRowCount(gridRef.current.api.getDisplayedRowCount());
      processApiResponse(response?.data);
      props.setBreadcrumbItems(
        "Order #" + response?.data?.salesorder_number,
        breadcrumbItems
      );
    }
    dispatch(changePreloader(false));
  });

  useEffect(() => {
    props.setBreadcrumbItems(
      "Order #" + orderData?.salesorder_number,
      breadcrumbItems
    );
    if (!effectCalled.current) {
      getOrderData(data);
      effectCalled.current = true;
    }
  }, [breadcrumbItems]);

  useEffect(() => {
    // props.setBreadcrumbItems("Order #"+orderData?.salesorder_number, breadcrumbItems);
    if (paginationPageSize && paginationPageSize !== undefined) {
      getOrderData(data);
    }
  }, [paginationPageSize]);

  return (
    <>
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: -50,
            right: 10,
            display: "none",
          }}
        >
          <select className="form-select focus-width" name="status">
            <option value="active">Published</option>
            <option value="draft">Draft</option>
          </select>
          <button type="submit" className="btn btn-primary w-xl mx-3">
            <Edit style={{ marginRight: "5px", fill: "white" }} />
            Edit
          </button>
        </div>
        <Col>
          <Card>
            <CardBody
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: 0
              }}
            >
              <div>
                <h1 className="secondary">Sales Order</h1>
                <h6>Sales Order #{orderData?.salesorder_number}</h6>
              </div>
              <Chip label='Draft' />
            </CardBody>
            <div className="d-flex justify-content-between align-items-center m-4">
              <OrderTrackingRenderer
                label={"Initiated"}
                date={orderData?.date}
                color={orderData?.date ? "rgb(209 247 209)" : "#D3D3D3"}
                isCheck={orderData?.date ? true : false}
              />
              <ArrowForward className="m-2" />
              <OrderTrackingRenderer
                label={"Approved"}
                date={"12-11-2023"}
                color={orderData?.date ? "rgb(209 247 209)" : "#D3D3D3"}
                isCheck={orderData?.date ? true : false}
              />
              <ArrowForward className="m-2" />
              <OrderTrackingRenderer
                label={"Proceed"}
                date={"15-11-2023"}
                color={orderData?.date ? "rgb(209 247 209)" : "#D3D3D3"}
                isCheck={orderData?.date ? true : false}
              />
              <ArrowForward className="m-2" />
              <OrderTrackingRenderer
                label={"Delivery"}
                date={"24-11-2023"}
                color={
                  orderData?.packages?.shipment_order?.delivery_date
                    ? "rgb(209 247 209)"
                    : "#D3D3D3"
                }
                isCheck={
                  orderData?.packages?.shipment_order?.delivery_date
                    ? true
                    : false
                }
              />
            </div>
          </Card>
          <Row className="d-flex align-items-stretch">
            {/* First Card */}
            <Col xs="6" className="d-flex">
              <Card className="w-100">
                <CardBody>
                  {orderData?.date &&
                    <Row>
                      <Col xs="6">
                        <span>Order Date</span>
                      </Col>
                      <Col xs="6">
                        <span>{orderData?.date}</span>
                      </Col>
                      <hr />
                    </Row>}
                  <Row>
                    <Col xs="6">
                      <span>Payment Terms</span>
                    </Col>
                    <Col xs="6">
                      <span>{orderData?.payment_terms}</span>
                    </Col>
                    <hr />
                  </Row>
                  <Row>
                    <Col xs="6">
                      <span>Delivery Method</span>
                    </Col>
                    <Col xs="6">
                      <span>{orderData?.delivery_method}</span>
                    </Col>
                    <hr />
                  </Row>
                  {orderData?.sales_channel_formatted &&
                    <Row>
                      <Col xs="6">
                        <span>PO Number</span>
                      </Col>
                      <Col xs="6">
                        <span>{orderData?.sales_channel_formatted}</span>
                      </Col>
                      <hr />
                    </Row>}
                  {orderData?.created_by_name &&
                    <Row>
                      <Col xs="6">
                        <span>Created By</span>
                      </Col>
                      <Col xs="6">
                        <span>{orderData?.created_by_name}</span>
                      </Col>
                      <hr />
                    </Row>}
                  {orderData?.custom_field_hash?.cf_acknowledgement_uploaded && <div>
                    <Row>
                      <Col xs="6">
                        <span>Acknowledgement Uploaded</span>
                      </Col>
                      <Col xs="6">
                        <span>
                          {
                            orderData?.custom_field_hash
                              ?.cf_acknowledgement_uploaded
                          }
                        </span>
                      </Col>
                      <hr />
                    </Row>
                  </div>}
                </CardBody>
              </Card>
            </Col>
            <Col xs="6" className="d-flex">
              <Card className="w-100">
                <CardBody>
                  <div className="mt-3">
                    <Row>
                      <h5 className="secondary">Billing Address</h5>
                    </Row>
                    <Row>
                      <div className="details">
                        <AddressComponent address_={orderData?.billing_address} />
                      </div>
                    </Row>
                    <Row>
                      <hr />
                      <h5 className="secondary">Shipping Address</h5>
                    </Row>
                    <Row>
                      <div className="details">
                        <AddressComponent address_={orderData?.shipping_address} />
                      </div>
                    </Row>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Card>
            <CardBody>
              <h4 className="card-title">Sales Information</h4>
              <div className="my-2" style={{ display: "flex", gap: "20px" }}>
                <div
                  className="ag-theme-quartz"
                  style={{
                    height: "200px",
                    width: "100%",
                  }}
                >
                  <AgGridReact
                    ref={gridRef}
                    suppressRowClickSelection={true}
                    columnDefs={columnDefs}
                    defaultColDef={{ resizable: false, suppressMovable: true, sortable: true }}
                    pagination={pagination}
                    paginationPageSize={paginationPageSize}
                    paginationPageSizeSelector={paginationPageSizeSelector}
                    rowSelection="multiple"
                    reactiveCustomComponents
                    autoSizeStrategy={autoSizeStrategy}
                    rowData={lineItems}
                    onPaginationChanged={onPaginationChanged}
                  ></AgGridReact>
                </div>
              </div>
              <div className="row">
                <div className="col-8"></div>
                <div className="col-4">
                  <div className="d-flex justify-content-between align-items-center gap-6 border-bottom p-2">
                    <h4 className="m-0">
                      <span>Sub Total:</span><br />
                      <span className="fw-normal h6">Total Quantity {rowCount}</span>
                    </h4>
                    <h4 className="m-0">{formatNumberWithCommasAndDecimal(totalItemTotal)}</h4>
                  </div>

                  <div className="d-flex justify-content-between align-items-center gap-6 border-bottom p-2">
                    <h4 className="m-0">CGST:</h4>
                    <h4 className="m-0">{formatNumberWithCommasAndDecimal(totalCGST)}</h4>
                  </div>

                  <div className="d-flex justify-content-between align-items-center gap-6 border-bottom p-2">
                    <h4 className="m-0">SGST:</h4>
                    <h4 className="m-0">{formatNumberWithCommasAndDecimal(totalSGST)}</h4>
                  </div>

                  <div className="d-flex justify-content-between align-items-center gap-6 border-bottom p-2">
                    <h4 className="m-0">Total:</h4>
                    <h4 className="m-0">{formatNumberWithCommasAndDecimal(Math.round((totalItemTotal + totalCGST + totalSGST) * 100) / 100)}</h4>
                  </div>

                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </div>
    </>
  );
};

export default connect(null, { setBreadcrumbItems })(OrderDetails);
