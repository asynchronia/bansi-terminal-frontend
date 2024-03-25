import React,{useEffect, useState, useRef,useCallback} from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, CardBody, Input, Modal } from "reactstrap"

import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-quartz.css';


//Import Action to copy breadcrumb items from local state to redux state
import { setBreadcrumbItems } from "../../store/Breadcrumb/actions";
import {getPaymentReq} from "../../service/invoiceService"
import "./styles/datatables.scss";
import "./styles/AllInvoices.scss";

const AllPayments = (props) => {
  document.title = "Payments";
  let navigate = useNavigate(); 
  const effectCalled = useRef(false);
  const redirectToCreateItem = () =>{ 
    let path = "/create-item"; 
    navigate(path);
  }

  const redirectToEditPage = (id) =>{
    let path = "/edit-item"; 
     setTimeout(() => {
      navigate(path, id);
     }, 300); 
      
  }
  const notify = (type, message) => {
    if (type === "Error") {
      toast.error(message, {
        position: "top-center",
        theme: "colored",
      })
    } else {
      toast.success(message, {
        position: "top-center",
        theme: "colored",
      })
    }
  }
  const breadcrumbItems = [
    
    { title: "Dashboard", link: "#" },
    { title: "Payments", link: "#" },
    
  ];
  const gridRef = useRef();
  const handleDeleteResponse = (response) =>{
    if (response.success === true) {
      notify("Success", response.message);
    } else {
      notify("Error", response.message);
    }
    setmodal_standard(false);
    getListOfRowData();
  } 
  const handleEditClick = (id) =>{
    console.log("GRID OBJECT >>>"+id);
    redirectToEditPage(id);
  }

const columnDefs = [
    {headerName: "Invoice Date", field: "date", headerCheckboxSelection: true, checkboxSelection: true,
     cellRenderer: (props)=>{
        console.log("created on props"+props.data);
        let date= new Date(props.value);
        return <>{date.toDateString()}</>
      }},
    {headerName: "Payment#", field: "payment_number"},
    {headerName: "Type", field: "payment_type"},
    {headerName: "Client", field: "customer_name"},
    {headerName: "Invoice#", field: "invoice_numbers"},
    {headerName: "Payment Mode", field: "payment_mode"},
    {headerName: "Amount Paid", field: "amount"} 
]
const autoSizeStrategy = {
    type: 'fitGridWidth'
};
// enables pagination in the grid
const pagination = true;

// sets 10 rows per page (default is 100)
// allows the user to select the page size from a predefined list of page sizes
const paginationPageSizeSelector = [5, 10, 20, 50, 100];

const [allCustomers, setAllCustomers] = useState([]);
const [customer, setCustomer] = useState("");
const [rowData, setRowData] = useState([]);
const [searchValue, setSearchValue] = useState("");
const [paginationPageSize, setPaginationPageSize ]= useState(5);
const [currRowItem, setCurrRowItem] = useState(null);
const [modal_standard, setmodal_standard] = useState(false)

let bodyObject = {
  "page": 1,
  "limit": 200
};

const agrowdata= [
  {
      "payment_id": "2859757000291745387",
      "payment_number": "BLR-CP-7054",
      "retainerinvoice_id": "",
      "invoice_numbers": "BLR-08549,BLR-08550,BLR-08551",
      "date": "2024-03-20",
      "payment_mode": "Bank Transfer",
      "payment_mode_formatted": "Bank Transfer",
      "amount": 86321,
      "bcy_amount": 86321,
      "unused_amount": 0.06,
      "bcy_unused_amount": 0.06,
      "account_id": "2859757000002161315",
      "account_name": "HDFC -59299900002537",
      "description": "",
      "product_description": "",
      "reference_number": "000196226732",
      "branch_id": "2859757000000128107",
      "branch_name": "HSR",
      "customer_id": "2859757000234672071",
      "customer_name": "Tomillo Technologies Pvt. Ltd.",
      "created_time": "2024-03-20T11:18:55+0530",
      "last_modified_time": "2024-03-20T11:18:55+0530",
      "last_four_digits": "",
      "gateway_transaction_id": "",
      "payment_gateway": "",
      "bcy_refunded_amount": 0,
      "applied_invoices": [],
      "is_advance_payment": false,
      "has_attachment": false,
      "documents": "",
      "custom_fields_list": "",
      "tax_account_id": "",
      "tax_account_name": "",
      "tax_amount_withheld": 0,
      "payment_type": "Invoice Payment",
      "settlement_status": ""
  }
]

const [bodyObjectReq, setBodyObjectReq] = useState(bodyObject);
const  tog_standard = () => {
  setmodal_standard(!modal_standard)
  removeBodyCss()
}
function removeBodyCss() {
  document.body.classList.add("no_padding")
}
const onPaginationChanged = useCallback((event) => {
  // Workaround for bug in events order
 let pageSize=  gridRef.current.api.paginationGetPageSize();
 setPaginationPageSize(pageSize);
  
}, []);
const getListOfRowData =  useCallback(async (body) => {
    const response = await getPaymentReq(body);
    console.log(response);
    let custList = new Set();
     response.map((val,id)=>{
      console.log("CUSTOMER "+val.customer_name);
      custList.add(val.customer_name);
    });
    let custArr = [];
    {custList?.forEach((val,key,set) => {
      console.log("CUSTOMER "+val);
       custArr.push(val);
     })}
    setAllCustomers([...custArr]);
    setRowData(response);
    setBodyObjectReq(body);
});


useEffect(() => {
    props.setBreadcrumbItems('Payments', breadcrumbItems);
    if (!effectCalled.current) {
      getListOfRowData(bodyObject);
      effectCalled.current=true;
    }
  },[]);

useEffect(() => {
  props.setBreadcrumbItems('Payments', breadcrumbItems);
  if(customer && customer !== undefined && customer !== ""){
        let bodyObjectWithFilter = {...bodyObjectReq};
        bodyObjectWithFilter.filter={};
        bodyObjectWithFilter.filter.customer_name = customer;
        getListOfRowData(bodyObjectWithFilter);
    }else{
        let bodyObjectWithFilter = {...bodyObjectReq};
        delete bodyObjectWithFilter["filter"];
        getListOfRowData(bodyObjectWithFilter);
    }
},[customer]);

useEffect(() => {
  props.setBreadcrumbItems('Payments', breadcrumbItems);
  if(searchValue && searchValue !== undefined && searchValue !== ""){
    let bodyObjectWithSearch = {...bodyObject};
    bodyObjectWithSearch.search=searchValue;
    getListOfRowData(bodyObjectWithSearch);
    }else{
      getListOfRowData(bodyObject);
    }
},[searchValue]);

useEffect(() => {
  props.setBreadcrumbItems('Payments', breadcrumbItems);
  if(paginationPageSize && paginationPageSize !== undefined){
    getListOfRowData(bodyObject);
  }
},[paginationPageSize]);

const handleChange = (e) =>{
 setCustomer(e.target.value);
}
const handleInputChange = (e) =>{
  setSearchValue(e.target.value);
 }

  return (
    <React.Fragment>
       <ToastContainer position="top-center" theme="colored" />
       <Modal
                      isOpen={modal_standard}
                      toggle={() => {
                        tog_standard()
                      }}
                    >
                      <div className="modal-header">
                        <h5 className="modal-title mt-0" id="myModalLabel">
                          Confirm
                            </h5>
                        <button
                          type="button"
                          onClick={() => {
                            setmodal_standard(false)
                          }}
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <h5>Are you sure you want to delete {currRowItem?.title} ? </h5>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          onClick={() => {
                            setmodal_standard(false);
                          }}
                          className="btn btn-secondary waves-effect"
                          data-dismiss="modal"
                        >
                          Close
                            </button>
                        <button
                          type="button"
                          className="btn btn-primary waves-effect waves-light"
                          onClick={() => {
                           // deleteItem(currRowItem)
                          }}
                        >
                          Delete
                            </button>
                      </div>
                    </Modal>
        <div className="all-invoices">
          <Row>
            <Col className="col-12">
              <Card>
                <CardBody>
                    <div className="button-section">
                        
                      <div className="button-right-section">
                      <div className="invoice-search-box">
                        <div className="search-box position-relative">
                              <Input type="text"
                                value={searchValue}
                                onChange={handleInputChange} className="form-control rounded border" placeholder="Search..." />
                              <i className="mdi mdi-magnify search-icon"></i>
                          </div>
                      </div>
                        <select
                          onChange={handleChange}
                          id="customer"
                          name="customer"
                          value={customer}
                          className="form-select focus-width"
                        >
                          <option value="" selected>Select Client</option>
                          {allCustomers.map(e => (
                            <option value={e}>{e}</option>
                          ))}
                        </select>
                  </div>
                  
                    </div>
                    <div
                            className="ag-theme-quartz"
                            style={{
                                height: '500px',
                                width: '100%'
                            }}
                        >
                            <AgGridReact
                                ref={gridRef}
                                rowHeight={60}
                                suppressRowClickSelection={true}
                                columnDefs={columnDefs}
                                pagination={pagination}
                                paginationPageSize={paginationPageSize}
                                paginationPageSizeSelector={paginationPageSizeSelector}
                                rowSelection="multiple"
                                reactiveCustomComponents
                                autoSizeStrategy={autoSizeStrategy}
                                rowData={rowData}
                                onPaginationChanged={onPaginationChanged}>
                            </AgGridReact>
                        </div>
            </CardBody>
              </Card>
            </Col>
          </Row>
          </div>
    </React.Fragment>
  )
}

export default connect(null, { setBreadcrumbItems })(AllPayments);