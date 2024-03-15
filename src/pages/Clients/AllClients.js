import React,{useEffect, useState, useRef,useCallback} from "react";
import { Row, Col, Card, CardBody, CardTitle, Button, Input } from "reactstrap"

import { connect } from "react-redux";

import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-quartz.css';

/*.dropdown-toggle::after {
  display: none !important; 
}*/

//Import Action to copy breadcrumb items from local state to redux state
import { setBreadcrumbItems } from "../../store/Breadcrumb/actions";
import {getCategoriesReq, getItemsReq } from "../../service/itemService";
import "./styles/datatables.scss";
import "./styles/AllClients.scss";

import plusIcon from "../../assets/images/small/plus-icon.png";
import minusIcon from "../../assets/images/small/minus-icon.png";
import ClientActionField from "./ClientActionField";

const AllClients = (props) => {
  document.title = "Clients";
  const breadcrumbItems = [
    
    { title: "Dashboard", link: "#" },
    { title: "Clients", link: "#" },
    
  ];
  const gridRef = useRef();
const columnDefs = [
    {headerName: "Name", field: "title", headerCheckboxSelection: true, checkboxSelection: true},
    {headerName: "Status", field: "status"},
    {headerName: "Primary Email", field: "email"},
    {headerName: "Type", field: "type"},
    {headerName: "GST Number", field: "gst"},
    {headerName: "Total Amount", field: "amount"},
    {headerName: "Action", field: "action",
    cellClass:"actions-button-cell",
    cellRenderer: ClientActionField
}
],
 agRowData =  [
    {name: "Byju's", type: "Business", status: 'enabled', email:"rampal@byjus.com", gst: 'IMQWE978612312578', amount: '500,600'},
    {name: "Byju's", type: "Business", status: 'enabled', email:"rampal@byjus.com", gst: 'IMQWE978612312578', amount: '500,600'},
    {name: "Byju's", type: "Business", status: 'enabled', email:"rampal@byjus.com", gst: 'IMQWE978612312578', amount: '500,600'},
    {name: "Byju's", type: "Business", status: 'enabled', email:"rampal@byjus.com", gst: 'IMQWE978612312578', amount: '500,600'},
    {name: "Byju's", type: "Business", status: 'enabled', email:"rampal@byjus.com", gst: 'IMQWE978612312578', amount: '500,600'},
];
const autoSizeStrategy = {
    type: 'fitGridWidth'
};
// enables pagination in the grid
const pagination = true;

// sets 10 rows per page (default is 100)
// allows the user to select the page size from a predefined list of page sizes
const paginationPageSizeSelector = [5, 10, 20, 50, 100];

const [allStatuses, setallStatuses] = useState([]);
const [status, setStatus] = useState("");
const [rowData, setRowData] = useState([]);
const [searchValue, setSearchValue] = useState("");
const [gridApi, setGridApi] = useState(null);
const [paginationPageSize, setPaginationPageSize ]= useState(5);
let bodyObject = {
  "page": 1,
  "limit": paginationPageSize
};
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
        "gst": "65bab211ce0f79d56447c537"
    }
}
* */
const getListOfRowData =  useCallback(async (body) => {
    const response = await getItemsReq(body);
    console.log(response);
     response.map((val,id)=>{
        val.status = val.status.name;
        val.amount = val.variant.sellingPrice;
    });
    setRowData(agRowData);
    
   
});

const getCategories = useCallback(async () => {
  const response = await getCategoriesReq();
  console.log("status"+response);
  setallStatuses(response?.payload?.categories)
 
});
useEffect(() => {
    props.setBreadcrumbItems('Clients', breadcrumbItems);
   getListOfRowData(bodyObject);
  // getCategories();
  },[]);

useEffect(() => {
  props.setBreadcrumbItems('Clients', breadcrumbItems);
  if(status && status !== undefined && status !== ""){
    let bodyObjectWithgst = {...bodyObject};
    bodyObjectWithgst.filter={};
    bodyObjectWithgst.filter.status = status;
    getListOfRowData(bodyObjectWithgst);
    }else{

    }
},[status]);

useEffect(() => {
  props.setBreadcrumbItems('Clients', breadcrumbItems);
  if(searchValue && searchValue !== undefined && searchValue !== ""){
    let bodyObjectWithgst = {...bodyObject};
    bodyObjectWithgst.search=searchValue;
    getListOfRowData(bodyObjectWithgst);
    }else{
      getListOfRowData(bodyObject);
    }
},[searchValue]);

useEffect(() => {
  props.setBreadcrumbItems('Clients', breadcrumbItems);
  if(paginationPageSize && paginationPageSize !== undefined){
    let bodyObjectWithgst = {...bodyObject};
    bodyObjectWithgst.limit=paginationPageSize;
    getListOfRowData(bodyObjectWithgst);
  }
},[paginationPageSize]);

const handleChange = (e) =>{
 console.log("handle change status"+e.target.value);
 setStatus(e.target.value);
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
        
          <Row>
            <Col className="col-12">
              <Card>
                <CardBody>
                    <div className="button-section">
                      <Button className="all-items-btn" color="primary">
                      <img src={plusIcon} style={{width: 15}}/>
                      Add New Client
                      </Button>
                      <Button color="secondary">
                      Import Customers
                      </Button>
                      <div className="button-right-section">
                      <div class="input-group">

                      <div className="search-box position-relative">
                            <Input type="text"
                              value={searchValue}
                              onChange={handleInputChange} className="form-control rounded border" placeholder="Search..." />
                            <i className="mdi mdi-magnify search-icon"></i>
                        </div>
                      {/*<input
                        className="form-control border-end-0 border"
                          placeholder="Search for..."
                          value={searchValue}
                          onChange={handleInputChange}
                        />
                          <span class="input-group-append">
                              <button class="btn btn-outline-secondary bg-white border-start-0 border ms-n5" type="button">
                                  <i class="fa fa-search"></i>
                              </button>
                        </span>*/}
                      </div>
                        <select
                          onChange={handleChange}
                          id="status"
                          name="status"
                          value={status}
                          className="form-select focus-width"
                        >
                          <option value="" selected disabled>{"Status"}</option>
                          {allStatuses.map(e => (
                            <option value={e._id}>{e.name}</option>
                          ))}
                        </select>
                  </div>
                  
                    </div>
                    <div
                            className="ag-theme-quartz"
                            style={{
                                height: '500,600px',
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
                                rowData={rowData}
                                onPaginationChanged={onPaginationChanged}>
                            </AgGridReact>
                        </div>
            </CardBody>
              </Card>
            </Col>
          </Row>
    </React.Fragment>
  )
}

export default connect(null, { setBreadcrumbItems })(AllClients);