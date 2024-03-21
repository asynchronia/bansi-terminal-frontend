import React,{useEffect, useState, useRef,useCallback} from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, CardBody, CardTitle, Button, Input, Modal } from "reactstrap"

import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-quartz.css';

/*.dropdown-toggle::after {
  display: none !important; 
}*/

//Import Action to copy breadcrumb items from local state to redux state
import { setBreadcrumbItems } from "../../store/Breadcrumb/actions";
import {getInvoicesReq } from "../../service/invoiceService";
import "./styles/datatables.scss";
import "./styles/AllInvoices.scss";
import InvoiceActionBtn from "./InvoiceActionBtn";
import { getDateInFormat, getDifferenceInDays, ifOverDue } from "./invoiceUtil";

const AllInvoices = (props) => {
  document.title = "Invoices";
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
    { title: "Invoices", link: "#" },
    
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
    {headerName: "Invoice No.", field: "invoice_number"},
    {headerName: "Order No.", field: "reference_number"},
    {headerName: "Client", field: "customer_name"},
    {headerName: "Status", field: "status", width:200,
     cellRenderer: (props)=>{
        console.log("created on props"+props.data);
        let due_date= new Date(props.data.due_date);
        
        let curr_date = new Date();
        let status_msg = "";
        let statusClass = "status-msg ";
        if(ifOverDue(curr_date, due_date)){
          let days= getDifferenceInDays(curr_date, due_date);
          status_msg = "Overdue by "+days+" day(s)";
          statusClass = statusClass + "red";
        }else{
          let days= getDifferenceInDays(curr_date, due_date);
          console.log("Pending days"+days);
          days>0 ? status_msg = "Pending in "+days+" day(s)" : status_msg="";
          console.log("Pending days status"+status_msg);
          statusClass = statusClass + "green";
        }
        return <><p className="status-field">{getDateInFormat(due_date)}</p><p className={statusClass}>{status_msg}</p> </>
      }},
    {headerName: "Total Amount", field: "total", sortable: false},
    {headerName: "Amount Due", field: "balance"},
    {headerName: "", field: "action", sortable: false,
    cellClass:"actions-button-cell",
    cellRenderer: InvoiceActionBtn
  } 
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
const [gridApi, setGridApi] = useState(null);
const [paginationPageSize, setPaginationPageSize ]= useState(5);
const [currRowItem, setCurrRowItem] = useState(null);
const [modal_standard, setmodal_standard] = useState(false)

let bodyObject = {
  "page": 1,
  "limit": paginationPageSize
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
  console.log('onPaginationPageLoaded', event);
  // Workaround for bug in events order
 let pageSize=  gridRef.current.api.paginationGetPageSize();
 console.log("PAGE SIZE"+pageSize);
 setPaginationPageSize(pageSize);
  
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
        "category": "65bab211ce0f79d56447c537"
    }
}
* */
const getListOfRowData =  useCallback(async (body) => {
    const response = await getInvoicesReq(body);
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
    props.setBreadcrumbItems('Invoices', breadcrumbItems);
    if (!effectCalled.current) {
      getListOfRowData(bodyObject);
      effectCalled.current=true;
    }
  },[]);

useEffect(() => {
  props.setBreadcrumbItems('Invoices', breadcrumbItems);
  if(customer && customer !== undefined && customer !== ""){
        let bodyObjectWithCategory = {...bodyObjectReq};
        bodyObjectWithCategory.filter={};
        bodyObjectWithCategory.filter.customer_name = customer;
        getListOfRowData(bodyObjectWithCategory);
    }else{
        let bodyObjectWithCategory = {...bodyObjectReq};
        delete bodyObjectWithCategory["filter"];
        getListOfRowData(bodyObjectWithCategory);
    }
},[customer]);

useEffect(() => {
  props.setBreadcrumbItems('Invoices', breadcrumbItems);
  if(searchValue && searchValue !== undefined && searchValue !== ""){
    let bodyObjectWithCategory = {...bodyObject};
    bodyObjectWithCategory.search=searchValue;
    getListOfRowData(bodyObjectWithCategory);
    }else{
      getListOfRowData(bodyObject);
    }
},[searchValue]);

useEffect(() => {
  props.setBreadcrumbItems('Invoices', breadcrumbItems);
  if(paginationPageSize && paginationPageSize !== undefined){
    let bodyObjectWithCategory = {...bodyObject};
    bodyObjectWithCategory.limit=paginationPageSize;
    getListOfRowData(bodyObjectWithCategory);
  }
},[paginationPageSize]);

const handleChange = (e) =>{
 console.log("handle change category"+e.target.value);
 setCustomer(e.target.value);
}
const handleInputChange = (e) =>{
  console.log("handle search"+e.target.value);
  setSearchValue(e.target.value);
 }

/*
const onGridReady = useCallback((params) => {
  setGridApi(e.api);
    createItemReq
      .then((resp) => resp.json())
      .then((data) => {
        // add id to data
        var idSequence = 1;
        data.forEach(function (item) {
          item.id = idSequence++;
        });
        // setup the fake server with entire dataset
        var fakeServer = new FakeServer(data);
        // create datasource with a reference to the fake server
        var datasource = getItemsReq(fakeServer);
        // register the datasource with the grid
        params.api.setGridOption('serverSideDatasource', datasource);
      });
  }, []);
*/
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

export default connect(null, { setBreadcrumbItems })(AllInvoices);