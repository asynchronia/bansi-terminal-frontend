import React,{useEffect, useState, useRef,useCallback} from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, CardBody, Input, Modal } from "reactstrap"
import { changePreloader } from "../../store/actions";

import DropdownMenuBtn from "./DropdownMenuBtn";
import { connect, useDispatch } from "react-redux";
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
  let dispatch= useDispatch();
  const effectCalled = useRef(false);

  const redirectToViewPage = (id) =>{
    let path = `/payment/${id.payment_id}`; 
     setTimeout(() => {
      navigate(path,id);
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
  const handleViewClick = (data) =>{
    redirectToViewPage(data);
  }

const columnDefs = [
    {headerName: "Invoice Date", field: "date", headerCheckboxSelection: true, checkboxSelection: true,
     cellRenderer: (props)=>{
        let date= new Date(props.value);
        return <>{date.toDateString()}</>
     },suppressMenu: true,
      floatingFilterComponentParams: {suppressFilterButton:true}},
    {headerName: "Payment#", field: "payment_number",suppressMenu: true,
    floatingFilterComponentParams: {suppressFilterButton:true}},
    {headerName: "Type", field: "payment_type",suppressMenu: true,
    floatingFilterComponentParams: {suppressFilterButton:true}},
    {headerName: "Client", field: "customer_name",suppressMenu: true,
    floatingFilterComponentParams: {suppressFilterButton:true}},
    {headerName: "Invoice#", field: "invoice_numbers",suppressMenu: true,
    floatingFilterComponentParams: {suppressFilterButton:true}},
    {headerName: "Payment Mode", field: "payment_mode",suppressMenu: true,
    floatingFilterComponentParams: {suppressFilterButton:true}},
    {headerName: "Amount Paid", field: "amount",suppressMenu: true,
    floatingFilterComponentParams: {suppressFilterButton:true}},
    {headerName: "Action", field: "action",sortable:false,
    suppressMenu: true, floatingFilterComponentParams: {suppressFilterButton:true},
    cellClass:"actions-button-cell",
    cellRenderer: DropdownMenuBtn,
    cellRendererParams: {
      handleViewClick: handleViewClick
    }
  }
       
]
const autoSizeStrategy = {
    type: 'fitGridWidth'
};
// enables pagination in the grid
const pagination = true;

// sets 10 rows per page (default is 100)
// allows the user to select the page size from a predefined list of page sizes
const paginationPageSizeSelector = [25, 50, 100];

const [allCustomers, setAllCustomers] = useState([]);
const [customer, setCustomer] = useState("");
const [rowData, setRowData] = useState([]);
const [searchValue, setSearchValue] = useState("");
const [paginationPageSize, setPaginationPageSize ]= useState(25);
const [currRowItem, setCurrRowItem] = useState(null);
const [modal_standard, setmodal_standard] = useState(false)

let bodyObject = {
  "page": 1,
  "limit": 200
};

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
    dispatch(changePreloader(true));
    const response = await getPaymentReq(body);
    let custList = new Set();
     response.map((val,id)=>{
      custList.add(val.customer_name);
    });
    let custArr = [];
    custList?.forEach((val,key,set) => {
       custArr.push(val);
     })
    setAllCustomers([...custArr]);
    setRowData(response);
    setBodyObjectReq(body);
    dispatch(changePreloader(false));
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