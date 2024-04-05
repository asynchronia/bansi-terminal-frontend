import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, CardBody, Button, Input, Modal } from "reactstrap";

import { connect, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
// import {AgGridReact} from 'ag-grid-react';
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-quartz.css";
import { changePreloader } from "../../store/actions";

/*.dropdown-toggle::after {
  display: none !important; 
}*/

//Import Action to copy breadcrumb items from local state to redux state
import { setBreadcrumbItems } from "../../store/Breadcrumb/actions";
import { getItemsReq, deletItemReq } from "../../service/itemService";
import { getCategoriesReq } from "../../service/categoryService";
import "./styles/datatables.scss";
import "./styles/AllItems.scss";
import DropdownMenuBtn from "./DropdownMenuBtn";
import { AgGridReact } from "ag-grid-react";
import MultipleLayerSelect from "../../components/CustomComponents/MultipleLayerSelect";

const AllItems = (props) => {
  document.title = "All Items";
  let navigate = useNavigate();
  const effectCalled = useRef(false);
  const redirectToCreateItem = () => {
    let path = "/create-item";
    navigate(path);
  };

  const [categoryData, setCategoryData] = useState({
    name: "",
    id: null,
    show: false,
  });

  const redirectToEditPage = (id) => {
    let path = `/edit-item/${id}`;
    setTimeout(() => {
      navigate(path, id);
    }, 300);
  };
  const redirectToViewPage = (id) => {
    let path = `/view-item/${id}`;
    setTimeout(() => {
      navigate(path, id);
    }, 300);
  };
  const notify = (type, message) => {
    if (type === "Error") {
      toast.error(message, {
        position: "top-center",
        theme: "colored",
      });
    } else {
      toast.success(message, {
        position: "top-center",
        theme: "colored",
      });
    }
  };
  const breadcrumbItems = [
    { title: "Dashboard", link: "#" },
    { title: "All Items Order", link: "#" },
  ];
  const gridRef = useRef();
  const handleDeleteResponse = (response) => {
    if (response.success === true) {
      notify("Success", response.message);
    } else {
      notify("Error", response.message);
    }
    setmodal_standard(false);
    getListOfRowData();
  };
  const handleViewClick = (data) => {
    redirectToViewPage(data);
  };
  const handleEditClick = (id) => {
    redirectToEditPage(id);
  };
  const deleteItem = async (data) => {
    try {
      const response = await deletItemReq({ _id: data._id });
      if (response.success === true) {
        handleDeleteResponse(response);
      } else {
        handleDeleteResponse(response);
      }
    } catch (error) {
      console.log("ERROR  " + error);
      handleDeleteResponse(error);
    }
  };
  const onDeleteItem = (data) => {
    setCurrRowItem(data);
    setmodal_standard(true);
  };

  const columnDefs = [
      {
        headerName: "Item Name",
        field: "title",
        headerCheckboxSelection: true,
        checkboxSelection: true,
        suppressMenu: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
      },
      {
        headerName: "Type",
        field: "itemType",
        suppressMenu: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
      },
      {
        headerName: "HSN Code",
        field: "hsnCode",
        suppressMenu: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
      },
      {
        headerName: "Status",
        field: "status",
        suppressMenu: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
      },
      {
        headerName: "Sale Price",
        field: "salePrice",
        sortable: false,
        suppressMenu: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
      },
      {
        headerName: "Created On",
        field: "createdAt",
        cellRenderer: (props) => {
         
          let date = new Date(props.value);
          return <>{date.toDateString()}</>;
        },
        suppressMenu: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
      },
      {
        headerName: "Category",
        field: "category",
        suppressMenu: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
      },
      {
        headerName: "Action",
        field: "action",
        sortable: false,
        cellClass: "actions-button-cell",
        cellRenderer: DropdownMenuBtn,
        cellRendererParams: {
          deleteItem: onDeleteItem,
          handleResponse: handleDeleteResponse,
          handleEditClick: handleEditClick,
          handleViewClick: handleViewClick,
        },
        suppressMenu: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
      },
    ],
    agRowData = [
      {
        itemName: "Byju's",
        type: "Variable",
        status: "published",
        hsnCode: "ABU-123888",
        category: "electronics",
        salePrice: "500",
        gst: "18%",
        created: "13 march 2010",
      },
      {
        itemName: "Byju's",
        type: "Variable",
        status: "published",
        hsnCode: "ABU-123888",
        category: "electronics",
        salePrice: "500",
        gst: "18%",
        created: "13 march 2010",
      },
      {
        itemName: "Byju's",
        type: "Variable",
        status: "published",
        hsnCode: "ABU-123888",
        category: "electronics",
        salePrice: "500",
        gst: "18%",
        created: "13 march 2010",
      },
      {
        itemName: "Byju's",
        type: "Variable",
        status: "published",
        hsnCode: "ABU-123888",
        category: "electronics",
        salePrice: "500",
        gst: "18%",
        created: "13 march 2010",
      },
      {
        itemName: "Byju's",
        type: "Variable",
        status: "published",
        hsnCode: "ABU-123888",
        category: "electronics",
        salePrice: "500",
        gst: "18%",
        created: "13 march 2010",
      },
    ];
  const autoSizeStrategy = {
    type: "fitGridWidth",
  };
  // enables pagination in the grid
  const pagination = true;

  // sets 10 rows per page (default is 100)
  // allows the user to select the page size from a predefined list of page sizes
  const paginationPageSizeSelector = [25, 50, 100];

  const [allCategories, setAllCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [rowData, setRowData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [paginationPageSize, setPaginationPageSize] = useState(25);
  const [currRowItem, setCurrRowItem] = useState(null);
  const [modal_standard, setmodal_standard] = useState(false);
  const dispatch = useDispatch();

  let bodyObject = {
    page: 1,
    limit: 200,
  };

  const [bodyObjectReq, setBodyObjectReq] = useState(bodyObject);
  const tog_standard = () => {
    setmodal_standard(!modal_standard);
    removeBodyCss();
  };
  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }
  const onPaginationChanged = useCallback((event) => {
    
    // Workaround for bug in events order
    let pageSize = gridRef.current.api.paginationGetPageSize();
    
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
  const getListOfRowData = useCallback(async (body) => {
    dispatch(changePreloader(true));
    const response = await getItemsReq(body);

    response.map((val, id) => {
      val.category = val.category.name;
      val.salePrice = val.variant.sellingPrice;
    });
    setRowData(response);
    setBodyObjectReq(body);
    dispatch(changePreloader(false));
  });

  const getCategories = useCallback(async () => {
    const response = await getCategoriesReq();

    setAllCategories(response?.payload?.categories);
  });

  useEffect(() => {
    props.setBreadcrumbItems("All Items", breadcrumbItems);
    if (!effectCalled.current) {
      getListOfRowData(bodyObject);
      getCategories();
      effectCalled.current = true;
    }
  }, []);

 

  useEffect(() => {
    props.setBreadcrumbItems("All Items", breadcrumbItems);
    if (categoryData.id && categoryData.id !== undefined && categoryData.id !== null) {
      let bodyObjectWithCategory = { ...bodyObject };
      bodyObjectWithCategory.filter = {};
      bodyObjectWithCategory.filter.category = categoryData.id;
      getListOfRowData(bodyObjectWithCategory);
    } else {
      let bodyObjectWithCategory = { ...bodyObjectReq };
      delete bodyObjectWithCategory["filter"];
      getListOfRowData(bodyObjectWithCategory);
    }
  }, [categoryData]);

  useEffect(() => {
    props.setBreadcrumbItems("All Items", breadcrumbItems);
    if (searchValue && searchValue !== undefined && searchValue !== "") {
      let bodyObjectWithCategory = { ...bodyObject };
      bodyObjectWithCategory.search = searchValue;
      getListOfRowData(bodyObjectWithCategory);
    } else {
      getListOfRowData(bodyObject);
    }
  }, [searchValue]);

  useEffect(() => {
    props.setBreadcrumbItems("All Items", breadcrumbItems);
    if (paginationPageSize && paginationPageSize !== undefined) {
      let bodyObjectWithCategory = { ...bodyObject };
      bodyObjectWithCategory.limit = paginationPageSize;
      getListOfRowData(bodyObjectWithCategory);
    }
  }, [paginationPageSize]);

  const handleChange = (e) => {
    
    setCategory(e.target.value);
  };
  const handleInputChange = (e) => {
    
    setSearchValue(e.target.value);
  };

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
          tog_standard();
        }}
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0" id="myModalLabel">
            Confirm
          </h5>
          <button
            type="button"
            onClick={() => {
              setmodal_standard(false);
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
              deleteItem(currRowItem);
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
                  <Button
                    className="all-items-btn"
                    color="primary"
                    onClick={redirectToCreateItem}
                  >
                    <i className=" mdi mdi-20px mdi-plus mx-1"></i>Create Item
                  </Button>
                  <Button color="secondary">Import Items</Button>
                  <div className="button-right-section">
                    <div className="categoryDiv">
                      <label
                        name="category"
                        id="category"
                      
                        onClick={() => {
                          setCategoryData({
                            ...categoryData,
                            show: !categoryData.show,
                          });
                          setCategory(categoryData.id);
                        }}
                        className="form-select focus-width"
                      >
                        {categoryData.name !== ""
                          ? `Category: ${categoryData.name}`
                          : `Select Category`}
                      </label>
                      {categoryData.show ? (
                        <div style={{position:'absolute', background:'white', minWidth:'300px'}}>
                          <MultipleLayerSelect
                            categories={allCategories}
                            setCategoryData={setCategoryData}
                          />
                        </div>
                      ) : null}
                    </div>
                    <div class="input-group">
                      <div className="search-box position-relative">
                        <Input
                          type="text"
                          value={searchValue}
                          onChange={handleInputChange}
                          className="form-control rounded border"
                          placeholder="Search..."
                        />
                        <i className="mdi mdi-magnify search-icon"></i>
                      </div>
                      {/* <input
                        className="form-control border-end-0 border"
                          placeholder="Search for..."
                          value={searchValue}
                          onChange={handleInputChange}
                        />
                          <span class="input-group-append">
                              <button class="btn btn-outline-secondary bg-white border-start-0 border ms-n5" type="button">
                                  <i class="fa fa-search"></i>
                              </button>
                        </span> */}
                    </div>
                    {/* <select
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
                        </select> */}
                  </div>
                </div>
                <div
                  className="ag-theme-quartz"
                  style={{
                    height: "500px",
                    width: "100%",
                  }}
                >
                  <AgGridReact
                    ref={gridRef}
                    floatingFilter={true}
                    suppressRowClickSelection={true}
                    columnDefs={columnDefs}
                    pagination={pagination}
                    paginationPageSize={paginationPageSize}
                    paginationPageSizeSelector={paginationPageSizeSelector}
                    rowSelection="multiple"
                    reactiveCustomComponents
                    autoSizeStrategy={autoSizeStrategy}
                    rowData={rowData}
                    onPaginationChanged={onPaginationChanged}
                  ></AgGridReact>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default connect(null, { setBreadcrumbItems })(AllItems);
