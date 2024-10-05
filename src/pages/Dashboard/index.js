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
  const [clientId, setClientId] = useState('')
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
  const [agreementData, setAgreementData] = useState({
    AgreementNumber: "",
    validUntil: "",
    paymentTerms: ""
  })

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

  const formatDate = (format, dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const monthName = getMonthName(date.getMonth());
    const ordinalDay = getOrdinal(day);

    return format === "DDMMYY" ? `${day}-${month}-${year}` : `${ordinalDay} ${monthName} ${year}`;
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
    // {
    //   headerName: 'Action',
    //   field: 'action',
    //   sortable: false,
    //   width: 100,
    //   cellClass: 'actions-button-cell',
    //   cellRenderer: DropdownMenuBtn,
    //   cellRendererParams: {
    //     handleResponse: handleDeleteResponse,
    //     handleEditClick: handleEditClick,
    //     handleViewClick: handleViewClick,
    //   },
    //   suppressMenu: true,
    //   floatingFilterComponentParams: { suppressFilterButton: true },
    //   tooltipValueGetter: (p) => p.value,
    //   headerTooltip: 'Actions',
    // },
  ];

   const onRowClicked = (event) =>{
    console.log(event.data);
    // order_id
    redirectToViewPage(event.data?.order_id);
 }

  const getPurchaseOrderStatusList = async () => {
    try {
      const res = await getPurchaseOrderStatusListReq();

      const { accepted, published, rejected, draft, sent } = res.purchaseOrderStatusList;

      const acceptedValue = Number(accepted) || 0;
      const publishedValue = Number(published) || 0;
      const draftValue = Number(draft) || 0;
      const sentValue = Number(sent) || 0;
      const totalOrders = acceptedValue + publishedValue + draftValue + sentValue

      setChipData([
        {
          title: 'Total Orders',
          total: totalOrders, 
        },
        {
          title: 'Orders pending for approval',
          total: publishedValue, 
        },
        {
          title: 'Approved Orders',
          total: sentValue, 
        },
        {
          title: 'Ongoing Orders',
          total: acceptedValue,
        },
      ]);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const getAgreementData = async (id) => {
    try {
      const data = {clientId: id}
      const res = await getAgreement(data);
      
      setAgreementData({
        AgreementNumber: res.payload._id        ,
        validUntil: res.payload.validity,
        paymentTerms: res.payload.paymentTerms
      })

    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

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
        createdAt: formatDate("DDMMYY", order.createdAt),
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
    const user = JSON.parse(localStorage.getItem("user"))
    setClientId(user.clientId)
  }, []);

  useEffect(() => {
    getPurchaseOrderListData();
    getPurchaseOrderStatusList();
  }, []);

  useEffect(() => {
    getAgreementData(clientId);
  }, [clientId]);


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
                <h2 className="mb-0 font-size-20 text-black">{agreementData.AgreementNumber ? agreementData.AgreementNumber : "XXXXXXXXXXXXXXXX"}</h2>
              </div>
              <div>
                <h6 className="font-size-12 mb-0">Payment Terms</h6>
                <h2 className="mb-0 font-size-20 text-black">
                  {agreementData.paymentTerms > 0 
                  ? agreementData.paymentTerms <= 30
                  ? `${agreementData.paymentTerms} ${agreementData.paymentTerms === 1 ? 'day' : 'days'}`
                  : agreementData.paymentTerms <= 60
                  ? `1 month`
                  : `${Math.floor(agreementData.paymentTerms / 30)} months` : "0 days"}
                </h2>
              </div>
              <div>
                <h6 className="font-size-12 mb-0">Valid Until</h6>
                <h2 className="mb-0 font-size-20 text-black">{agreementData.validUntil ? formatDate("DayMMYY",agreementData.validUntil): "Day/MM/YYYY"}</h2>
              </div>
              <StyledButton color={'primary'} type="submit" className={'w-md agreement-btn'} disabled={!agreementData.AgreementNumber || !agreementData.validUntil || !agreementData.paymentTerms}>
                <i className={'btn-icon mdi mdi-download'}></i>
                Download Agreement
              </StyledButton>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <div className="ag-theme-quartz list-grid">
          <AgGridReact suppressRowClickSelection={true} columnDefs={columnDefs} rowData={rowData} quickFilterText={inputValue} onRowClicked={onRowClicked}></AgGridReact>
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
