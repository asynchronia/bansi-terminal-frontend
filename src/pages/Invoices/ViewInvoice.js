import React, { useEffect, useState, useRef, useCallback } from "react";
import { Row, Col, Card, CardBody, CardTitle, Button, Input, Modal } from "reactstrap"
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-quartz.css';
import { setBreadcrumbItems } from "../../store/Breadcrumb/actions";
import { getInvoiceReq } from "../../service/invoiceService";
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
  // enables pagination in the grid
  const pagination = true;

  // sets 10 rows per page (default is 100)
  // allows the user to select the page size from a predefined list of page sizes
  // const paginationPageSizeSelector = [5, 10, 20, 50, 100];
  const paginationPageSizeSelector = [25,50,100];

 
  const [rowData, setRowData] = useState([]);
  const [responseObj, setResponseObj] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [paginationPageSize, setPaginationPageSize] = useState(25);
  const  invoiceId = "2859757000296689760";//useParams();

  let bodyObject = {
    "page": 1,
    "limit": 200
  };

  const getListOfRowData =  useCallback(async (body) => {
    console.log("WHY is invoice id undefined"+invoiceId);
    const responseObj = await getInvoiceReq(body, invoiceId);
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
    setRowData(rowData);
    
   
});

const getAddress = (flag='shipping') =>{
    const addr = flag === 'shipping' ? responseObj.shipping_address: responseObj.billing_address;
    const type = flag === 'shipping' ?' Shipping Address': 'Billing Address';
    return(<>
        <p>{type}<br/>
        {addr.attention}<br/>
        {addr.street}<br/>
        {addr.street2}<br/>
        {addr.address}<br/>
        {addr.city +":"+ addr.zip + ", " + addr.state+", "+addr.country}</p>
    </>);

}
 
const getInvoiceInfo = () =>{
    let dateObj = new Date(responseObj.salesorders.date);
    let fields = responseObj.custom_fields;
    let poNoVal, poDate;
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
            <tr>
                <td className="label-col td-style">{"PO No"}</td><td className="td-style">{poNoVal}</td>
            </tr>
            <tr>
                <td className="label-col td-style">{"PO Date"}</td><td className="td-style">{poDate.toDateString()}</td>
            </tr>
        </table>
        </>
    );
}

const getTermsSection = () =>{
    var textArr = responseObj.terms.split(/\r?\n/);

    return(<>
            <p>{"Note : "}</p>
            <p>{responseObj.notes}</p>
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
        <Row></Row>
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
                        {responseObj && getAddress('billing')}
                        <br/>
                        {responseObj && getAddress('shipping')}
                    </CardBody>
            </Card>
            </Col>
        </Row>
      </div>
    </React.Fragment>
  )
}

export default connect(null, { setBreadcrumbItems })(ViewInvoice);