import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Row, Col, Card, CardBody, Input } from "reactstrap"
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { connect, useDispatch } from "react-redux";
import DropdownMenuBtn from "./DropdownMenuBtn";
import { setBreadcrumbItems } from "../../store/Breadcrumb/actions";
import { changePreloader } from "../../store/actions";
import { getPurchaseOrderListReq } from "../../service/purchaseService";
import { formatNumberWithCommasAndDecimal } from "../Invoices/invoiceUtil";
import OrderStatusRenderer from "./OrderStatusRenderer";

const ViewPurchaseOrder = (props) => {
  document.title = "All Purchase Orders";
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const effectCalled = useRef(false);

  const autoSizeStrategy = {
    type: 'fitGridWidth'
  };
  const pagination = true;
  const paginationPageSizeSelector = [25, 50, 100];

  const [rowData, setRowData] = useState([]);
  const [paginationPageSize, setPaginationPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [inputValue, setInputValue] = useState('');

  // const redirectToViewPage = (id) => {
  //   console.log(id.order_id);
  //   let path = `/order/${id.order_id}`;
  //   setTimeout(() => {
  //     navigate(path, id.order_id);
  //   }, 300);
  // }

  const redirectToViewPage = (id) => {
    let path = `/purchase-order-details/${id}`;
    setTimeout(() => {
      navigate(path,id);
    }, 300);
  };

  const handleViewClick = (id) => {
    redirectToViewPage(id.order_id);
  }

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
    dispatch(changePreloader(true));
  
    try {
      const response = await getPurchaseOrderListReq(body);
  
      if (!response || !response.purchaseOrders || !Array.isArray(response.purchaseOrders)) {
        console.error("Unexpected response format:", response);
        return;
      }
  
      const newData = response.purchaseOrders.map(order => ({
        order_id: order._id,
        client_name: order.clientId.name,
        createdAt: formatDate(order.createdAt),
        total: order.items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0),
        order_status: order.status,
      }));
  
      setRowData(newData);
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
    } finally {
      dispatch(changePreloader(false));
    }
  }, [dispatch]);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = getMonthName(date.getMonth());
    const year = date.getFullYear();
    const ordinalDay = getOrdinal(day);
    
    return `${ordinalDay} ${month} ${year}`;
  }
  
  const getMonthName = (monthIndex) => {
    const months = [
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ];
    return months[monthIndex];
  }
  
  const getOrdinal = (day) => {
    if (day > 3 && day < 21) return `${day}th`;
    switch (day % 10) {
      case 1: return `${day}st`;
      case 2: return `${day}nd`;
      case 3: return `${day}rd`;
      default: return `${day}th`;
    }
  }

  const handleSearch = (event) => {
    setSearchValue(event.target.value);
    setPage(1);
    setRowData([]);
  }

  const gridRef = useRef();

  const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Purchase Order", link: "#" },
  ];

  const columnDefs = [
    {
      headerName: "Order No.", field: "order_id", suppressMenu: true,
      headerCheckboxSelection: true, checkboxSelection: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      tooltipValueGetter: (p) => p.value, headerTooltip: "Order No.",
      sortable: false
    },
    {
      headerName: "Order Date", field: "createdAt", suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      tooltipValueGetter: (p) => p.value, headerTooltip: "Order Date",
      sortable: false
    },
    {
      headerName: "Client", field: "client_name", suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      tooltipValueGetter: (p) => p.value,
      headerTooltip: "Client",
      sortable: false
    },
    {
      headerName: "Total Amount", field: "total", suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      tooltipValueGetter: (p) => p.value, headerTooltip: "Total Amount",
      valueFormatter: params => formatNumberWithCommasAndDecimal(params.value) + " /-",
      sortable: false
    },
    {
      headerName: "Order Status", field: "order_status", suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      tooltipValueGetter: (p) => p.value, headerTooltip: "Order Status",cellRenderer: OrderStatusRenderer,
      sortable: false
    },
    {
      headerName: "Action", field: "action", sortable: false,
      cellClass: "actions-button-cell",
      cellRenderer: DropdownMenuBtn,
      cellRendererParams: {
        handleResponse: handleDeleteResponse,
        handleEditClick: handleEditClick,
        handleViewClick: handleViewClick,
      }, suppressMenu: true, floatingFilterComponentParams: { suppressFilterButton: true },
      tooltipValueGetter: (p) => p.value, headerTooltip: "Actions",
    }
  ];

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
                          placeholder="Search by sales order number or customer name..."
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
                    suppressRowClickSelection={true}
                    columnDefs={columnDefs}
                    pagination={pagination}
                    paginationPageSize={paginationPageSize}
                    paginationPageSizeSelector={paginationPageSizeSelector}
                    rowSelection="multiple"
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
    </>
  )
}

export default connect(null, { setBreadcrumbItems })(ViewPurchaseOrder);
