import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
  Input,
  Modal,
} from "reactstrap";
import { connect, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { setBreadcrumbItems } from "../../store/Breadcrumb/actions";
import { getInvoiceReq } from "../../service/invoiceService";
import { ToastContainer } from "react-toastify";
import {
  indianNumberWords,
  formatNumberWithCommasAndDecimal,
  formatCamelCase
} from "./invoiceUtil";
import generatePDF, { Resolution, Margin, Options } from "react-to-pdf";
import "./styles/datatables.scss";
import "./styles/ViewInvoice.scss";

import { changePreloader } from "../../store/actions";
import Hero from "../../components/Common/Hero";

const options: Options = {
  filename: "invoice.pdf",
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
const ViewInvoice = (props) => {
  document.title = "Invoice Details";
  const breadcrumbItems = [
    { title: "Dashboard", link: "#" },
    { title: "Invoices", link: "/invoices" },
  ];
  const gridRef = useRef();
  const effectCalled = useRef(false);
  let dispatch = useDispatch();

  const columnDefs = [
    {
      headerName: "Description",
      field: "description",
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
    },
    {
      headerName: "Unit",
      field: "unit",
      sortable: false,
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
    },
    {
      headerName: "HSN/SAC",
      field: "hsn_or_sac",
      sortable: false,
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
    },
    {
      headerName: "Qty",
      field: "quantity",
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
    },
    {
      headerName: "Rate",
      field: "rate",
      sortable: false,
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      valueFormatter: (params) =>
        formatNumberWithCommasAndDecimal(params.value),
    },
    {
      headerName: "CGST%",
      field: "cgst",
      sortable: false,
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
    },
    {
      headerName: "Tax Amt",
      field: "cgst_tax",
      sortable: false,
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      valueFormatter: (params) =>
        formatNumberWithCommasAndDecimal(params.value),
    },
    {
      headerName: "SGST%",
      field: "sgst",
      sortable: false,
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
    },
    {
      headerName: "Tax Amt",
      field: "sgst_tax",
      sortable: false,
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      valueFormatter: (params) =>
        formatNumberWithCommasAndDecimal(params.value),
    },
    {
      headerName: "Amount",
      field: "item_total",
      sortable: false,
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      valueFormatter: (params) =>
        formatNumberWithCommasAndDecimal(params.value),
    },
  ];
  const autoSizeStrategy = {
    type: "fitGridWidth",
  };

  const [rowData, setRowData] = useState([]);
  const [responseObj, setResponseObj] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const invoiceId = useParams();

  let bodyObject = {
    page: 1,
    limit: 200,
  };
  const getTargetElement = () => document.getElementById("invoice-container");
  const downloadPDF = () => generatePDF(getTargetElement, options);
  const getListOfRowData = useCallback(async (body) => {
    dispatch(changePreloader(true));
    const responseObj = await getInvoiceReq(body, invoiceId.id);
    console.log(responseObj);
    let rowData = [];
    let resp = responseObj?.line_items;
    resp.map((val) => {
      let obj = { ...val };
      val.line_item_taxes.map((item) => {
        if (item.tax_name.indexOf("SGST") != -1) {
          let s = item.tax_name.split(" ")[1];
          obj.sgst = s.substring(1, s.lastIndexOf(")"));
          obj.sgst_tax = item.tax_amount;
        } else if (item.tax_name.indexOf("CGST") != -1) {
          let s = item.tax_name.split(" ")[1];
          obj.cgst = s.substring(1, s.lastIndexOf(")"));
          obj.cgst_tax = item.tax_amount;
        }
      });
      rowData.push(obj);
    });
    setResponseObj(responseObj);
    breadcrumbItems.push({ title: responseObj.invoice_number, link: "#" });
    props.setBreadcrumbItems(
      "INVOICE " + responseObj.invoice_number,
      breadcrumbItems
    );
    setRowData(rowData);

    dispatch(changePreloader(false));
  });

  const getAddress = (flag = "shipping") => {
    const addr =
      flag === "shipping"
        ? responseObj.shipping_address
        : responseObj.billing_address;
    const type = flag === "shipping" ? " Shipping Address" : "Billing Address";
    const street1 = addr.street !== "" ? addr.street : "";

    return (
      <>
        <p>
          <b>{type}</b>
          <br />
          {addr.attention ? (
            <>
              {addr.attention}
              <br />
            </>
          ) : null}
          {street1 ? (
            <>
              {addr.street}
              <br />
            </>
          ) : null}
          {addr.street2 ? (
            <>
              {addr.street2}
              <br />
            </>
          ) : null}
          {addr.address}
          <br />
          {addr.city + ", " + addr.zip + ", " + addr.state + ", " + addr.country}
        </p>
      </>
    );
  };

  const getInvoiceInfo = () => {
    let dateObj = new Date(responseObj.salesorders.date);
    let fields = responseObj.custom_fields;
    let poNoVal = undefined,
      poDate = undefined;
    fields.map((val) => {
      if (val.label === "PO No") {
        poNoVal = val.value_formatted;
      }
      if (val.label === "PO Date") {
        poDate = new Date(val.value);
      }
    });
    return (
      <>
        <table className="table table-bordered w-100">
          <tbody>
            <tr>
              <th>Invoice Date</th>
              <td>{dateObj.toDateString()}</td>
            </tr>
            <tr>
              <th>Order ID</th>
              <td>{responseObj.salesorder_number}</td>
            </tr>
            <tr>
              <th>Place of supply</th>
              <td>{responseObj.place_of_supply}</td>
            </tr>
            {poNoVal !== undefined ? (
              <tr>
                <td>{"PO No"}</td>
                <td>{poNoVal}</td>
              </tr>
            ) : null}
            {poDate !== undefined ? (
              <tr>
                <td>{"PO Date"}</td>
                <td>{poDate.toDateString()}</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </>
    );
  };

  const getInvoiceFinalDetails = () => {
    let cgst = "",
      sgst = "";
    responseObj.taxes.map((val) => {
      if (val.tax_name.indexOf("CGST") !== -1) {
        cgst = val.tax_amount_formatted;
      } else if (val.tax_name.indexOf("SGST") !== -1) {
        sgst = val.tax_amount_formatted;
      }
    });
    return (
      <>
        <table className="table table-bordered w-100">
          <tbody>
            <tr>
              <th>{"Sub Total"}</th>
              <td>
                {formatNumberWithCommasAndDecimal(responseObj.sub_total)}
              </td>
            </tr>
            <tr>
              <th>{"Taxable Amount"}</th>
              <td>
                {formatNumberWithCommasAndDecimal(responseObj.tax_total)}
              </td>
            </tr>
            <tr>
              <th>{"CGST"}</th>
              <td>{cgst}</td>
            </tr>
            <tr>
              <th>{"SGST"}</th>
              <td>{sgst}</td>
            </tr>
          </tbody>
        </table>
      </>
    );
  };

  const getTermsSection = () => {
    var textArr = responseObj.terms.split(/\r?\n/);
    var amountText = formatCamelCase(indianNumberWords(responseObj.sub_total));

    return (
      <>
        <p>
          <b>{"Total in words"}</b>
        </p>
        <p>
          {"Indian Rupee " +
            amountText.charAt(0).toUpperCase() +
            amountText.slice(1)}
        </p>
        <p>
          {"Note : "}
          <br />
          {responseObj.notes}
        </p>
        <p>
          <p>{"Terms & Conditions : "}</p>
          {textArr.map((v) => (
            <p>{v}</p>
          ))}
        </p>
      </>
    );
  };
  useEffect(() => {
    props.setBreadcrumbItems("Invoices", breadcrumbItems);
    if (!effectCalled.current) {
      getListOfRowData(bodyObject);
      effectCalled.current = true;
    }
  }, []);

  /*
  {
      "page": 1,
      "limit": 10,
      "search": "p",
      "sort": {
          "key": "createdAt",
          "order": "asc"
      },
      "filter": {
          "gst": "65bab211ce0f79d56447c537"
      }
  }
  * */

  const getInvoiceTable = () => {
    return (<>
      <h5>{"Invoice Information"}</h5>
      <div className="inv-table-div">
        <table className="invoice-sub-table">
          <tbody className="inv-tbody">
            <tr className="invoice-tr-hdr">
              {columnDefs.map(ele => <th>{ele.headerName}</th>)}
            </tr>
            {rowData.map(ele =>
              <tr className="invoice-tr">
                <td>{ele.description}</td>
                <td>{ele.unit}</td>
                <td>{ele.hsn_or_sac}</td>
                <td>{ele.quantity}</td>
                <td>{formatNumberWithCommasAndDecimal(ele.rate)}</td>
                <td>{ele.cgst}</td>
                <td>{formatNumberWithCommasAndDecimal(ele.cgst_tax)}</td>
                <td>{ele.sgst}</td>
                <td>{formatNumberWithCommasAndDecimal(ele.sgst_tax)}</td>
                <td>{formatNumberWithCommasAndDecimal(ele.item_total)}</td>
              </tr>)}</tbody>
        </table>
      </div>
    </>);
  }
  return (
    <React.Fragment>
      <div className="view-invoice" id="view-invoice">
        <div
          style={{
            position: "absolute",
            top: -50,
            right: 0,
            display: "flex",
          }}
        >
          {responseObj && (
            <button
              type="submit"
              className="btn btn-outline-primary w-xl"
              onClick={downloadPDF}
            >
              Download PDF
            </button>
          )}
          <button type="submit" className="btn btn-primary w-xl mx-3 d-none">
            Send on Mail
          </button>
        </div>

        <Card>
          <CardBody>
            <div className="card-content">
              <Hero />
              <div className="invoice-details-rhs">
                {"TAX INVOICE"}
                <br />
                {responseObj ? "INVOICE " + responseObj.invoice_number : ""}
              </div>
            </div>

          </CardBody>
        </Card>
        <div id="invoice-container">
          <Row>
            <Col>
              <Card className="col-style">
                <CardBody>{responseObj && getInvoiceInfo()}</CardBody>
              </Card>
            </Col>
            <Col>
              <Card className="col-style">
                <CardBody>
                  {responseObj && getAddress("billing")}
                  <br />
                  {responseObj && getAddress("shipping")}
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col className="col-12">
              <Card>
                <CardBody>
                  <div
                    className="ag-theme-quartz"
                    style={{
                      height: "320px",
                      width: "100%",
                    }}
                  >
                    {getInvoiceTable()}
                    {/*} <AgGridReact
                          ref={gridRef}
                          rowHeight={60}
                          suppressRowClickSelection={true}
                          columnDefs={columnDefs}
                          pagination={false}
                          rowSelection="multiple"
                          reactiveCustomComponents
                          autoSizeStrategy={autoSizeStrategy}
                          onGridReady={(event) => event.api.sizeColumnsToFit()}
                          rowData={rowData}
                      ></AgGridReact>*/}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card className="col-style">
                <CardBody>{responseObj && getTermsSection()}</CardBody>
              </Card>
            </Col>
            <Col>
              <Card className="col-style">
                <CardBody>
                  {responseObj && getInvoiceFinalDetails()}
                  <div className="text-center">
                    <img
                      src={require("../../assets/images/bansi-seal.png")}
                      alt="Company Seal"
                      className="card-image-seal"
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default connect(null, { setBreadcrumbItems })(ViewInvoice);
