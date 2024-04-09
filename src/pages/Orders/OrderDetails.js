import React, { useEffect, useRef, useState,useCallback} from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
} from "reactstrap";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import { ToastContainer } from "react-toastify";

import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-quartz.css';
import { getOrderDetailsReq } from "../../service/orderService";
import OrderTrackingRenderer from "./OrderTrackingRenderer";
import { formatNumberWithCommasAndDecimal } from "../Invoices/invoiceUtil";

const OrderDetails = (props) => {
  const { id } = useParams();
  const [orderData, setOrderData] = useState();
  const [lineItems ,setLineItems] = useState(0);
  const [rowCount, setRowCount] = useState(0);
  const effectCalled = useRef(false);
  const gridRef = useRef();
  const [totalItemTotal, setTotalItemTotal] = useState(0);
  const [totalCGST, setTotalCGST] = useState(0);
  const [totalSGST, setTotalSGST] = useState(0);
  const data = id ;
  //Handles BreadCrumbs
  const breadcrumbItems = [
      { title: "Dashboard", link: "/dashboard" },
      { title: "Sales Order", link: "#" },
      // { title: "Order #"+orderData?.salesorder_number, link: "#" },
    ];
  
    const autoSizeStrategy = {
      type: 'fitGridWidth'
    };

    const pagination = false;

    // sets 10 rows per page (default is 100)
    // allows the user to select the page size from a predefined list of page sizes
    const paginationPageSizeSelector = [5, 10, 25, 50];
    const [paginationPageSize, setPaginationPageSize ]= useState(5);
  
    function OrderDetailsRenderer(params) {
      const { data } = params;
      const { quantity_shipped, quantity_packed, quantity_invoiced } = data;
    
      // Combine the quantities into a single string
      const combinedQuantity = `Shipped ${quantity_shipped} \n Packed ${quantity_packed} \n Invoiced ${quantity_invoiced}`;
    
      // Return the combined quantity as the cell value
      return combinedQuantity;
    }

    const columnDefs = [
      {headerName: "Item & description", field: "description",suppressMenu: true,
      floatingFilterComponentParams: {suppressFilterButton:true}},
      {headerName: "Ordered", field: "item_order",suppressMenu: true,
      floatingFilterComponentParams: {suppressFilterButton:true}},
      {headerName: "Warehouse Name", field: "warehouse_name",suppressMenu: true,
      floatingFilterComponentParams: {suppressFilterButton:true}},
      {headerName: "Status", field: "total",suppressMenu: true,
      floatingFilterComponentParams: {suppressFilterButton:true}
      ,cellRenderer: OrderDetailsRenderer,
      },
      {headerName: "Rate", field: "rate",suppressMenu: true,
      floatingFilterComponentParams: {suppressFilterButton:true},},
      {headerName: "Discount", field: "discount",suppressMenu: true,
      floatingFilterComponentParams: {suppressFilterButton:true},
      valueFormatter: params => formatNumberWithCommasAndDecimal(params.value)
    },
      {headerName: "Amount", field: "item_total",suppressMenu: true,
      floatingFilterComponentParams: {suppressFilterButton:true},
      valueFormatter: params => formatNumberWithCommasAndDecimal(params.value)
    },
    ]
    
    const onPaginationChanged = useCallback((event) => {
      // Workaround for bug in events order
     let pageSize =  gridRef.current.api.paginationGetPageSize();
     setPaginationPageSize(pageSize)
    }, []);

    const processApiResponse = (response) => {
      const lineItems = response.line_items || [];
  
    // Extract item_total, CGST, and SGST from each line_item
    const itemTotals = lineItems.map(item => item.item_total);
    const cgstTotals = lineItems.map(item => item.line_item_taxes.filter(tax => tax.tax_name.includes('CGST')).reduce((acc, tax) => acc + tax.tax_amount, 0));
    const sgstTotals = lineItems.map(item => item.line_item_taxes.filter(tax => tax.tax_name.includes('SGST')).reduce((acc, tax) => acc + tax.tax_amount, 0));

    // Calculate the total of all item_totals, CGST, and SGST
    const totalItem = itemTotals.reduce((acc, curr) => acc + curr, 0);
    const totalCGSTAmount = cgstTotals.reduce((acc, curr) => acc + curr, 0);
    const totalSGSTAmount = sgstTotals.reduce((acc, curr) => acc + curr, 0);

    // Set the totals to state
    setTotalItemTotal(totalItem);
    setTotalCGST(totalCGSTAmount);
    setTotalSGST(totalSGSTAmount);
    };

    const getOrderData =  useCallback(async (body) => {
      const response = await getOrderDetailsReq(body);
      setOrderData(response?.data);
      setLineItems(response?.data?.line_items);
      setRowCount(gridRef.current.api.getDisplayedRowCount());
      processApiResponse(response?.data);
      props.setBreadcrumbItems("Order #"+response?.data?.salesorder_number, breadcrumbItems);
  });

    useEffect(() => {
      props.setBreadcrumbItems("Order #"+orderData?.salesorder_number, breadcrumbItems);
      if (!effectCalled.current) {
        getOrderData(data);
        effectCalled.current=true;
      }
    },[]); 

    useEffect(() => {
      // props.setBreadcrumbItems("Order #"+orderData?.salesorder_number, breadcrumbItems);
      if(paginationPageSize && paginationPageSize !== undefined){
        getOrderData(data);
      }
    },[paginationPageSize]);
    

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
            <option value="active">Published</option>
            <option value="draft">Draft</option>
          </select>
          <button type="submit" className="btn btn-primary w-xl mx-3">
            Edit
          </button>
          </div>
        <Col>
          <Card>
          <CardBody style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="secondary">Sales Order</h1>
            <h6>Sales Order #{orderData?.salesorder_number}</h6>
          </div>
          <button type="submit" className="btn btn-primary w-md mr-3">
            Draft
          </button>
        </CardBody>
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-evenly', margin: '5px 40px 30px 30px' }}>
          <OrderTrackingRenderer label={'Initiated'} date={orderData?.date} color={orderData?.date ? 'rgb(209 247 209)' : '#D3D3D3'}  isCheck={orderData?.date ? true : false}  />
          <div style={{margin: '7px', marginLeft: '-15px', fontSize: '25px'}}>---</div>
          <OrderTrackingRenderer label={'Approved'} date={'12-11-2023'} color={orderData?.date ? 'rgb(209 247 209)' : '#D3D3D3'}  isCheck={orderData?.date ? true : false}  />
          <div style={{margin: '7px', marginLeft: '-15px', fontSize: '25px'}}>---</div>
          <OrderTrackingRenderer label={'Proceed'} date={'15-11-2023'} color={orderData?.date ? 'rgb(209 247 209)' : '#D3D3D3'}  isCheck={orderData?.date ? true : false}  />
          <div style={{margin: '7px', marginLeft: '-15px', fontSize: '25px'}}>---</div>
          <OrderTrackingRenderer label={'Delivery'} date={'24-11-2023'} color={orderData?.packages?.shipment_order?.delivery_date  ? 'rgb(209 247 209)' : '#D3D3D3'}  isCheck={orderData?.packages?.shipment_order?.delivery_date ? true : false}  />
        </div>
          </Card>
          <Row className="d-flex align-items-stretch">
                {/* First Card */}
                <Col xs="6" className="d-flex">
                    <Card className="w-100">
                    <CardBody>
                        <div className="mt-3">
                        <Row>
                            <Col xs="6">
                            <p>Order Date</p>
                            </Col>
                            <Col xs="6">
                            <p>{orderData?.date}</p>
                            </Col>
                        </Row>
                        </div>
                        <div>
                    <Row>
                      <Col xs="6">
                        {" "}
                        <p>Payment Terms</p>
                      </Col>
                      <Col xs="6">
                        <p>{orderData?.payment_terms}</p>
                      </Col>
                    </Row>
                  </div>
                  <div>
                    <Row>
                      <Col xs="6">
                        {" "}
                        <p>Delivery Method</p>
                      </Col>
                      <Col xs="6">
                        {" "}
                        <p>{orderData?.delivery_method}</p>
                      </Col>
                    </Row>
                  </div>
                  <div>
                    <Row>
                      <Col xs="6">
                        {" "}
                        <p><span>PO Number</span></p>
                      </Col>
                      <Col xs="6">
                        {" "}
                        <p>{orderData?.sales_channel_formatted}</p>
                      </Col>
                    </Row>
                  </div>
                  <div>
                    <Row>
                      <Col xs="6">
                        {" "}
                        <p><span>Created By</span></p>
                      </Col>
                      <Col xs="6">
                        {" "}
                        <p>{orderData?.created_by_name}</p>
                      </Col>
                    </Row>
                  </div>
                  <div>
                    <Row>
                      <Col xs="6">
                        {" "}
                        <p><span>Acknowledgement Uploaded</span></p>
                      </Col>
                      <Col xs="6">
                        {" "}
                        <p>{orderData?.custom_field_hash?.cf_acknowledgement_uploaded}</p>
                      </Col>
                    </Row>
                  </div>
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
                        {orderData?.billing_address?.address && <>{orderData.billing_address.address}<br/></>}
                        {orderData?.billing_address?.street2 && <>{orderData.billing_address.street2}<br/></>}
                        {orderData?.billing_address?.city && <>{orderData.billing_address.city}<br/></>}
                        {orderData?.billing_address?.state && <>{orderData.billing_address.state}<br/></>}
                        {orderData?.billing_address?.zip && <>{orderData.billing_address.zip}<br/></>}
                        {orderData?.billing_address?.country && <>{orderData.billing_address.country}<br/></>}
                        <br/>
                        </div>
                        </Row>
                        <Row>
                            <hr/>
                            <h5 className="secondary">Shipping Address</h5>
                        </Row>
                        <Row>
                        <div className="details">
                        {orderData?.shipping_address?.address && <>{orderData.shipping_address.address}<br/></>}
                        {orderData?.shipping_address?.street2 && <>{orderData.shipping_address.street2}<br/></>}
                        {orderData?.shipping_address?.city && <>{orderData.shipping_address.city}<br/></>}
                        {orderData?.shipping_address?.state && <>{orderData.shipping_address.state}<br/></>}
                        {orderData?.shipping_address?.zip && <>{orderData.shipping_address.zip}<br/></>}
                        {orderData?.shipping_address?.country && <>{orderData.shipping_address.country}<br/></>}
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
                <div className="mt-2" style={{ display: "flex", gap: "20px" }}>
                <div
                              className="ag-theme-quartz"
                              style={{
                                  height: '250px',
                                  width: '100%'
                              }}
                          >
                              <AgGridReact
                                  ref={gridRef}
                                  suppressRowClickSelection={true}
                                  columnDefs={columnDefs}
                                  pagination={pagination}
                                  paginationPageSize={paginationPageSize}
                                  paginationPageSizeSelector={paginationPageSizeSelector}
                                  rowSelection="multiple"
                                  reactiveCustomComponents
                                  autoSizeStrategy={autoSizeStrategy}
                                  rowData={lineItems}
                                  onPaginationChanged={onPaginationChanged}>
                              </AgGridReact>
                          </div>
                </div>
                <div className="content-above-table" style={{ textAlign: "right", marginRight: "15.3em" }}>
                <div className="details ">
                <h4 className="secondary" style={{fontSize: '15px', fontWeight: 'bold', margin: '20px -12px'}}>Sub Total : <h4 style={{fontSize: '15px', margin: '-18px -95px'}}>{formatNumberWithCommasAndDecimal(totalItemTotal)}</h4></h4>
                <p className="secondary" style={{margin: '-20px -32px'}}>Total Quantity {rowCount}</p>
                <br/>
                <h4 className="secondary" style={{fontSize: '15px', margin: '20px 18px'}}>CGST : <h4 style={{fontSize: '15px', margin: '-18px -125px'}}>{formatNumberWithCommasAndDecimal(totalCGST)}</h4></h4>
                <br />
                <h4 className="secondary" style={{fontSize: '15px', margin: '10px 21px'}}>SGST : <h4 style={{fontSize: '15px', margin: '-18px -128px'}}>{formatNumberWithCommasAndDecimal(totalSGST)}</h4></h4>
                <br />
                <hr style={{width: '117%'}} />
                <h4 className="secondary" style={{fontSize: '15px', fontWeight: 'bold', margin: '20px 21px'}}>Total : <h4 style={{fontSize: '15px', margin: '-18px -128px'}}>₹ {Math.round((totalItemTotal+totalCGST+totalSGST) * 100) / 100}</h4></h4>
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
