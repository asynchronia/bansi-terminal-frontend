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
  const [searchValue, setSearchValue] = useState();
  const [inputValue, setInputValue] = useState('');
  const [sortData, setSortData] = useState(null);

  const timerRef = useRef(null);

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
    console.log("page in useeffect",page)
    getListOfRowData(body);
  }, [page, paginationPageSize, searchValue, sortData]);
  
  const getListOfRowData = useCallback(async (body) => {
    if (rowData[(page - 1) * paginationPageSize]) {
      return;
    }

    dispatch(changePreloader(true));

    try {
      const response = await getPurchaseOrderListReq(body);

      if (!response || !response.purchaseOrders || !Array.isArray(response.purchaseOrders)) {
        console.error("Unexpected response format:", response);
        return;
      }

      const res = response.purchaseOrders.map(order => {
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
          status: order.status,
          salesOrderNumber: order.salesOrderNumber
        };
      });

      const emptyObjects = Array.from({ length: res.length }, () => null);
      let filledRows;
      if(res.length < paginationPageSize) {
        filledRows = [...res];
      } else {
        filledRows = [...res, ...emptyObjects]
      }

      // Replace the section of data for the current page
      const newData = [...rowData];

      newData.splice((page - 1) * paginationPageSize, paginationPageSize, ...filledRows);
      console.log(newData)
      setRowData(newData);
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
    } finally {
      dispatch(changePreloader(false));
    }
  }, [page, paginationPageSize, searchValue, sortData]);

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
    // Workaround for bug in events order
    const pageSize = gridRef.current.api.paginationGetPageSize();

    if (pageSize !== paginationPageSize) {
      setPaginationPageSize(pageSize);
    }
    const newPage = gridRef.current.api.paginationGetCurrentPage() + 1;

    if (page !== newPage) {
      setPage(newPage);
    }
  }, [page, paginationPageSize]);


  const handleInputChange = (e) => {
    setInputValue(e.target.value?.trim());
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setRowData([]);
      setPage(1);
      setSearchValue(e.target.value?.trim());
    }, 2000);
  };

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
      sortable: false, minWidth: 150,
    },
    {
      headerName: "Sales Order No.", field: "salesOrderNumber", suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      tooltipValueGetter: (p) => p.value, headerTooltip: "Sales Order No.",
      sortable: false, minWidth: 150,
      cellRenderer: (props) => {
        return <>{props.value ? props.value : "-" }</>
      }
    },
    {
      headerName: "Order Date", field: "createdAt", suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      tooltipValueGetter: (p) => p.value, headerTooltip: "Order Date",
      sortable: true, minWidth: 150,
      comparator: () => false,
    },
    {
      headerName: "Client", field: "client_name", suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      tooltipValueGetter: (p) => p.value,
      headerTooltip: "Client",
      sortable: false, minWidth: 150
    },
    {
      headerName: "Total Amount", field: "total", suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      tooltipValueGetter: (p) => p.value, headerTooltip: "Total Amount",
      valueFormatter: params => formatNumberWithCommasAndDecimal(params.value) + " /-",
      sortable: false, minWidth: 150
    },
    {
      headerName: "Order Status", field: "status", suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      tooltipValueGetter: (p) => p.value, headerTooltip: "Order Status", cellRenderer: OrderStatusRenderer,
      sortable: true, minWidth: 150,
      comparator: () => false,
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
    <>
      <div className="all-items">
        <Row>
          <Col className="col-12">
            <Card>
              <CardBody>
                <div className="button-section">
                  <div className="button-right-section">
                    <div className="invoice-search-box">
                      <RequireUserType userType={USER_TYPES_ENUM.ADMIN}>
                        <div className="search-box position-relative" style={{ width: '20rem' }}>
                          <Input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            className="form-control rounded border"
                            placeholder="Search by Client or Order Number"
                          />
                          <i className="mdi mdi-magnify search-icon"></i>
                        </div>
                      </RequireUserType>
                      <RequireUserType userType={USER_TYPES_ENUM.CLIENT}>
                        <div className="search-box position-relative" style={{ width: '14rem' }}>
                          <Input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            className="form-control rounded border"
                            placeholder="Search by Order Number"
                          />
                          <i className="mdi mdi-magnify search-icon"></i>
                        </div>
                      </RequireUserType>
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
                      paginationPageSize={paginationPageSize}
                      paginationPageSizeSelector={paginationPageSizeSelector}
                      autoSizeStrategy={autoSizeStrategy}
                      rowData={rowData}
                      reactiveCustomComponents
                      onPaginationChanged={onPaginationChanged}
                      onSortChanged={handleSortChange}
                      sortingOrder={["desc", "asc"]}
                    >
                    </AgGridReact>
                  </RequireUserType>
                  <RequireUserType userType={USER_TYPES_ENUM.CLIENT}>
                    <AgGridReact
                      ref={gridRef}
                      suppressRowClickSelection={true}
                      columnDefs={clientColumnDefs}
                      pagination={true}
                      paginationPageSize={paginationPageSize}
                      paginationPageSizeSelector={paginationPageSizeSelector}
                      autoSizeStrategy={autoSizeStrategy}
                      rowData={rowData}
                      reactiveCustomComponents
                      onPaginationChanged={onPaginationChanged}
                      onSortChanged={handleSortChange}
                      sortingOrder={["desc", "asc"]}
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
