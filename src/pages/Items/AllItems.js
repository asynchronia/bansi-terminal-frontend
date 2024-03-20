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
import {getCategoriesReq, getItemsReq , deletItemReq} from "../../service/itemService";
import "./styles/datatables.scss";
import "./styles/AllItems.scss";
import DropdownMenuBtn from "./DropdownMenuBtn";

const AllItems = (props) => {
  document.title = "All Items";
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
    { title: "All Items Order", link: "#" },
    
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
  const deleteItem = async(data) => {
    try {
      const response = await deletItemReq({"_id":data._id});
      if (response.success === true) {
       handleDeleteResponse(response);
      } else {
        handleDeleteResponse(response);
      }
    } catch (error) {
      console.log("ERROR  "+error);
      handleDeleteResponse(error);
    }
  }
  const onDeleteItem = (data) =>{
    setCurrRowItem(data);
    setmodal_standard(true);
  }

const columnDefs = [
    {headerName: "Item Name", field: "title", headerCheckboxSelection: true, checkboxSelection: true},
    {headerName: "Type", field: "itemType"},
    {headerName: "HSN Code", field: "hsnCode"},
    {headerName: "Status", field: "status"},
    {headerName: "Sale Price", field: "salePrice", sortable: false},
    {headerName: "Created On", field: "createdAt", cellRenderer: (props)=>{
      console.log("created on props"+props.data);
      let date= new Date(props.value);
      return <>{date.toDateString()}</>
    }},
    {headerName: "Category", field: "category"},
    {headerName: "Action", field: "action",sortable:false,
    cellClass:"actions-button-cell",
    cellRenderer: DropdownMenuBtn,
    cellRendererParams: {
      deleteItem: onDeleteItem,
      handleResponse: handleDeleteResponse,
      handleEditClick: handleEditClick
    }
  }
],
 agRowData =  [
    {itemName: "Byju's", type: "Variable", status: 'published', hsnCode:"ABU-123888", category: 'electronics', salePrice: '500', gst: '18%', created: '13 march 2010'},
    {itemName: "Byju's", type: "Variable", status: 'published', hsnCode:"ABU-123888", category: 'electronics', salePrice: '500', gst: '18%', created: '13 march 2010'},
    {itemName: "Byju's", type: "Variable", status: 'published', hsnCode:"ABU-123888", category: 'electronics', salePrice: '500', gst: '18%', created: '13 march 2010'},
    {itemName: "Byju's", type: "Variable", status: 'published', hsnCode:"ABU-123888", category: 'electronics', salePrice: '500', gst: '18%', created: '13 march 2010'},
    {itemName: "Byju's", type: "Variable", status: 'published', hsnCode:"ABU-123888", category: 'electronics', salePrice: '500', gst: '18%', created: '13 march 2010'},
];
const autoSizeStrategy = {
    type: 'fitGridWidth'
};
// enables pagination in the grid
const pagination = true;

// sets 10 rows per page (default is 100)
// allows the user to select the page size from a predefined list of page sizes
const paginationPageSizeSelector = [5, 10, 20, 50, 100];

const [allCategories, setAllCategories] = useState([]);
const [category, setCategory] = useState("");
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
    const response = await getItemsReq(body);
    console.log(response);
     response.map((val,id)=>{
        val.category = val.category.name;
        val.salePrice = val.variant.sellingPrice;
    });
    setRowData(response);
    setBodyObjectReq(body);
   
});

const getCategories = useCallback(async () => {
  const response = await getCategoriesReq();
  console.log("CATEGORY"+response);
  setAllCategories(response?.payload?.categories)
 
});


useEffect(() => {
    props.setBreadcrumbItems('All Items', breadcrumbItems);
    if (!effectCalled.current) {
      getListOfRowData(bodyObject);
      getCategories();
      effectCalled.current=true;
    }
  },[]);

useEffect(() => {
  props.setBreadcrumbItems('All Items', breadcrumbItems);
  if(category && category !== undefined && category !== ""){
    let bodyObjectWithCategory = {...bodyObject};
        bodyObjectWithCategory.filter={};
        bodyObjectWithCategory.filter.category = category;
        getListOfRowData(bodyObjectWithCategory);
    }else{
       
          let bodyObjectWithCategory = {...bodyObjectReq};
          delete bodyObjectWithCategory["filter"];
          getListOfRowData(bodyObjectWithCategory);
    }
},[category]);

useEffect(() => {
  props.setBreadcrumbItems('All Items', breadcrumbItems);
  if(searchValue && searchValue !== undefined && searchValue !== ""){
    let bodyObjectWithCategory = {...bodyObject};
    bodyObjectWithCategory.search=searchValue;
    getListOfRowData(bodyObjectWithCategory);
    }else{
      getListOfRowData(bodyObject);
    }
},[searchValue]);

useEffect(() => {
  props.setBreadcrumbItems('All Items', breadcrumbItems);
  if(paginationPageSize && paginationPageSize !== undefined){
    let bodyObjectWithCategory = {...bodyObject};
    bodyObjectWithCategory.limit=paginationPageSize;
    getListOfRowData(bodyObjectWithCategory);
  }
},[paginationPageSize]);

const handleChange = (e) =>{
 console.log("handle change category"+e.target.value);
 setCategory(e.target.value);
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
                            deleteItem(currRowItem)
                          }}
                        >
                          Delete
                            </button>
                      </div>
                    </Modal>
        <div className="all-items">
          <Row>
            <Col className="col-12">
              <Card>
                <CardBody>
                    <div className="button-section">
                      <Button className="all-items-btn" color="primary" onClick={redirectToCreateItem}>
                      Create Item
                      </Button>
                      <Button color="secondary">
                      Import Items
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
                          id="category"
                          name="category"
                          value={category}
                          defaultValue="none"
                          className="form-select focus-width"
                          showClearButton={true}
                        >
                          <option value="" selected>Select Category</option>
                          {allCategories.map(e => (
                            <option value={e._id}>{e.name}</option>
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

export default connect(null, { setBreadcrumbItems })(AllItems);
