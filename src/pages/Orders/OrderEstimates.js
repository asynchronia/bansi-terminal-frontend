import React, { useEffect, useState, useRef, useCallback} from "react";
import { Row, Col, Card, CardBody, CardTitle, Button, Input, Modal } from "reactstrap"
import { connect, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { setBreadcrumbItems } from "../../store/Breadcrumb/actions";

import { formatNumberWithCommasAndDecimal } from "../Invoices/invoiceUtil";
import { getClientsReq } from "../../service/clientService";
import "./styles/datatables.scss";

import { changePreloader } from "../../store/actions";
import { getEstimatesReq } from "../../service/orderService";
import DropdownMenuBtn from "./DropdownMenuBtn";
import { formatDate } from "../../utility/formatDate";
import RequireUserType from "../../routes/middleware/requireUserType";
import { USER_TYPES_ENUM } from "../../utility/constants";

const OrderEstimates = (props) => {
    document.title = "Estimates";
    let dispatch = useDispatch();
    let navigate = useNavigate();
    const effectCalled = useRef(false);
    const [searchValue, setSearchValue] = useState();
    const [delaySearch, setDelaySearch] = useState();
    const [inputValue, setInputValue] = useState('');
    const [sortBody, setSortBody] = useState({
      key: 'date',
      order: "D"
    })

    const redirectToViewPage = (id) => {
        let path = "/view-estimate/" + id;
        setTimeout(() => {
          navigate(path, id);
        }, 400);
      };

      
  const handleViewClick = (item) => {
    redirectToViewPage(item.estimate_id);
  }
  const breadcrumbItems = [

    { title: "Dashboard", link: "/dashboard" },
    { title: "Estimates", link: "/estimates" },

  ];
  const gridRef = useRef();

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
        headerName: "Order Date",
        field: "date",
        headerCheckboxSelection: true,
        checkboxSelection: true,
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
        headerName: "Estimate No.",
        field: "estimate_number",
        tooltipField: "estimate_number",
        sortable: false ,
        suppressMenu: true,
        floatingFilterComponentParams: {suppressFilterButton:true},
        headerComponent: headerTemplate,
        headerComponentParams:  (props) => ({
          handleSort: handleSort,
          data: props,
          sortBody,
        })},
        
    { 
        headerName: "Client", 
        field: "customer_name", 
        tooltipField: "customer_name", 
        sortable: false ,suppressMenu: true,
        tooltipValueGetter: (p) => p.value,headerTooltip: "Client",
        floatingFilterComponentParams: {suppressFilterButton:true},
        headerComponent: headerTemplate,
        headerComponentParams:  (props) => ({
          handleSort: handleSort,
          data: props,
          sortBody,
        })
      },
    { 
        headerName: "Order Status",
        field: "status" ,
        suppressMenu: true,
        comparator: () => false,
        floatingFilterComponentParams: {suppressFilterButton:true},
        sortable: false,
      },
    {
        headerName: "Total Amount", field: "total",suppressMenu: true,
        floatingFilterComponentParams: {suppressFilterButton:true},
        tooltipValueGetter: (p) => p.value,headerTooltip: "Total Amount",
        valueFormatter: params => formatNumberWithCommasAndDecimal(params.value),
        headerComponent: headerTemplate,
        headerComponentParams:  (props) => ({
          handleSort: handleSort,
          data: props,
          sortBody,
        })
    },
    {
      headerName: "Action", field: "action", sortable: false, width: 100,
      cellClass: "actions-button-cell",
      cellRenderer: DropdownMenuBtn,
      cellRendererParams: {
        handleViewClick: handleViewClick,
        label: 'View Estimate'
      }, suppressMenu: true, floatingFilterComponentParams: { suppressFilterButton: true },
      tooltipValueGetter: (p) => p.value, headerTooltip: "Actions",
    }
  ];
  
  const clientColumnDefs = columnDefs.filter(colDef => colDef.headerName !== "Client")

  //TODO to check for autoSizeStrategy
  const autoSizeStrategy = {
    type: 'fitGridWidth'
  };

  const paginationPageSizeSelector = [25,50,100];

  const [rowData, setRowData] = useState([]);

  const [paginationPageSize, setPaginationPageSize] = useState(25);
  const [page, setPage] = useState(1);

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
      const response = await getEstimatesReq(body);

      const emptyObjects = Array.from({ length: paginationPageSize }, () => (null));
      let filledRows;

      if (response.data.length < paginationPageSize) {
        filledRows = [...response.data];
      } else {
        filledRows = [...response.data, ...emptyObjects];
      }

      const newData = [...rowData];
      newData.splice((page - 1) * paginationPageSize, paginationPageSize, ...filledRows);

      setRowData(newData);
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
    } finally {
      dispatch(changePreloader(false));
    }
  });

  useEffect(() => {
    props.setBreadcrumbItems("Estimates", breadcrumbItems);
    const bodyObject = {
      "page": page,
      "limit": paginationPageSize
    };
    if (!effectCalled.current) {
      getListOfRowData(bodyObject);
      effectCalled.current = true;
    }
  }, []);

//  const onRowClicked = (event) =>{
//     console.log(event.data);
//     //estimate_id
//     redirectToViewPage(event.data?.estimate_id);
//  }

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

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  };

  const handleSearch = (event) => {
    setSearchValue(event.target.value);
    console.log(event.target.value);
    setPage(1);
    setRowData([]);
  }

  return (
    <React.Fragment>
      <div className="all-clients">
        <Row>
          <Col className="col-12">
            <Card>
              <CardBody>
                <div className="button-section" style={{justifyContent: 'flex-end'}}>
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
                          placeholder="Search by Estimate number or Client"
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
                  <RequireUserType userType={USER_TYPES_ENUM.ADMIN}>
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
                      // onRowClicked={onRowClicked}
                    >
                    </AgGridReact>
                  </RequireUserType>
                  <RequireUserType userType={USER_TYPES_ENUM.CLIENT}>
                    <AgGridReact
                      ref={gridRef}
                      suppressRowClickSelection={true}
                      columnDefs={clientColumnDefs}
                      pagination
                      paginationPageSize={paginationPageSize}
                      paginationPageSizeSelector={paginationPageSizeSelector}
                      rowSelection="multiple"
                      reactiveCustomComponents
                      rowData={rowData}
                      onPaginationChanged={onPaginationChanged}
                      sortingOrder={["desc", "asc"]}
                      autoSizeStrategy={autoSizeStrategy}
                      // onRowClicked={onRowClicked}
                    >
                    </AgGridReact>
                  </RequireUserType>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  )
}

export default connect(null, { setBreadcrumbItems })(OrderEstimates);