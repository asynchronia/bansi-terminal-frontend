import React, { useEffect, useState, useRef, useCallback } from "react";
import { Row, Col, Card, CardBody, CardTitle, Button, Input, Modal } from "reactstrap"
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { setBreadcrumbItems } from "../../store/Breadcrumb/actions";
import { ToastContainer } from "react-toastify";
import { indianNumberWords, formatNumberWithCommasAndDecimal } from "../Invoices/invoiceUtil";
import GenericPdfDownloader from "../../utility/GenericPdfDownloader";
import "./styles/datatables.scss";
import "./styles/ViewEstimate.scss";
import { getEstimateReq } from "../../service/orderService";
import Hero from "../../components/Common/Hero";
const ViewEstimate = (props) => {
  document.title = "Estimate Details";
  const breadcrumbItems = [

    { title: "Dashboard", link: "/dashboard" },
    { title: "Estimates", link: "/estimates" },

  ];
  const gridRef = useRef();
  const effectCalled = useRef(false);


  const columnDefs = [
    {
      headerName: "Description", field: "description", suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true }
    },
    {
      headerName: "Unit", field: "unit", sortable: false, suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true }
    },
    {
      headerName: "HSN/SAC", field: "hsn_or_sac", sortable: false, suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true }
    },
    {
      headerName: "Qty", field: "quantity", suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true }
    },
    {
      headerName: "Rate", field: "rate", sortable: false, suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      valueFormatter: params => formatNumberWithCommasAndDecimal(params.value)
    },
    {
      headerName: "CGST%", field: "cgst", sortable: false, suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true }
    },
    {
      headerName: "Tax Amt", field: "cgst_tax", sortable: false, suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      valueFormatter: params => formatNumberWithCommasAndDecimal(params.value)
    },
    {
      headerName: "SGST%", field: "sgst", sortable: false, suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true }
    },
    {
      headerName: "Tax Amt", field: "sgst_tax", sortable: false, suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      valueFormatter: params => formatNumberWithCommasAndDecimal(params.value)
    },
    {
      headerName: "Amount", field: "item_total", sortable: false, suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      valueFormatter: params => formatNumberWithCommasAndDecimal(params.value)
    }
  ]
  const autoSizeStrategy = {
    type: 'fitGridWidth'
  };


  const [rowData, setRowData] = useState([]);
  const [responseObj, setResponseObj] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const estimateId = useParams();

  let bodyObject = {
    "page": 1,
    "limit": 200
  };

  const getListOfRowData = useCallback(async (body) => {
    const response = await getEstimateReq(body, estimateId.id);
    const responseObj = response.data;
    let rowData = [];
    let resp = responseObj?.line_items;
    resp.map(val => {
      let obj = { ...val };
      val.line_item_taxes.map(item => {
        if (item.tax_name.indexOf("SGST") != -1) {
          let s = item.tax_name.split(" ")[1];
          obj.sgst = s.substring(1, s.lastIndexOf(')'));
          obj.sgst_tax = item.tax_amount;
        } else if (item.tax_name.indexOf("CGST") != -1) {
          let s = item.tax_name.split(" ")[1];
          obj.cgst = s.substring(1, s.lastIndexOf(')'));
          obj.cgst_tax = item.tax_amount;
        }
      });
      rowData.push(obj);

    });
    setResponseObj(responseObj);
    breadcrumbItems.push({ title: responseObj.estimate_number, link: "#" });
    props.setBreadcrumbItems("Estimate " + responseObj.estimate_number, breadcrumbItems);
    setRowData(rowData);


  });

  const getAddress = (flag = 'shipping') => {
    const addr = flag === 'shipping' ? responseObj.shipping_address : responseObj.billing_address;
    const type = flag === 'shipping' ? ' Shipping Address' : 'Billing Address';
    const street1 = addr.street !== "" ? addr.street : "";
    return (<>
      <p>{type}<br />
        {addr.attention ? <>{addr.attention}
          <br /></> : null}
        {street1 ? <>{addr.street}
          <br /></> : null}
        {addr.street2 ? <>{addr.street2}
          <br /></> : null}
        {addr.address}<br />
        {addr.city + ":" + addr.zip + ", " + addr.state + ", " + addr.country}</p>
    </>);

  }

  const getEstimateInfo = () => {
    let dateObj = new Date(responseObj.date);

    return (
      <>
        <table className="estimate-table">
          <tr >
            <td className="label-col td-style">{"Estimate Date"}</td><td className="td-style">{dateObj.toDateString()}</td>
          </tr>
          <tr>
            <td className="label-col td-style">{"Estimate No"}</td><td className="td-style">{responseObj.estimate_number}</td>
          </tr>
        </table>
      </>
    );
  }

  const getEstimateFinalDetails = () => {
    let cgst = "", sgst = "";
    responseObj.taxes.map(val => {
      if (val.tax_name.indexOf("CGST") !== -1) {
        cgst = val.tax_amount_formatted;
      } else if (val.tax_name.indexOf("SGST") !== -1) {
        sgst = val.tax_amount_formatted;
      }

    });
    return (
      <>
        <table className="estimate-table">
          <tr >
            <td className="label-col td-style">{"Sub Total"}</td><td className="td-style">{formatNumberWithCommasAndDecimal(responseObj.sub_total)}</td>
          </tr>
          <tr>
            <td className="label-col td-style">{"Taxable Amount"}</td><td className="td-style">{formatNumberWithCommasAndDecimal(responseObj.tax_total)}</td>
          </tr>
          <tr>
            <td className="label-col td-style">{"CGST"}</td><td className="td-style">{cgst}</td>
          </tr>
          <tr>
            <td className="label-col td-style">{"SGST"}</td><td className="td-style">{sgst}</td>
          </tr>
          <tr>
            <td className="label-col td-style">{"TOTAL"}</td><td className="td-style">{formatNumberWithCommasAndDecimal(responseObj.total)}</td>
          </tr>
        </table>
      </>
    );
  }

  const getTermsSection = () => {
    var textArr = responseObj.terms.split(/\r?\n/);
    var amountText = indianNumberWords(responseObj.sub_total);

    return (<>
      <p><b>{"Total in words"}</b></p>
      <p>{"Indian Rupee " + amountText.charAt(0).toUpperCase() + amountText.slice(1)}</p>
      <p>{"Note : "}<br />
        {responseObj.notes}</p>
      <p>
        <p>{"Terms & Conditions : "}</p>
        {textArr.map(v => <p>{v}</p>)}
      </p>
    </>)
  }
  useEffect(() => {
    props.setBreadcrumbItems('Estimates', breadcrumbItems);
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

  return (
    <React.Fragment>
      <div className="view-estimate" id="view-estimate">
        <div
          style={{
            position: "absolute",
            top: -50,
            right: 10,
            display: "flex",
          }}
        >
          {responseObj && <GenericPdfDownloader
            downloadFileName={"view-estimate-" + responseObj.estimate_id}
            rootElementId="view-estimate"
          />}
          {/* <button type="submit" className="btn btn-primary w-xl mx-3">
            Send on Mail
          </button> */}
        </div>
        <Row>
          <Col>
            <Card>
              <CardBody>
                <div className="card-content">
                  <Hero />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col >
            <Card className="col-style">
              <CardBody>
                {responseObj && getEstimateInfo()}
              </CardBody>
            </Card>
          </Col>
          <Col >
            <Card className="col-style">
              <CardBody>
                {responseObj && getAddress('billing')}
                <br />
                {responseObj && getAddress('shipping')}
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
                    height: '300px',
                    width: '100%'
                  }}
                >
                  <AgGridReact
                    ref={gridRef}
                    rowHeight={60}
                    suppressRowClickSelection={true}
                    columnDefs={columnDefs}
                    pagination={false}
                    rowSelection="multiple"
                    reactiveCustomComponents
                    autoSizeStrategy={autoSizeStrategy}
                    onGridReady={(event) => event.api.sizeColumnsToFit()}
                    rowData={rowData}>
                  </AgGridReact>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col >
            <Card className="col-style">
              <CardBody>
                {responseObj && getTermsSection()}
              </CardBody>
            </Card>
          </Col>
          <Col >
            <Card className="col-style">
              <CardBody>

                {responseObj && getEstimateFinalDetails()}
                <div className="image-container-seal">
                  <img src={require('../../assets/images/bansi-seal.png')} alt="Company Seal" className="card-image-seal" />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  )
}

export default connect(null, { setBreadcrumbItems })(ViewEstimate);