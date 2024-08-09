import React, { useEffect, useRef, useState, useCallback } from "react";
import { Row, Col, Card, CardBody, Table } from "reactstrap";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { connect, useDispatch } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import { ToastContainer } from "react-toastify";
import generatePDF, { Resolution, Margin, Options } from "react-to-pdf";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "./styles/PaymentDetailsCard.scss";
import { getPaymentDetailsReq } from "../../service/invoiceService";
import {
  indianNumberWords,
  formatNumberWithCommasAndDecimal,
} from "./invoiceUtil";

import { changePreloader } from "../../store/actions";
import Hero from "../../components/Common/Hero";

const options: Options = {
  filename: "payment.pdf",
  method: "save",
  // default is Resolution.MEDIUM = 3, which should be enough, higher values
  // increases the image quality but also the size of the PDF, so be careful
  // using values higher than 10 when having multiple pages generated, it
  // might cause the page to crash or hang.
  resolution: Resolution.MEDIUM,
  page: {
    // margin is in MM, default is Margin.NONE = 0
    margin: Margin.MEDIUM,
    // default is 'A4'
    format: "A4",
    // default is 'portrait'
    orientation: "portrait",
  },
  canvas: {
    // default is 'image/jpeg' for better size performance
    mimeType: "image/jpeg",
    qualityRatio: 1,
  },
  // Customize any value passed to the jsPDF instance and html2canvas
  // function. You probably will not need this and things can break,
  // so use with caution.
  overrides: {
    // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
    pdf: {
      compress: true,
    },
    // see https://html2canvas.hertzen.com/configuration for more options
    canvas: {
      useCORS: true,
    },
  },
};

const PaymentDetails = (props) => {
  const { id } = useParams();
  const [paymentData, setPaymentData] = useState();
  const [amountReceived, setAmountReceived] = useState(0);
  const effectCalled = useRef(false);
  const gridRef = useRef();
  let dispatch = useDispatch();
  const data = id;
  //Handles BreadCrumbs
  const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Payment", link: "/payments" },
    // { title: "View Payment", link: "#" },
    { title: "Payment #" + paymentData?.payment_number, link: "#" },

  ];

  const autoSizeStrategy = {
    type: "fitGridWidth",
  };

  const pagination = false;

  // sets 10 rows per page (default is 100)
  // allows the user to select the page size from a predefined list of page sizes
  const paginationPageSizeSelector = [5, 10, 25, 50];
  const [paginationPageSize, setPaginationPageSize] = useState(5);

  const columnDefs = [
    {
      headerName: "Invoice No.",
      field: "invoice_number",
      suppressMenu: true, flex: 1,
      floatingFilterComponentParams: { suppressFilterButton: true },
    },
    {
      headerName: "Invoice Date",
      field: "date",
      suppressMenu: true, flex: 1,
      floatingFilterComponentParams: { suppressFilterButton: true },
    },
    {
      headerName: "Invoice Amount",
      field: "total",
      suppressMenu: true, flex: 1,
      floatingFilterComponentParams: { suppressFilterButton: true },
      valueFormatter: (params) =>
        formatNumberWithCommasAndDecimal(params.value),
    },
    {
      headerName: "Payment Amount",
      field: "total",
      suppressMenu: true, flex: 1,
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

  const getPaymentData = useCallback(async (body) => {
    dispatch(changePreloader(true));
    const response = await getPaymentDetailsReq(body);
    setPaymentData(response);
    props.setBreadcrumbItems(response?.payment_number, breadcrumbItems);
    if (response) {
      let totalInvoicesAmount = 0;
      let totalBalanceAmount = 0;
      for (const invoice of response.invoices) {
        totalInvoicesAmount += invoice?.total || 0;
        totalBalanceAmount += invoice?.balance || 0;
      }
      const amountReceived = totalInvoicesAmount - totalBalanceAmount;
      setAmountReceived(amountReceived);
    }
    dispatch(changePreloader(false));
  });

  useEffect(() => {
    props.setBreadcrumbItems(paymentData?.payment_number, breadcrumbItems);
    if (!effectCalled.current) {
      getPaymentData(data);
      effectCalled.current = true;
    }
  }, [breadcrumbItems]);

  useEffect(() => {
    props.setBreadcrumbItems(paymentData?.payment_number, breadcrumbItems);
    if (paginationPageSize && paginationPageSize !== undefined) {
      getPaymentData(data);
    }
  }, [paginationPageSize]);

  const getTargetElement = () => document.getElementById("payment-container");

  const downloadPDF = () => generatePDF(getTargetElement, options);
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
          <button type="submit" className="btn btn-outline-primary w-xl" onClick={downloadPDF}>Download PDF</button>
          <button type="submit" className="btn btn-primary w-xl mx-3 d-none">Send on Mail</button>
        </div>
        <Col id="payment-container">
          <Card>
            <CardBody>
              <div className="card-content">
                <Hero />
              </div>
            </CardBody>
          </Card>
          <Row className="d-flex align-items-stretch">
            {/* First Card */}
            <Col xs="9">
              <Card className="w-100">
                <CardBody>
                  <Table>
                    <tbody>
                      <tr>
                        <td>Payment Date</td>
                        <td>{paymentData?.date}</td>
                      </tr>
                      <tr>
                        <td>Reference Number</td>
                        <td>{paymentData?.reference_number}</td>
                      </tr>
                      <tr>
                        <td>Payment Mode</td>
                        <td>{paymentData?.payment_mode}</td>
                      </tr>
                      <tr>
                        <td>Amount Received In Words</td>
                        <td>{indianNumberWords(amountReceived)}</td>
                      </tr>
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>

            {/* Second Card */}
            <Col xs="3" className="col-3 justify-content-center bg-success card">
              <CardBody className="d-flex align-items-center">
                <div className="mt-3">
                  <Row>
                    <Col xs="12" className="text-white">
                      <h4>Amount Received</h4>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="12">
                      <p className="text-white" style={{ fontSize: "24px", fontWeight: 'bold' }}>
                        {formatNumberWithCommasAndDecimal(amountReceived)}
                      </p>
                    </Col>
                  </Row>
                </div>
              </CardBody>
            </Col>
          </Row>

          <Card>
            <CardBody>
              <div className="card-content d-flex justify-content-between">
                <div>
                  <h4>Bill To:</h4>
                  <div>
                    <br />
                    {paymentData?.customer_name}
                    {/* <br/>Opus 143, 1st Cross, 5th Block, Koramangala<br/>
          Bangalore<br/>
          560034 Karnataka<br/>
          India<br/>
          Pan - AADCN1803G<br/> */}
                  </div>
                </div>
                <div className="d-flex flex-column align-items-end">
                  <img
                    src={require("../../assets/images/Willsmeet-Logo.png")}
                    alt="Authorized Signatory"
                    style={{ maxHeight: "125px", maxWidth: "125px" }}
                  />
                  <p className="mb-0">Authorized Signatory</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h4 className="card-title">Payment For</h4>
              <div className="mt-2" style={{ display: "flex", gap: "20px" }}>
                <div
                  className="ag-theme-quartz"
                  style={{ width: "100%" }}
                >
                  <AgGridReact
                    ref={gridRef}
                    domLayout="autoHeight"
                    suppressRowClickSelection={true}
                    defaultColDef={{ resizable: false, suppressMovable: true }}
                    columnDefs={columnDefs}
                    pagination={pagination}
                    paginationPageSize={paginationPageSize}
                    paginationPageSizeSelector={paginationPageSizeSelector}
                    reactiveCustomComponents
                    autoSizeStrategy={autoSizeStrategy}
                    rowData={paymentData?.invoices}
                    onPaginationChanged={onPaginationChanged}
                  ></AgGridReact>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </div>
    </>
  );
};

export default connect(null, { setBreadcrumbItems })(PaymentDetails);
