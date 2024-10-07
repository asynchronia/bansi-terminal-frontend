import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, CardBody, Input, Modal } from "reactstrap";

import { connect, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { changePreloader } from "../../store/actions";
import { formatNumberWithCommasAndDecimal } from "./invoiceUtil";
import '../Orders/styles/AllOrders.scss';
/*.dropdown-toggle::after {
  display: none !important; 
}*/

//Import Action to copy breadcrumb items from local state to redux state
import { setBreadcrumbItems } from "../../store/Breadcrumb/actions";
import { getInvoicesReq } from "../../service/invoiceService";
import "./styles/datatables.scss";
import "./styles/AllInvoices.scss";
import InvoiceActionBtn from "./InvoiceActionBtn";
import { getDateInFormat, getDifferenceInDays, ifOverDue } from "./invoiceUtil";

const AllInvoices = (props) => {
  document.title = "Invoices";
  let navigate = useNavigate();
  let dispatch = useDispatch();
  const effectCalled = useRef(false);

  const redirectToViewPage = (id) => {
    let path = "/view-invoice/" + id;
    setTimeout(() => {
      navigate(path, id);
    }, 400);
  };

  const redirectToEditPage = (id) => {
    // let path = "/Edit-invoice/"+id;
    //  setTimeout(() => {
    //   navigate(path, id);
    //  }, 400);
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
    { title: "Invoices", link: "#" },
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
  const handleEditClick = (id) => {
    console.log("GRID OBJECT >>>" + id);
    redirectToEditPage(id);
  };

  const onClickView = (id) => {
    console.log("GRID OBJECT >>>" + id);
    redirectToViewPage(id);
  };

  const columnDefs = [
    {
      headerName: "Invoice Date",
      field: "date", width: 140,
      cellRenderer: (props) => {
        if(props.value) { 
          let date = new Date(props.value);
          return <>{props.value ? date.toDateString() : ""}</>;
        }
      },
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
    },
    {
      headerName: "Invoice No.",
      field: "invoice_number",
      tooltipField: "invoice_number",
      suppressMenu: true, width: 150,
      floatingFilterComponentParams: { suppressFilterButton: true },
    },
    {
      headerName: "Order No.",
      field: "reference_number",
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
    },
    {
      headerName: "Client",
      field: "customer_name",
      tooltipField: "customer_name",
      suppressMenu: true, minWidth: 150, flex: 1,
      floatingFilterComponentParams: { suppressFilterButton: true },
    },
    {
      headerName: "Status",
      field: "status",
      width: 150,
      cellRenderer: (props) => {
        if(props?.data?.due_date){
          let due_date = new Date(props.data.due_date);

          let curr_date = new Date();
          let status_msg = "";
          let statusClass = "status-msg ";
          if (ifOverDue(curr_date, due_date)) {
            let days = getDifferenceInDays(curr_date, due_date);
            status_msg = days > 0 ? "Overdue by " + days + " day(s)" : "";
            statusClass = statusClass + "red";
          } else {
            let days = getDifferenceInDays(curr_date, due_date);

            days > 0
              ? (status_msg = "Pending in " + days + " day(s)")
              : (status_msg = "");

            statusClass = statusClass + "green";
          }
          return (
            <>
              <p className="status-field">{getDateInFormat(due_date)}</p>
              <p className={statusClass}>{status_msg}</p>{" "}
            </>
          );
        }
      },
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
    },
    {
      headerName: "Total Amount",
      field: "total",
      sortable: false,
      suppressMenu: true, width: 140,
      floatingFilterComponentParams: { suppressFilterButton: true },
      valueFormatter: (params) =>
        formatNumberWithCommasAndDecimal(params.value),
    },
    {
      headerName: "Amount Due",
      field: "balance",
      suppressMenu: true, width: 140,
      floatingFilterComponentParams: { suppressFilterButton: true },
      valueFormatter: (params) =>
        formatNumberWithCommasAndDecimal(params.value),
    },
    {
      headerName: "Action",
      field: "action",
      sortable: false, width: 100,
      cellClass: "actions-button-cell",
      cellRenderer: InvoiceActionBtn,
      cellRendererParams: {
        onClickView: onClickView,
      },
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
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

  const [allCustomers, setAllCustomers] = useState([]);
  const [customer, setCustomer] = useState("");
  const [rowData, setRowData] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const [paginationPageSize, setPaginationPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [currRowItem, setCurrRowItem] = useState(null);
  const [modal_standard, setmodal_standard] = useState(false);
  const [delaySearch, setDelaySearch] = useState();

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
  const getListOfRowData = useCallback(async (body) => {
    if (rowData[(page - 1) * paginationPageSize]) {
      return;
    }
    dispatch(changePreloader(true));
    try {
      const response = await getInvoicesReq(body);

      let custList = new Set();
      response.map((val, id) => {
        custList.add(val.customer_name);
      });
      let custArr = [];

      custList?.forEach((val, key, set) => {
        custArr.push(val);
      });

      const emptyObjects = Array.from({ length: paginationPageSize }, () => (null));
      let filledRows;

      if (response.length < paginationPageSize) {
        filledRows = [...response];
      } else {
        filledRows = [...response, ...emptyObjects];
      }

      const newData = [...rowData];
      newData.splice((page - 1) * paginationPageSize, paginationPageSize, ...filledRows);

      setAllCustomers([...custArr]);
      setRowData(newData);
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
    } finally {
      dispatch(changePreloader(false));
    }
  },[page, paginationPageSize, searchValue]);

  useEffect(() => {
    props.setBreadcrumbItems("Invoices", breadcrumbItems);
    const body = {
      page: page,
      limit: paginationPageSize,
    }
    if (!effectCalled.current) {
      getListOfRowData(body);
      effectCalled.current = true;
    }
  }, []);

  // useEffect(() => {
  //   props.setBreadcrumbItems("Invoices", breadcrumbItems);
  //   if (customer && customer !== undefined && customer !== "") {
  //     let bodyObjectWithCategory = { ...bodyObjectReq };
  //     bodyObjectWithCategory.filter = {};
  //     bodyObjectWithCategory.filter.customer_name = customer;
  //     getListOfRowData(bodyObjectWithCategory);
  //   } else {
  //     let bodyObjectWithCategory = { ...bodyObjectReq };
  //     delete bodyObjectWithCategory["filter"];
  //     getListOfRowData(bodyObjectWithCategory);
  //   }
  // }, [customer]);

  useEffect(() => {
    const body = {
      page: page,
      limit: paginationPageSize,
    }
    if (delaySearch && delaySearch !== undefined && delaySearch !== "") {
      let bodyObjectWithCategory = { ...body };
      bodyObjectWithCategory.search_text = delaySearch;
      getListOfRowData(bodyObjectWithCategory);
    } else {
      getListOfRowData(body);
    }
  }, [delaySearch, page, paginationPageSize]);

  // useEffect(() => {
  //   props.setBreadcrumbItems("Invoices", breadcrumbItems);
  //   if (paginationPageSize && paginationPageSize !== undefined) {
  //     let bodyObjectWithCategory = { ...bodyObject };
  //     // bodyObjectWithCategory.limit=
  //     getListOfRowData(bodyObjectWithCategory);
  //   }
  // }, [paginationPageSize]);

  const handleChange = (e) => {
    setCustomer(e.target.value);
  };
  const handleInputChange = (e) => {
    setSearchValue(e.target.value);

    const delay = 2000;

    const timerId = setTimeout(() => {
      console.log("Executing code after delay");
      setDelaySearch(e.target.value);
      setPage(1)
      setRowData([])
    }, delay);

    return () => clearTimeout(timerId);
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
                        <Input
                          type="text"
                          value={searchValue}
                          onChange={handleInputChange}
                          className="form-control rounded border"
                          placeholder="Search by Invoice number or Client"
                        />
                        <i className="mdi mdi-magnify search-icon"></i>
                      </div>
                    </div>
                    {/* <select
                      onChange={handleChange}
                      id="customer"
                      name="customer"
                      value={customer}
                      className="form-select focus-width"
                    >
                      <option value="" selected>
                        Select Client
                      </option>
                      {allCustomers.map((e) => (
                        <option value={e}>{e}</option>
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
                    rowHeight={60}
                    columnDefs={columnDefs}
                    pagination={pagination}
                    paginationPageSize={paginationPageSize}
                    paginationPageSizeSelector={paginationPageSizeSelector}
                    reactiveCustomComponents
                    autoSizeStrategy={autoSizeStrategy}
                    rowData={rowData}
                    defaultColDef={{ resizable: false, suppressMovable: true }}
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

export default connect(null, { setBreadcrumbItems })(AllInvoices);
