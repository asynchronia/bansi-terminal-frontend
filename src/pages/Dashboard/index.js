import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Row, Col, Card, CardBody } from "reactstrap";
// Pages Components
import Miniwidget from "./Miniwidget";
//import MonthlyEarnings from "./montly-earnings";
import EmailSent from "./email-sent";
import MonthlyEarnings2 from "./montly-earnings2";

//Import Action to copy breadcrumb items from local state to redux state
import { setBreadcrumbItems } from "../../store/actions";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import { formatNumberWithCommasAndDecimal } from "../Invoices/invoiceUtil";
import OrderStatusRenderer from "../Orders/OrderStatusRenderer";
import DropdownMenuBtn from "../Orders/DropdownMenuBtn";
import { useNavigate } from "react-router-dom";
import { getPurchaseOrderListReq, getPurchaseOrderStatusListReq } from "../../service/purchaseService";
import { toast } from "react-toastify";
import StyledButton from "../../components/Common/StyledButton";
import { getAgreement } from "../../api";
import "./styles/Dashboard.scss";

const Dashboard = (props) => {
  document.title = "Willsmeet Portal";
  let navigate = useNavigate();

  const breadcrumbItems = [{ title: "Dashboard", link: "#" }];

  const [inputValue, setInputValue] = useState('');
  const [rowData, setRowData] = useState([]);
  const [chipData, setChipData] = useState([
    {
      title: 'Total Orders',
      total: 0,
    },
    {
      title: 'Orders pending for approval',
      total: 0,
    },
    {
      title: 'Approved Orders',
      total: 0,
    },
    {
      title: 'Ongoing Orders',
      total: 0,
    },
  ]);

  const redirectToViewPage = (id) => {
    let path = `/purchase-orders/${id}`;
    setTimeout(() => {
      navigate(path, id);
    }, 300);
  };

  const handleViewClick = (id) => {
    redirectToViewPage(id.order_id);
    console.log(id.order_id);
  };

  const handleDeleteResponse = (response) => {
    if (response.success === true) {
      notify('Success', response.message);
    } else {
      notify('Error', response.message);
    }
    getPurchaseOrderListData();
  };

  const redirectToEditPage = (id) => {
    let path = `/purchase-orders/${id.order_id}/edit`;
    setTimeout(() => {
      navigate(path);
    }, 300);
  };

  const handleEditClick = (id) => {
    redirectToEditPage(id);
  };

  const notify = (type, message) => {
    if (type === 'Error') {
      toast.error(message, {
        position: 'top-center',
        theme: 'colored',
      });
    } else {
      toast.success(message, {
        position: 'top-center',
        theme: 'colored',
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const columnDefs = [
    {
      headerName: 'Recent Order',
      field: 'order_number',
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      tooltipValueGetter: (p) => p.value,
      headerTooltip: 'Order No.',
      sortable: true,
      flex: 1,
    },
    {
      headerName: 'Date',
      field: 'createdAt',
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      tooltipValueGetter: (p) => p.value,
      headerTooltip: 'Order Date',
      sortable: true,
      width: 200,
    },
    {
      headerName: 'Order Status',
      field: 'order_status',
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      tooltipValueGetter: (p) => p.value,
      headerTooltip: 'Order Status',
      cellRenderer: OrderStatusRenderer,
      sortable: true,
      width: 200,
    },
    {
      headerName: 'Total Amount',
      field: 'total',
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      tooltipValueGetter: (p) => p.value,
      headerTooltip: 'Total Amount',
      valueFormatter: (params) => formatNumberWithCommasAndDecimal(params.value) + ' /-',
      sortable: true,
      width: 200,
    },
    {
      headerName: 'Action',
      field: 'action',
      sortable: false,
      width: 100,
      cellClass: 'actions-button-cell',
      cellRenderer: DropdownMenuBtn,
      cellRendererParams: {
        handleResponse: handleDeleteResponse,
        handleEditClick: handleEditClick,
        handleViewClick: handleViewClick,
      },
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      tooltipValueGetter: (p) => p.value,
      headerTooltip: 'Actions',
    },
  ];

  const getPurchaseOrderStatusList = async () => {
    try {
      const res = await getPurchaseOrderStatusListReq();

      const { accepted, published, rejected, draft, sent } = res.purchaseOrderStatusList;

      // Map the data to the chipData
      setChipData([
        {
          title: 'Total Orders',
          total: accepted + published + draft + sent, // Sum of accepted, published, draft, and sent
        },
        {
          title: 'Orders pending for approval',
          total: published, // Published orders
        },
        {
          title: 'Approved Orders',
          total: sent, // Sent orders
        },
        {
          title: 'Ongoing Orders',
          total: accepted, // Accepted orders
        },
      ]);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // const getAgreementData = async () => {
  //   try {
  //     const res = await getAgreement();

  //     console.log(res);
  //   } catch (error) {
  //     console.error("Error fetching user data:", error);
  //   }
  // };

  const getPurchaseOrderListData = async () => {
    try {
      const response = await getPurchaseOrderListReq();

      if (!response || !response.purchaseOrders || !Array.isArray(response.purchaseOrders)) {
        console.error('Unexpected response format:', response);
        return;
      }

      const newData = response.purchaseOrders.map((order) => ({
        order_id: order._id,
        order_number: order.purchaseOrderNumber ? order.purchaseOrderNumber : '-',
        createdAt: formatDate(order.createdAt),
        total: order.items.reduce((total, item) => total + item.unitPrice * item.quantity, 0),
        order_status: order.status,
      }));

      setRowData(newData.slice(-5));
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
    }
  };

  useEffect(() => {
    props.setBreadcrumbItems('Dashboard' , breadcrumbItems)
  }, []);

  useEffect(() => {
    getPurchaseOrderListData();
    getPurchaseOrderStatusList();
    // getAgreementData();
  }, []);

  return (
    <React.Fragment>
      {/*mimi widgets */}
      <Row>
        <Col xl="8" style={{ paddingTop: '24px' }}>
          <Miniwidget reports={chipData} />
        </Col>
        <Col xl="4">
          <Card className="agreement-card">
            <CardBody className="agreement-body">
              <div>
                <h6 className="font-size-12 mb-0">Agreement No.</h6>
                <h2 className="mb-0 font-size-20 text-black">ESL-QMUM-98712</h2>
              </div>
              <div>
                <h6 className="font-size-12 mb-0">Term</h6>
                <h2 className="mb-0 font-size-20 text-black">6 Months</h2>
              </div>
              <div>
                <h6 className="font-size-12 mb-0">Valid Until</h6>
                <h2 className="mb-0 font-size-20 text-black">13th March, 2024</h2>
              </div>
              <StyledButton color={'primary'} type="submit" className={'w-md agreement-btn'}>
                <i className={'btn-icon mdi mdi-download'}></i>
                Download Agreement
              </StyledButton>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <div className="ag-theme-quartz list-grid">
          <AgGridReact suppressRowClickSelection={true} columnDefs={columnDefs} rowData={rowData} quickFilterText={inputValue}></AgGridReact>
        </div>
        {/* <Col xl="3">
          <MonthlyEarnings />
        </Col> */}

        {/* <Col xl="6">
          Email sent
          <EmailSent />
        </Col> */}

        {/* <Col xl="6">
          <MonthlyEarnings2 />
        </Col> */}
      </Row>
      {/* <Row>

        <Col xl="4" lg="6">
          <Inbox />
        </Col>
        <Col xl="4" lg="6">
          <RecentActivity />

        </Col>
        <Col xl="4">
          <WidgetUser />

          <YearlySales />
        </Col>
      </Row>

      <Row>
        <Col xl="6">
          <LatestTransactions />
        </Col>

        <Col xl="6">
          <LatestOrders />
        </Col>
      </Row> */}
    </React.Fragment>
  )
}

export default connect(null, { setBreadcrumbItems })(Dashboard);
