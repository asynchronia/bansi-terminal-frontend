import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, CardBody, Input, Modal } from "reactstrap";
import { changePreloader } from "../../store/actions";

import DropdownMenuBtn from "./DropdownMenuBtn";
import { connect, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { formatNumberWithCommasAndDecimal } from "./invoiceUtil";

//Import Action to copy breadcrumb items from local state to redux state
import { setBreadcrumbItems } from "../../store/Breadcrumb/actions";
import { getPaymentReq } from "../../service/invoiceService";
import "./styles/datatables.scss";
import "./styles/AllInvoices.scss";
import { formatDate } from "../../utility/formatDate";
import RequireUserType from "../../routes/middleware/requireUserType";
import { USER_TYPES_ENUM } from "../../utility/constants";

const AllPayments = (props) => {
  document.title = "Payments";
  let navigate = useNavigate();
  let dispatch = useDispatch();
  const effectCalled = useRef(false);
  const [sortBody, setSortBody] = useState({
    key: 'date',
    order: "D"
  })

  const redirectToViewPage = (id) => {
    let path = `/payment/${id.payment_id}`;
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
    { title: "Payments", link: "#" },
  ];
  const gridRef = useRef();
  const handleViewClick = (data) => {
    redirectToViewPage(data);
  };

  const headerTemplate = (props) => {
    const {handleSort, data} = props
    return (
      <button onClick={() => handleSort(data, sortBody)} style={{background: 'transparent', border: 'none'}}>
        <span style={{fontWeight: 600}}>
          {data?.displayName}&nbsp;
          {sortBody?.key === data?.column.userProvidedColDef.field ? <i className={sortBody?.order === "A" ? "mdi mdi-arrow-up" : "mdi mdi-arrow-down"}></i> : ''}
        </span>
      </button>
    )
  }

  const handleSort = (data, sortBody) => {
    if(data.column.userProvidedColDef.field === sortBody?.key) {
      setSortBody({...sortBody, order: sortBody?.order === "A" ? "D" : "A"})
    } else {
      setSortBody({
        key: data.column.userProvidedColDef.field,
        order: "D"
      })
    }
    setPage(1)
    setRowData([])
  }

  const columnDefs = [
    {
      headerName: "Invoice Date",
      field: "date",
      cellRenderer: (props) => {
        if(props.value) {
          let date = new Date(props.value);
          return <>{formatDate(date)}</>;
      }
      },
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      sortable: false,
      headerComponent: headerTemplate,
      headerComponentParams:  (props) => ({
        handleSort: handleSort,
        data: props,
        sortBody,
      })

    },
    {
      headerName: "Payment#",
      field: "payment_number",
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      width: 120, sortable: false,
      headerComponent: headerTemplate,
      headerComponentParams:  (props) => ({
        handleSort: handleSort,
        data: props,
        sortBody,
      })
    },
    {
      headerName: "Type",
      field: "payment_type",
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      width: 140, sortable: false
    },
    {
      headerName: "Client",
      field: "customer_name",
      tooltipField: "customer_name",
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      flex: 1, sortable: false,
      headerComponent: headerTemplate,
      headerComponentParams:  (props) => ({
        handleSort: handleSort,
        data: props,
        sortBody,
      })
    },
    {
      headerName: "Invoice#",
      field: "invoice_numbers",
      tooltipField: "invoice_numbers",
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      flex: 1, sortable: false
    },
    {
      headerName: "Payment Mode",
      field: "payment_mode",
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      width: 130, sortable: false
    },
    {
      headerName: "Amount Paid",
      field: "amount",
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      valueFormatter: (params) =>
        formatNumberWithCommasAndDecimal(params.value),
      flex: 1, sortable: false,
      headerComponent: headerTemplate,
      headerComponentParams:  (props) => ({
        handleSort: handleSort,
        data: props,
        sortBody,
      })

    },
    {
      headerName: "Action",
      field: "action",
      sortable: false,
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      cellClass: "actions-button-cell",
      cellRenderer: DropdownMenuBtn,
      cellRendererParams: {
        handleViewClick: handleViewClick,
      },
      width: 100

    },
  ];

  const clientColumnDefs = columnDefs.filter(colDef => colDef.headerName !== "Client")

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
  const [searchValue, setSearchValue] = useState();
  const [paginationPageSize, setPaginationPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [currRowItem, setCurrRowItem] = useState(null);
  const [modal_standard, setmodal_standard] = useState(false);
  const [delaySearch, setDelaySearch] = useState();
  const [inputValue, setInputValue] = useState('');

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

  const getListOfRowData = useCallback(async (body) => {
    if (rowData[(page - 1) * paginationPageSize]) {
      return;
    }
    dispatch(changePreloader(true));
    try {
      const response = await getPaymentReq(body);
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
  });

  useEffect(() => {
    props.setBreadcrumbItems("Payments", breadcrumbItems);
    // const body = {
    //   page: page,
    //   limit: paginationPageSize,
    // }
    // if (!effectCalled.current) {
    //   getListOfRowData(body);
    //   effectCalled.current = true;
    // }
  }, []);

  useEffect(() => {
    const body = {
      page: page,
      limit: paginationPageSize,
    }
    if (searchValue) {
      body.search_text = searchValue;
    }
    if (sortBody) {
      body.sort = sortBody;
    }
    getListOfRowData(body);
  }, [searchValue, page, paginationPageSize, sortBody])

  // useEffect(() => {
  //   props.setBreadcrumbItems("Payments", breadcrumbItems);
  //   if (customer && customer !== undefined && customer !== "") {
  //     let bodyObjectWithFilter = { ...bodyObjectReq };
  //     bodyObjectWithFilter.filter = {};
  //     bodyObjectWithFilter.filter.customer_name = customer;
  //     getListOfRowData(bodyObjectWithFilter);
  //   } else {
  //     let bodyObjectWithFilter = { ...bodyObjectReq };
  //     delete bodyObjectWithFilter["filter"];
  //     getListOfRowData(bodyObjectWithFilter);
  //   }
  // }, [customer]);

  // useEffect(() => {
  //   props.setBreadcrumbItems("Payments", breadcrumbItems);
  //   if (paginationPageSize && paginationPageSize !== undefined) {
  //     getListOfRowData(bodyObject);
  //   }
  // }, [paginationPageSize]);

  const handleChange = (e) => {
    setCustomer(e.target.value);
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSearch = (event) => {
    setSearchValue(event.target.value);
    console.log(event.target.value);
    setPage(1);
    setRowData([]);
  }

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
                          value={inputValue}
                          onChange={handleInputChange}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              handleSearch(event);
                            }
                          }}
                          className="form-control rounded border"
                          placeholder="Search by Payment number or Client"
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
                  <RequireUserType userType={USER_TYPES_ENUM.ADMIN}>
                    <AgGridReact
                      ref={gridRef}
                      columnDefs={columnDefs}
                      pagination={pagination}
                      paginationPageSize={paginationPageSize}
                      paginationPageSizeSelector={paginationPageSizeSelector}
                      reactiveCustomComponents
                      autoSizeStrategy={autoSizeStrategy}
                      rowData={rowData}
                      onPaginationChanged={onPaginationChanged}
                    ></AgGridReact>
                  </RequireUserType>
                  <RequireUserType userType={USER_TYPES_ENUM.CLIENT}>
                    <AgGridReact
                      ref={gridRef}
                      columnDefs={clientColumnDefs}
                      pagination={pagination}
                      paginationPageSize={paginationPageSize}
                      paginationPageSizeSelector={paginationPageSizeSelector}
                      reactiveCustomComponents
                      autoSizeStrategy={autoSizeStrategy}
                      rowData={rowData}
                      onPaginationChanged={onPaginationChanged}
                    ></AgGridReact>
                  </RequireUserType>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default connect(null, { setBreadcrumbItems })(AllPayments);
