import React, { useEffect, useState, useRef, useCallback } from "react";
import { Row, Col, Card, CardBody, CardTitle, Button, Input, Modal } from "reactstrap"
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-quartz.css';
import { setBreadcrumbItems } from "../../store/Breadcrumb/actions";
import { getInvoiceReq } from "../../service/invoiceService";
import { ToastContainer } from "react-toastify";
import {indianNumberWords,formatNumberWithCommasAndDecimal} from "./invoiceUtil";
import "./styles/datatables.scss";
import "./styles/ViewInvoice.scss";
const ViewInvoice = (props) => {
  document.title = "Invoice Details";
  const breadcrumbItems = [

    { title: "Dashboard", link: "#" },
    { title: "Invoice", link: "#" },

  ];
  const gridRef = useRef();
  const effectCalled = useRef(false);


  const columnDefs = [
    { headerName: "Description", field: "description",suppressMenu: true,
    floatingFilterComponentParams: {suppressFilterButton:true}},
    { headerName: "Unit", field: "unit", sortable: false ,suppressMenu: true,
    floatingFilterComponentParams: {suppressFilterButton:true}},
    { headerName: "HSN/SAC", field: "hsn_or_sac", sortable: false ,suppressMenu: true,
    floatingFilterComponentParams: {suppressFilterButton:true} },
    { headerName: "Qty", field: "quantity" ,suppressMenu: true,
    floatingFilterComponentParams: {suppressFilterButton:true}},
    { headerName: "Rate", field: "rate", sortable: false,suppressMenu: true,
    floatingFilterComponentParams: {suppressFilterButton:true} },
    { headerName: "CGST%", field: "cgst", sortable: false,suppressMenu: true,
    floatingFilterComponentParams: {suppressFilterButton:true}},
    { headerName: "Tax Amt", field: "cgst_tax", sortable: false,suppressMenu: true,
    floatingFilterComponentParams: {suppressFilterButton:true} } ,
    { headerName: "SGST%", field: "sgst", sortable: false,suppressMenu: true,
    floatingFilterComponentParams: {suppressFilterButton:true} },
    { headerName: "Tax Amt", field: "sgst_tax", sortable: false,suppressMenu: true,
    floatingFilterComponentParams: {suppressFilterButton:true} },
    { headerName: "Amount", field: "item_total", sortable: false,suppressMenu: true,
    floatingFilterComponentParams: {suppressFilterButton:true} }
  ]
  const autoSizeStrategy = {
    type: 'fitGridWidth'
  };

 
  const [rowData, setRowData] = useState([]);
  const [responseObj, setResponseObj] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const  invoiceId = useParams();

  let bodyObject = {
    "page": 1,
    "limit": 200
  };

  const getListOfRowData =  useCallback(async (body) => {
    console.log("WHY is invoice id undefined"+invoiceId.id);
    const responseObj = await getInvoiceReq(body, invoiceId.id);
    console.log(responseObj);
    let rowData = [];
    let resp = responseObj?.line_items;
    resp.map(val => {
        let obj = {...val};
        val.line_item_taxes.map( item => {
             if(item.tax_name.indexOf("SGST") != -1){
                let s = item.tax_name.split(" ")[1];
                obj.sgst = s.substring(1,s.lastIndexOf(')'));
                obj.sgst_tax = item.tax_amount;
             }else if(item.tax_name.indexOf("CGST") != -1){
                let s = item.tax_name.split(" ")[1];
                obj.cgst = s.substring(1,s.lastIndexOf(')'));
                obj.cgst_tax = item.tax_amount;
             }
    });
    rowData.push(obj);
       
    });
    setResponseObj(responseObj);
    breadcrumbItems.push({ title: responseObj.invoice_number, link: "#" });
    props.setBreadcrumbItems("INVOICE "+responseObj.invoice_number, breadcrumbItems);
    setRowData(rowData);
    
   
});

const getAddress = (flag='shipping') =>{
    const addr = flag === 'shipping' ? responseObj.shipping_address: responseObj.billing_address;
    const type = flag === 'shipping' ?' Shipping Address': 'Billing Address';
    const street1 = addr.street !== "" ? addr.street : "";
    return(<>
        <p>{type}<br/>
        {addr.attention ? <>{addr.attention}
        <br/></>: null}
        {street1 ? <>{addr.street}
        <br/></>: null}
        {addr.street2 ? <>{addr.street2}
        <br/></>: null}
        {addr.address}<br/>
        {addr.city +":"+ addr.zip + ", " + addr.state+", "+addr.country}</p>
    </>);

}
 
const getInvoiceInfo = () =>{
    let dateObj = new Date(responseObj.salesorders.date);
    let fields = responseObj.custom_fields;
    let poNoVal = undefined, poDate = undefined;
    fields.map(val => {
        if(val.label === 'PO No') {
          poNoVal =  val.value_formatted
        }
        if(val.label === 'PO Date'){
            poDate = new Date(val.value);
        }
    });
    return(
        <>
        <table className="invoice-table">
            <tr >
                <td className="label-col td-style">{"Invoice Date"}</td><td className="td-style">{dateObj.toDateString()}</td>
            </tr>
            <tr>
                <td className="label-col td-style">{"Order ID"}</td><td className="td-style">{responseObj.salesorder_number}</td>
            </tr>
            <tr>
                <td className="label-col td-style">{"Place of supply"}</td><td className="td-style">{responseObj.place_of_supply}</td>
            </tr>
            {poNoVal !== undefined ? <tr>
                <td className="label-col td-style">{"PO No"}</td><td className="td-style">{poNoVal}</td>
            </tr> : null}
            {poDate !== undefined ? <tr>
                <td className="label-col td-style">{"PO Date"}</td><td className="td-style">{poDate.toDateString()}</td>
            </tr>:null}
        </table>
        </>
    );
}

const getInvoiceFinalDetails = () =>{
   let cgst = "", sgst = "";
   responseObj.taxes.map(val =>{
    if(val.tax_name.indexOf("CGST") !== -1){
        cgst = val.tax_amount_formatted;
    }else if(val.tax_name.indexOf("SGST") !== -1){
        sgst = val.tax_amount_formatted;
    }

   });
    return(
        <>
        <table className="invoice-table">
            <tr >
                <td className="label-col td-style">{"Sub Total"}</td><td className="td-style">{responseObj.sub_total}</td>
            </tr>
            <tr>
                <td className="label-col td-style">{"Taxable Amount"}</td><td className="td-style">{responseObj.tax_total}</td>
            </tr>
            <tr>
                <td className="label-col td-style">{"CGST"}</td><td className="td-style">{cgst}</td>
            </tr>
            <tr>
                <td className="label-col td-style">{"SGST"}</td><td className="td-style">{sgst}</td>
            </tr>
            
        </table>
        </>
    );
}

const getTermsSection = () =>{
    var textArr = responseObj.terms.split(/\r?\n/);
    var amountText = indianNumberWords(responseObj.sub_total);
    
    return(<>
            <p><b>{"Total in words"}</b></p>
            <p>{"Indian Rupee "+ amountText.charAt(0).toUpperCase() + amountText.slice(1)}</p>
            <p>{"Note : "}<br/>
            {responseObj.notes}</p>
            <p>
                <p>{"Terms & Conditions : "}</p>
                {textArr.map(v=> <p>{v}</p>)}
            </p>
    </>)
}
  useEffect(() => {
    props.setBreadcrumbItems('Invoices', breadcrumbItems);
    if (!effectCalled.current) {
      getListOfRowData(bodyObject);
      effectCalled.current=true;
    }
  },[]);


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
      <div className="view-invoice">
      <ToastContainer position="top-center" theme="colored" />
      <div
          style={{
            position: "absolute",
            top: -50,
            right: 10,
            display: "flex",
          }}
        >
          <button type="submit" className="btn btn-outline-primary w-xl mx-3">
            Download PDF
          </button>
          <button type="submit" className="btn btn-primary w-xl mx-3">
            Send on Mail
          </button>
          </div>
          <Row>
        <Col>
          <Card>
            <CardBody>
              <div class="card-content">
                <div class="image-container">
                  <img src={require('../../assets/images/Willsmeet-Logo.png')} alt="Company Logo" class="card-image"/>
                </div>
                <div class="details">
                    <h3>
                      <br/><span>Bansi Office Solutions Private Limited</span>
                    </h3>
                    #1496, 19th Main Road, Opp Park Square Apartment, HSR Layout, Bangalore Karnataka 560102, India
                    <br/>GSTIN: 29AAJCB1807A1Z3 CIN:U74999KA2020PTC137142<br/>
                    MSME No : UDYAM-KR-03-0065095<br/>
                    Web: www.willsmeet.com, Email:sales@willsmeet.com<br/>
                  
                </div>
              </div>
            </CardBody>
          </Card>
          </Col>
          </Row>
        <Row>
            <Col >
                <Card className="col-style">
                    <CardBody>
                        {responseObj && getInvoiceInfo()}
                    </CardBody>
                </Card>
            </Col>
            <Col >
            <Card className="col-style">
                    <CardBody>
                        {responseObj && getAddress('billing')}
                        <br/>
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
                        
                        {responseObj && getInvoiceFinalDetails()}
                        <div class="image-container-seal">
                        <img src={require('../../assets/images/bansi-seal.png')} alt="Company Seal" class="card-image-seal"/>
                        </div>
                    </CardBody>
            </Card>
            </Col>
        </Row>
      </div>
    </React.Fragment>
  )
}

export default connect(null, { setBreadcrumbItems })(ViewInvoice);