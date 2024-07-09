import React, { useEffect, useRef, useState, useCallback } from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
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
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
    },
    {
      headerName: "Invoice Date",
      field: "date",
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
    },
    {
      headerName: "Invoice Amount",
      field: "total",
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      valueFormatter: (params) =>
        formatNumberWithCommasAndDecimal(params.value),
    },
    {
      headerName: "Payment Amount",
      field: "total",
      suppressMenu: true,
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
          <button
            type="submit"
            className="btn btn-outline-primary w-xl mx-3"
            onClick={downloadPDF}
          >
            Download PDF
          </button>
          <button type="submit" className="btn btn-primary w-xl mx-3">
            Send on Mail
          </button>
        </div>
        <Col id="payment-container">
          <Card>
            <CardBody>
              <div class="card-content">
                <div class="image-container">
                  <img
                    src={require("../../assets/images/Willsmeet-Logo.png")}
                    alt="Company Logo"
                    class="card-image"
                  />
                </div>
                <div class="details">
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
              </div>
            </CardBody>
          </Card>
          <Row className="d-flex align-items-stretch">
            {/* First Card */}
            <Col xs="9" className="d-flex">
              <Card className="w-100">
                <CardBody>
                  <div className="mt-3">
                    <Row>
                      <Col xs="6">
                        <p>Payment Date</p>
                      </Col>
                      <Col xs="6">
                        <p>{paymentData?.date}</p>
                      </Col>
                    </Row>
                  </div>
                  <div>
                    <Row>
                      <Col xs="6">
                        {" "}
                        <p>Reference Number</p>
                      </Col>
                      <Col xs="6">
                        <p>{paymentData?.reference_number}</p>
                      </Col>
                    </Row>
                  </div>
                  <div>
                    <Row>
                      <Col xs="6">
                        {" "}
                        <p>Payment Mode</p>
                      </Col>
                      <Col xs="6">
                        {" "}
                        <p>{paymentData?.payment_mode}</p>
                      </Col>
                    </Row>
                  </div>
                  <div>
                    <Row>
                      <Col xs="6">
                        {" "}
                        <p>
                          <span>Amount Received In Words</span>
                        </p>
                      </Col>
                      <Col xs="6">
                        {" "}
                        <p>
                          <span> {indianNumberWords(amountReceived)}</span>
                        </p>
                      </Col>
                    </Row>
                  </div>
                </CardBody>
              </Card>
            </Col>

            {/* Second Card */}
            <Col xs="3" className="d-flex justify-content-center">
              <Card className="w-100 justify-content-center bg-success">
                <CardBody className="text-center">
                  <div className="mt-3">
                    <Row>
                      <Col xs="12" className="text-white">
                        <p>
                          <span>
                            <h4>Amount Received</h4>
                          </span>
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs="12">
                        <p className="text-white" style={{ fontSize: "28px" }}>
                          {formatNumberWithCommasAndDecimal(amountReceived)}
                        </p>
                      </Col>
                    </Row>
                  </div>
                </CardBody>
              </Card>
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
                  // className="ag-theme-quartz"
                  style={{
                    height: "250px",
                    width: "100%",
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
