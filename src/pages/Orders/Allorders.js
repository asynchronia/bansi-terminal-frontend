import React,{useEffect,useState,useRef,useCallback} from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer,toast} from "react-toastify";
import { Row, Col, Card, CardBody } from "reactstrap"
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-quartz.css';
import { connect, useDispatch } from "react-redux";
import DropdownMenuBtn from "./DropdownMenuBtn";
import { setBreadcrumbItems } from "../../store/Breadcrumb/actions";
import { getOrdersReq } from "../../service/orderService";
import OrderStatusRenderer from "./OrderStatusRenderer";
import CircleRenderer from "./CircleRenderer";
import { changePreloader } from "../../store/actions";

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
  const [paginationPageSize, setPaginationPageSize ]= useState(25);
  let bodyObject = {
    "page": 1,
    "limit": 200
  };

  const redirectToViewPage = (id) =>{
    let path = `/order/${id.salesorder_id}`; 
     setTimeout(() => {
      navigate(path,id);
     }, 300); 
  }

  const handleViewClick = (id) =>{
    redirectToViewPage(id);
  }

  useEffect(() => {
    props.setBreadcrumbItems('All Orders', breadcrumbItems);
    if (!effectCalled.current) {
      getListOfRowData(bodyObject);
      effectCalled.current=true;
    }
  },[]);

  useEffect(() => {
    props.setBreadcrumbItems('All Orders', breadcrumbItems);
    if(paginationPageSize && paginationPageSize !== undefined){
      getListOfRowData(bodyObject);
    }
  },[paginationPageSize]);

  const getListOfRowData =  useCallback(async (body) => {
    dispatch(changePreloader(true));
    const response = await getOrdersReq(body);
    setRowData(response);
    dispatch(changePreloader(false));
  });
  const redirectToEditPage = (id) =>{
    let path = "/edit-item"; 
     setTimeout(() => {
      navigate(path, id);
     }, 300); 
      
  }
  const handleDeleteResponse = (response) =>{
    if (response.success === true) {
      notify("Success", response.message);
    } else {
      notify("Error", response.message);
    }
    getListOfRowData();
  } 
  const handleEditClick = (id) =>{
    redirectToEditPage(id);
  }
  const onPaginationChanged = useCallback((event) => {
    // Workaround for bug in events order
   let pageSize=  gridRef.current.api.paginationGetPageSize();
   setPaginationPageSize(pageSize)
  }, []);
  
  const gridRef = useRef();
  
  const breadcrumbItems = [
    { title: "Dashboard", link: "#" },
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
      headerCheckboxSelection: true, checkboxSelection: true,suppressMenu: true,
      floatingFilterComponentParams: {suppressFilterButton:true},
      tooltipValueGetter: (p) => p.value,headerTooltip: "Order Date",
    },
    {
      headerName: "Order No.", field: "salesorder_id",suppressMenu: true,
      floatingFilterComponentParams: {suppressFilterButton:true},
      tooltipValueGetter: (p) => p.value,headerTooltip: "Order No.",
    },
    {
      headerName: "Client", field: "customer_name",suppressMenu: true,
      floatingFilterComponentParams: {suppressFilterButton:true},
      tooltipValueGetter: (p) => p.value,
      headerTooltip: "Client",
    },
    {
      headerName: "Order Status", field: "order_status", cellRenderer: OrderStatusRenderer,suppressMenu: true,
      floatingFilterComponentParams: {suppressFilterButton:true},
      tooltipValueGetter: (p) => p.value,headerTooltip: "Order Status",
    },
    {
      headerName: "Total Amount", field: "total",suppressMenu: true,
      floatingFilterComponentParams: {suppressFilterButton:true},
      tooltipValueGetter: (p) => p.value,headerTooltip: "Total Amount",
    },
    {
      headerName: "Inovice", field: "invoiced_status", cellRenderer: CircleRenderer,suppressMenu: true,
      floatingFilterComponentParams: {suppressFilterButton:true},
      tooltipValueGetter: (p) => p.value,headerTooltip: "Invoice",
    },
    {
      headerName: "Payment", field: "paid_status", cellRenderer: CircleRenderer,suppressMenu: true,
      floatingFilterComponentParams: {suppressFilterButton:true},
      tooltipValueGetter: (p) => p.value,headerTooltip: "Payment",
    },
    {
      headerName: "Shipment", field: "shipped_status", cellRenderer: CircleRenderer,suppressMenu: true,
      floatingFilterComponentParams: {suppressFilterButton:true},
      tooltipValueGetter: (p) => p.value,
      headerTooltip: "Shipment",
    },
    {
      headerName: "Action", field: "action", sortable: false,
      cellClass:"actions-button-cell",
      cellRenderer: DropdownMenuBtn,
      cellRendererParams: {
        handleResponse: handleDeleteResponse,
        handleEditClick: handleEditClick,
        handleViewClick: handleViewClick,
      },suppressMenu: true,floatingFilterComponentParams: {suppressFilterButton:true},
      tooltipValueGetter: (p) => p.value,headerTooltip: "Actions",
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

  useEffect(() => {
    props.setBreadcrumbItems('All Orders', breadcrumbItems);
  },[]);

  return (
    <>
       <ToastContainer position="top-center" theme="colored" />
        <div className="all-items">
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
                                pagination={pagination}
                                paginationPageSize={paginationPageSize}
                                paginationPageSizeSelector={paginationPageSizeSelector}
                                rowSelection="multiple"
                                reactiveCustomComponents
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

export default connect(null, { setBreadcrumbItems })(AllOrders);