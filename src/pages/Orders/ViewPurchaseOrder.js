import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { AgGridReact } from 'ag-grid-react';
import React, { useCallback, useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Card, CardBody, Col, Input, Row } from "reactstrap";
import { getPurchaseOrderListReq } from "../../service/purchaseService";
import { setBreadcrumbItems } from "../../store/Breadcrumb/actions";
import { changePreloader } from "../../store/actions";
import { formatNumberWithCommasAndDecimal } from "../Invoices/invoiceUtil";
import DropdownMenuBtn from "./DropdownMenuBtn";
import OrderStatusRenderer from "./OrderStatusRenderer";
import { formatDate } from '../../utility/formatDate';
import { USER_TYPES_ENUM } from '../../utility/constants';
import RequireUserType from '../../routes/middleware/requireUserType';

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
    let path = `/purchase-orders/${id}`;
    setTimeout(() => {
      navigate(path, id);
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

      const newData = response.purchaseOrders.map(order => {
        let subTotal = 0;
        let totalQuantity = 0;
        let gstTotal = 0;
      
        order.items.forEach((item) => {
          subTotal += item.unitPrice * item.quantity;
          totalQuantity += item.quantity;
          item.taxes.forEach((tax) => {
            gstTotal += (item.unitPrice * item.quantity * tax.taxPercentage) / 100;
          });
        });
      
        const total = subTotal + gstTotal;
      
        return {
          order_id: order._id,
          order_number: order.purchaseOrderNumber ? order.purchaseOrderNumber : "-",
          client_name: order.clientId.name,
          createdAt: formatDate(order.createdAt),
          total: total,
          order_status: order.status,
          salesOrderNumber: order.salesOrderNumber
        };
      });
      
      setRowData(newData);
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
    } finally {
      dispatch(changePreloader(false));
    }
  }, [dispatch]);

  const redirectToEditPage = (id) => {
    let path = `/purchase-orders/${id.order_id}/edit`;
    setTimeout(() => {
      navigate(path);
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
      headerName: "Order No.", field: "order_number", suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      tooltipValueGetter: (p) => p.value, headerTooltip: "Order No.",
      sortable: true, minWidth: 150,
    },
    {
      headerName: "Sales Order No.", field: "salesOrderNumber", suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      tooltipValueGetter: (p) => p.value, headerTooltip: "Sales Order No.",
      sortable: true, minWidth: 150,
      cellRenderer: (props) => {
        return <>{props.value ? props.value : "-" }</>
      }
    },
    {
      headerName: "Order Date", field: "createdAt", suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      tooltipValueGetter: (p) => p.value, headerTooltip: "Order Date",
      sortable: true, minWidth: 150
    },
    {
      headerName: "Client", field: "client_name", suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      tooltipValueGetter: (p) => p.value,
      headerTooltip: "Client",
      sortable: true, minWidth: 150
    },
    {
      headerName: "Total Amount", field: "total", suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      tooltipValueGetter: (p) => p.value, headerTooltip: "Total Amount",
      valueFormatter: params => formatNumberWithCommasAndDecimal(params.value) + " /-",
      sortable: true, minWidth: 150
    },
    {
      headerName: "Order Status", field: "order_status", suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      tooltipValueGetter: (p) => p.value, headerTooltip: "Order Status", cellRenderer: OrderStatusRenderer,
      sortable: true, minWidth: 150
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
      tooltipValueGetter: (p) => p.value, headerTooltip: "Actions",
    }
  ];

  const clientColumnDefs = columnDefs.filter(colDef => colDef.headerName !== "Client")

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
                          className="form-control rounded border"
                          placeholder="Search"
                        />
                        <i className="mdi mdi-magnify search-icon"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="ag-theme-quartz"
                  style={{
                    height: '550px',
                    width: '100%'
                  }}
                >
                  <RequireUserType userType={USER_TYPES_ENUM.ADMIN}>
                    <AgGridReact
                      ref={gridRef}
                      suppressRowClickSelection={true}
                      columnDefs={columnDefs}
                      pagination={true}
                      paginationAutoPageSize={true}
                      autoSizeStrategy={autoSizeStrategy}
                      rowData={rowData}
                      quickFilterText={inputValue}
                      reactiveCustomComponents
                      onPaginationChanged={onPaginationChanged}
                    >
                    </AgGridReact>
                  </RequireUserType>
                  <RequireUserType userType={USER_TYPES_ENUM.CLIENT}>
                    <AgGridReact
                      ref={gridRef}
                      suppressRowClickSelection={true}
                      columnDefs={clientColumnDefs}
                      pagination={true}
                      paginationAutoPageSize={true}
                      autoSizeStrategy={autoSizeStrategy}
                      rowData={rowData}
                      quickFilterText={inputValue}
                      reactiveCustomComponents
                      onPaginationChanged={onPaginationChanged}
                    >
                    </AgGridReact>
                  </RequireUserType>
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
