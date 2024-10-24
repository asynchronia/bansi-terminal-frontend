import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, CardBody, Button, Input, Modal } from "reactstrap";

import { connect, useDispatch } from "react-redux";
import { toast } from "react-toastify";
// import {AgGridReact} from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { changePreloader } from "../../store/actions";
import { formatNumberWithCommasAndDecimal } from "../Invoices/invoiceUtil";
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
import RequirePermission from "../../routes/middleware/requirePermission";
import { MODULES_ENUM, PERMISSIONS_ENUM } from "../../utility/constants";
import { ReactComponent as Import } from "../../assets/images/svg/import-button.svg";
import { ReactComponent as Add } from "../../assets/images/svg/add-button.svg";
import { formatDate } from "../../utility/formatDate";

const AllItems = (props) => {
  document.title = "All Items";
  let navigate = useNavigate();
  const redirectToCreateItem = () => {
    let path = "/create-item";
    navigate(path);
  };

  const [categoryData, setCategoryData] = useState({
    name: "",
    id: null,
    show: false,
  });

  const [bodyData, setBodyData] = useState({
    page: 1,
    limit: 500,
    search: "",
    filter: {
      category: null,
    }
  });

  const timerRef = useRef(null);

  function bodyDataRefine(bodyData) {
    const value = {
      page: bodyData.page,
      limit: bodyData.limit,
    };
    if (bodyData.search) {
      value.search = bodyData.search;
    }
    if (bodyData.filter?.category) {
      value.filter = {
        category: bodyData.filter.category,
      };
    }
    return value;
  }

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
    { title: "Dashboard", link: "/dashboard" },
    { title: "All Items", link: "#" },
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
      tooltipField: 'title',
      headerCheckboxSelection: true,
      checkboxSelection: true,
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      comparator: () => false,
    },
    {
      headerName: "Type",
      field: "itemType",
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      comparator: () => false,
      sortable: false
    },
    {
      headerName: "HSN Code",
      field: "hsnCode",
      tooltipField: "hsnCode",
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      comparator: () => false,
    },
    {
      headerName: "Status",
      field: "status",
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      cellRenderer: (props) => {
        if(props.value){
          return <>{props.value}</>;
        }
      },
      comparator: () => false,
    },
    {
      headerName: "Sale Price",
      field: "salePrice",
      sortable: false,
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      valueFormatter: (params) =>
        formatNumberWithCommasAndDecimal(params.value),
    },
    {
      headerName: "Created On",
      field: "createdAt",
      cellRenderer: (props) => {
        if(props.value){
          let date = new Date(props.value);
          return <>{formatDate(date)}</>;
        }
      },
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      comparator: () => false,
    },
    {
      headerName: "Category",
      field: "category",
      tooltipField: "category",
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      comparator: () => false,
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
  ]
  const autoSizeStrategy = {
    type: "fitGridWidth",
  };
  // enables pagination in the grid
  const pagination = true;

  // sets 10 rows per page (default is 100)
  // allows the user to select the page size from a predefined list of page sizes
  const paginationPageSizeSelector = [25, 50, 100];

  const [allCategories, setAllCategories] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [searchValue, setSearchValue] = useState(null);
  const [searchInputValue, setSearchInputValue] = useState(null);
  const [paginationPageSize, setPaginationPageSize] = useState(25);
  const [currRowItem, setCurrRowItem] = useState(null);
  const [modal_standard, setmodal_standard] = useState(false);
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const [sortData, setSortData] = useState(null);
  const [page, setPage] = useState(1);

  const tog_standard = () => {
    setmodal_standard(!modal_standard);
    removeBodyCss();
  };
  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }
  const onPaginationChanged = useCallback((event) => {
    // Workaround for bug in events order
    const pageSize = gridRef.current.api.paginationGetPageSize();

    if (pageSize !== paginationPageSize) {
      setPaginationPageSize(pageSize);
    }
    const newPage = gridRef.current.api.paginationGetCurrentPage() + 1;

    if (page !== newPage) {
      setPage(newPage);
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
        "category": "65bab211ce0f79d56447c537"
    }
}
* */
  const getListOfRowData = useCallback(
    async (body) => {
      if (rowData[(page - 1) * paginationPageSize]) {
        return;
      }

      dispatch(changePreloader(true));
      try {
        const response = await getItemsReq(body);

        response.items.map((val, id) => {
          val.category = val.category.name;
          val.salePrice = val.variant?.sellingPrice || "-";
        });

        
        const emptyObjects = Array.from({ length: response.count - response.items.length }, () => null);
        
        let filledRows;
        filledRows = [...response.items];
        if(rowData.length === 0) {
          filledRows = [...response.items, ...emptyObjects];
        }

        // Replace the section of data for the current page
        const newData = [...rowData];

        newData.splice((page - 1) * paginationPageSize, paginationPageSize, ...filledRows);

        setRowData(newData);
      } catch (error) {
        console.error("Error fetching purchase orders:", error);
      } finally {
        dispatch(changePreloader(false));
      }
    },
    [page, paginationPageSize, searchValue, sortData, bodyData.filter.category]
  );

  const getCategories = useCallback(async () => {
    const response = await getCategoriesReq();

    setAllCategories(response?.payload?.categories);
  });

  useEffect(() => {
    getCategories();
    props.setBreadcrumbItems("All Items", breadcrumbItems);
  }, []);

  useEffect(() => {
    let body = {
      page: page,
      limit: paginationPageSize,
    }
    if (searchValue) {
      body.search = searchValue
    }
    if (sortData?.key && sortData?.order) {
      body.sort = sortData
    }
    if (bodyData.filter.category !== null) {
      body.filter = bodyData.filter
    }
    getListOfRowData(body);
  }, [page, paginationPageSize, searchValue, sortData, bodyData.filter.category]);

  //TODO: Pagination size dropdown fix
  /*   useEffect(() => {
      props.setBreadcrumbItems("All Items", breadcrumbItems);
      if (paginationPageSize && paginationPageSize !== undefined) {
        let bodyObjectWithCategory = { ...bodyObject };
        bodyObjectWithCategory.limit = paginationPageSize;
        getListOfRowData(bodyObjectWithCategory);
      }
    }, [paginationPageSize]); */

  const handleInputChange = (e) => {
    setSearchInputValue(e.target.value?.trim());
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setRowData([]);
      setPage(1);
      setSearchValue(e.target.value?.trim());
    }, 2000);
  };

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //       setCategoryData({ ...categoryData, show: false });
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [categoryData]);

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

 const handleSortChange = (e) => {
    const columns = gridRef.current.api.getColumnState();
    const ele = columns.find(
      (ele) => ele.sort === "asc" || ele.sort === "desc"
    );

    if (ele) {
      setRowData([]);
      setPage(1);
      setSortData({
        key: ele.colId,
        order: ele.sort,
      });
    }
  };
  return (
    <React.Fragment>
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
                  <RequirePermission
                    module={MODULES_ENUM.ITEMS}
                    permission={PERMISSIONS_ENUM.CREATE}
                  >
                    <Button
                      className="all-items-btn"
                      color="primary"
                      onClick={redirectToCreateItem}
                    >
                      <Add style={{ marginRight: "5px" }} />
                      Create Item
                    </Button>
                    {/* <Button
                      style={{
                        color: "black",
                        backgroundColor: "#bfd8f7",
                        border: "none",
                      }}
                    >
                      <Import style={{ marginRight: "5px" }} />
                      Import Items
                    </Button> */}
                  </RequirePermission>
                  <div className="button-right-section">
                    <div className="categoryDiv" ref={dropdownRef}>
                      <label
                        name="category"
                        id="category"
                        onClick={() => {
                          setCategoryData({
                            ...categoryData,
                            show: !categoryData.show,
                          });
                        }}
                        className="form-select focus-width"
                      >
                        {categoryData.name !== ""
                          ? `Category: ${categoryData.name}`
                          : `Select Category`}
                      </label>
                      {categoryData.show ? (
                        <div
                          style={{
                            position: "absolute",
                            background: "#f5f5f5",
                            minWidth: "300px",
                            padding: "2px 0px",
                          }}
                        >
                          <MultipleLayerSelect
                            levelTwo={true}
                            categories={allCategories}
                            setCategoryData={setCategoryData}
                            setBodyData={setBodyData}
                            setRowData={setRowData}
                            setPage={setPage}
                          />
                        </div>
                      ) : null}
                    </div>
                    <div className="input-group">
                      <div className="search-box position-relative">
                        <Input
                          type="text"
                          value={searchInputValue}
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
                          <span className="input-group-append">
                              <button className="btn btn-outline-secondary bg-white border-start-0 border ms-n5" type="button">
                                  <i className="fa fa-search"></i>
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
                    onSortChanged={handleSortChange}
                    sortingOrder={["desc", "asc"]}
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
