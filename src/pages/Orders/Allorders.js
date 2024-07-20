import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { AgGridReact } from 'ag-grid-react';
import React, { useCallback, useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Card, CardBody, Col, Input, Row } from "reactstrap";
import { getOrdersReq } from "../../service/orderService";
import { changePreloader } from "../../store/actions";
import { setBreadcrumbItems } from "../../store/Breadcrumb/actions";
import { formatNumberWithCommasAndDecimal } from "../Invoices/invoiceUtil";
import CircleRenderer from "./CircleRenderer";
import DropdownMenuBtn from "./DropdownMenuBtn";
import OrderStatusRenderer from "./OrderStatusRenderer";

const AllOrders = (props) => {
  document.title = "All Orders";
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const effectCalled = useRef(false);

  const autoSizeStrategy = {
    type: 'fitGridWidth'
  };
  // enables pagination in the grid
  const pagination = true;

  // sets 10 rows per page (default is 100)
  // allows the user to select the page size from a predefined list of page sizes
  const paginationPageSizeSelector = [25, 50, 100];

  const [rowData, setRowData] = useState([]);
  const [paginationPageSize, setPaginationPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [inputValue, setInputValue] = useState('');

  const redirectToViewPage = (id) => {
    let path = `/order/${id.salesorder_id}`;
    setTimeout(() => {
      navigate(path, id);
    }, 300);
  }

  const handleViewClick = (id) => {
    redirectToViewPage(id);
  }

  const onGridReady = useCallback((params) => {
    gridRef.current.api.sizeColumnsToFit();
    gridRef.current.api.autoSizeColumns(['order_status', 'invoiced_status', 'paid_status', 'shipped_status']);
  }, []);


  useEffect(() => {
    props.setBreadcrumbItems('All Orders', breadcrumbItems);
    const body = {
      page: page,
      limit: paginationPageSize,
    }
    if (searchValue) {
      body.search_text = searchValue;
    }
    getListOfRowData(body);
  }, [page, paginationPageSize, searchValue]);

  const getListOfRowData = useCallback(async (body) => {
    if (rowData[(page - 1) * paginationPageSize]) {
      return;
    }
    dispatch(changePreloader(true));
    // const body = {
    //   page: page,
    //   limit: paginationPageSize,
    // }

    // if(searchValue) {
    //   body.search_text = searchValue;
    // }
    console.log('searchValue', searchValue);
    console.log('body', body);
    const response = await getOrdersReq(body);

    const emptyObjects = Array.from({ length: paginationPageSize }, () => (null));
    let filledRows;

    if (response.length < paginationPageSize) {
      filledRows = [...response];
    } else {
      filledRows = [...response, ...emptyObjects];
    }

    const newData = [...rowData];
    newData.splice((page - 1) * paginationPageSize, paginationPageSize, ...filledRows);
    setRowData(newData);

    dispatch(changePreloader(false));
  }, [page, paginationPageSize, searchValue]);

  const redirectToEditPage = (id) => {
    let path = "/edit-item";
    setTimeout(() => {
      navigate(path, id);
    }, 300);

  }
  const handleDeleteResponse = (response) => {
    if (response.success === true) {
      notify("Success", response.message);
    } else {
      notify("Error", response.message);
    }
    getListOfRowData();
  }
  const handleEditClick = (id) => {
    redirectToEditPage(id);
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

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  }

  const handleSearch = (event) => {
    setSearchValue(event.target.value);
    console.log(event.target.value);
    setPage(1);
    setRowData([]);
  }

  const gridRef = useRef();

  const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Sales Order", link: "#" },
  ];

  const agRowData = [
    {
      salesorder_id: "2859757000291305672",
      customer_name: "Lakshya Digital Private Limited",
      date: "2024-03-18",
      total: 3425.54,
      order_status: "closed",
      invoiced_status: "invoiced",
      paid_status: "unpaid",
      status: "invoiced",
    }
  ]
  const columnDefs = [
    {
      headerName: "Order Date", field: "date",
      floatingFilterComponentParams: { suppressFilterButton: true },
      tooltipValueGetter: (p) => p.value, headerTooltip: "Order Date",
      sortable: false, width: 120
    },
    {
      headerName: "Order No.", field: "salesorder_id", flex: 1,
      floatingFilterComponentParams: { suppressFilterButton: true },
      tooltipValueGetter: (p) => p.value, headerTooltip: "Order No.",
      sortable: false, minWidth: 140
    },
    {
      headerName: "Client", field: "customer_name", flex: 1,
      floatingFilterComponentParams: { suppressFilterButton: true },
      tooltipValueGetter: (p) => p.value,
      headerTooltip: "Client",
      sortable: false, minWidth: 200
    },
    {
      headerName: "Order Status", field: "order_status", cellRenderer: OrderStatusRenderer,
      floatingFilterComponentParams: { suppressFilterButton: true },
      tooltipValueGetter: (p) => p.value, headerTooltip: "Order Status",
      sortable: false
    },
    {
      headerName: "Total Amount", field: "total", minWdth: 100,
      floatingFilterComponentParams: { suppressFilterButton: true },
      tooltipValueGetter: (p) => p.value, headerTooltip: "Total Amount",
      valueFormatter: params => formatNumberWithCommasAndDecimal(params.value),
      sortable: false
    },
    {
      headerName: "Inovice", field: "invoiced_status", cellRenderer: CircleRenderer,
      floatingFilterComponentParams: { suppressFilterButton: true },
      tooltipValueGetter: (p) => p.value, headerTooltip: "Invoice",
      sortable: false, width: 90
    },
    {
      headerName: "Payment", field: "paid_status", cellRenderer: CircleRenderer,
      floatingFilterComponentParams: { suppressFilterButton: true },
      tooltipValueGetter: (p) => p.value, headerTooltip: "Payment",
      sortable: false, width: 90
    },
    {
      headerName: "Shipment", field: "shipped_status", cellRenderer: CircleRenderer,
      floatingFilterComponentParams: { suppressFilterButton: true },
      tooltipValueGetter: (p) => p.value,
      headerTooltip: "Shipment",
      sortable: false, width: 100

    },
    {
      headerName: "Action", field: "action", sortable: false, width: 100,
      cellClass: "actions-button-cell",
      cellRenderer: DropdownMenuBtn,
      cellRendererParams: {
        handleResponse: handleDeleteResponse,
        handleEditClick: handleEditClick,
        handleViewClick: handleViewClick,
      }, suppressMenu: true, floatingFilterComponentParams: { suppressFilterButton: true },
      tooltipValueGetter: (p) => p.value, headerTooltip: "Actions"
    }
  ]
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

  return (
    <>
      <ToastContainer position="top-center" theme="colored" />
      <div className="all-items">
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
                          placeholder="Search by Order number or Client"
                        />
                        <i className="mdi mdi-magnify search-icon"></i>
                      </div>
                    </div>
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
                    defaultColDef={{ resizable: false, suppressMovable: true }}
                    columnDefs={columnDefs}
                    pagination={pagination}
                    paginationPageSize={paginationPageSize}
                    paginationPageSizeSelector={paginationPageSizeSelector}
                    rowData={rowData}
                    onPaginationChanged={onPaginationChanged}

                    onGridReady={onGridReady}
                  >
                  </AgGridReact>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default connect(null, { setBreadcrumbItems })(AllOrders);
