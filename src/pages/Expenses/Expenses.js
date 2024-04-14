import React, { useEffect, useState, useRef, useCallback } from "react";
import { Row, Col, Card, CardBody, CardTitle, Button, Input, Modal } from "reactstrap"
import { connect, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-quartz.css';
import { setBreadcrumbItems } from "../../store/Breadcrumb/actions";

import { formatNumberWithCommasAndDecimal } from "../Invoices/invoiceUtil";
import "./styles/datatables.scss";

import { changePreloader } from "../../store/actions";
import { getExpensesReq } from "../../service/expenseService";

const Expenses = (props) => {
    document.title = "Estimates";
    let dispatch = useDispatch();
    const effectCalled = useRef(false);

  const breadcrumbItems = [

    { title: "Dashboard", link: "/dashboard" },
    { title: "Expenses", link: "/expenses" },

  ];
  const gridRef = useRef();
  let bodyObject = {
    "page": 1,
    "limit": 200
  };
  const columnDefs = [
    {
        headerName: "Order Date",
        field: "created_time",
        headerCheckboxSelection: true,
        checkboxSelection: true,
        cellRenderer: (props) => {
          let date = new Date(props.value);
          return <>{date.toDateString()}</>;
        },
        suppressMenu: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
      },
    { 
        headerName: "Reference No.",
        field: "reference_number",
        sortable: false ,
        suppressMenu: true,
        floatingFilterComponentParams: {suppressFilterButton:true}},
    { 
        headerName: "Paid Through", 
        field: "paid_through_account_name", 
        sortable: false ,suppressMenu: true,
        tooltipValueGetter: (p) => p.value,headerTooltip: "Paid through",
        floatingFilterComponentParams: {suppressFilterButton:true} },
    { 
        headerName: "Status",
        field: "status" ,
        suppressMenu: true,
        comparator: () => false,
        floatingFilterComponentParams: {suppressFilterButton:true}},
    {
        headerName: "Amount", field: "total",suppressMenu: true,
        floatingFilterComponentParams: {suppressFilterButton:true},
        tooltipValueGetter: (p) => p.value,headerTooltip: "Amount",
        valueFormatter: params => formatNumberWithCommasAndDecimal(params.value)
      },
    
  ];
  

  const autoSizeStrategy = {
    type: 'fitGridWidth'
  };

  const paginationPageSizeSelector = [25,50,100];

 
  const [rowData, setRowData] = useState([]);
  
  const [paginationPageSize, setPaginationPageSize] = useState(25);

  const [page, setPage] = useState(1);

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

  
  const getListOfRowData = useCallback(async (body) => {
    dispatch(changePreloader(true));
    const response = await getExpensesReq(body);

    setRowData(response.data);
    dispatch(changePreloader(false));
  });

  useEffect(() => {
    props.setBreadcrumbItems("Expenses", breadcrumbItems);
    if (!effectCalled.current) {
      getListOfRowData(bodyObject);
      effectCalled.current = true;
    }
  }, []);

 

  return (
    <React.Fragment>
      <div className="all-clients">
        <Row>
          <Col className="col-12">
            <Card>
              <CardBody>
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
                    pagination
                    paginationPageSize={paginationPageSize}
                    paginationPageSizeSelector={paginationPageSizeSelector}
                    rowSelection="multiple"
                    reactiveCustomComponents
                    rowData={rowData}
                    onPaginationChanged={onPaginationChanged}
                    sortingOrder={["desc", "asc"]}
                    autoSizeStrategy={autoSizeStrategy}
                  >
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

export default connect(null, { setBreadcrumbItems })(Expenses);