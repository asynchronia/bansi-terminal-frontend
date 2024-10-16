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
import { USER_TYPES_ENUM } from "../../utility/constants";
import RequireUserType from "../../routes/middleware/requireUserType";
import { formatDate } from "../../utility/formatDate";
import { getTaxesReq } from "../../service/itemService";
import jsPDF from "jspdf";
import { getClientWithIdReq } from "../../service/clientService";

const Dashboard = (props) => {
  document.title = "Willsmeet Portal";
  let navigate = useNavigate();

  const breadcrumbItems = [{ title: "Dashboard", link: "#" }];

  const user = JSON.parse(localStorage.getItem("user"))
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
  const [agreementData, setAgreementData] = useState({
    AgreementNumber: "",
    validUntil: "",
    paymentTerms: ""
  })
  const [allTaxes, setAllTaxes] = useState([]);
  const [displayTableData, setDisplayTableData] = useState([]);
  const [clientData, setClientData] = useState({});

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

  const ordinalFormatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const monthName = getMonthName(date.getMonth());
    const ordinalDay = getOrdinal(date.getDate());

    return `${ordinalDay} ${monthName} ${year}`;
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

  const searchClient = async (id) => {
    try {
      const data = { _id: id };
      const res = await getClientWithIdReq(data);

      setClientData(res.payload?.client);
    } catch (error) {
      console.log(error);
    }
  };

  
  const searchAllTaxes = async (part) => {
    try {
      const response = await getTaxesReq();
      let data = await response;
      setAllTaxes(data?.payload?.taxes);
      if (part === "agreement") {
        return data?.payload?.taxes;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAgreementData = async (id) => {
    try {
      const data = {clientId: id}
      const res = await getAgreement(data);
      let taxes = await searchAllTaxes("agreement");
      
      setAgreementData({
        AgreementNumber: res.payload._id        ,
        validUntil: res.payload.validity,
        paymentTerms: res.payload.paymentTerms
      })

      let array;

      array = res?.payload?.items?.flatMap((item) => {
        return item.variants.map((variant) => {
          const attributes = variant.variant.attributes;
          let taxName;
          for (let i = 0; i < taxes.length; i++) {
            if (taxes[i]._id === item.item.taxes[0]) {
              taxName = taxes[i].name;
            }
          }
          return {
            id: variant.variant._id,
            itemId: variant.variant.itemId,
            title: item.item.title,
            sku: variant.variant.sku,
            sellingPrice: variant.price,
            attributes: attributes,
            tax: taxName,
            unit: item.item.itemUnit,
            type: item.item.itemType,
          };
        });
      });

      setDisplayTableData(array);
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
    getPurchaseOrderListData();
    getPurchaseOrderStatusList();
    searchClient(user.clientId)
  }, [user.clientId]);

  useEffect(() => {
    if(user.userType === "client") {
      getAgreementData(user.clientId);
    }
  }, [user.clientId, user.userType]);

  const downloadPDF = () => {
    const data = [...displayTableData];
    const doc = new jsPDF();
  
    // Load the image and add it to the PDF after it is loaded
    const img = new Image();
    img.src = require("../../assets/images/Willsmeet-Logo.png"); // Ensure correct path in your environment
  
    img.onload = function() {
      // Add the image to the PDF (x, y, width, height)
      doc.addImage(img, 'PNG', 20, 10, 40, 20); // Adjust position and size as needed
  
      // Add company details aligned with the image
      const textStartX = 80; // Align text with the right side of the image
      const startY = 10; // Ensure this is aligned with the image vertically
  
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Bansi Office Solutions Private Limited", textStartX, startY);
  
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("#1496, 19th Main Road, Opp Park Square Apartment,", textStartX, startY + 6);
      doc.text("HSR Layout, Bangalore Karnataka 560102, India", textStartX, startY + 12);
      doc.text("GSTIN: 29AAJCB1807A1Z3 CIN: U74999KA2020PTC137142", textStartX, startY + 18);
      doc.text("MSME No : UDYAM-KR-03-0065095", textStartX, startY + 24);
      doc.text("Web: www.willsmeet.com, Email: sales@willsmeet.com", textStartX, startY + 30);
  
      const clientTableStartY = startY + 40;
  
      // Client Details Table
      const clientDetails = [
        ["Name:", clientData.name],
        ["Email:", clientData.email],
        ["Contact", clientData.contact],
        ["Agreement Validity:", formatDate(agreementData.validUntil)],
        ["Payment Terms:", `${agreementData.paymentTerms} Days`]
      ];
  
      doc.autoTable({
        head: [],
        body: clientDetails,
        theme: 'plain',
        styles: {
          fontSize: 10,
        },
        startY: clientTableStartY,
        columnWidths: {
          cellWidth: 30
        }
      });
  
      // Add S.No. column to table and remove id column
      const tableColumn = ['S.No.', ...Object.keys(data[0]).filter((key) => key !== 'id')];
      const tableRows = data.map((obj, index) => [
        index + 1, // Set the row number sequence
        ...Object.values(obj).filter((_, keyIndex) => Object.keys(obj)[keyIndex] !== 'id') // Remove 'id' from the data
      ]);
  
      // Calculate column widths based on the percentages you provided
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      const percentageWidths = [7, 20, 20, 15, 10, 10, 10, 7, 10];
      const columnWidths = {};
      percentageWidths.forEach((percentage, index) => {
        columnWidths[index] = { cellWidth: (percentage / 100) * contentWidth };
      });

      // Items Info Table
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        styles: {
          fontSize: 10,
        },
        margin: { top: 10 },
        startY: doc.autoTable.previous.finalY + 10,
        columnStyles: columnWidths,
        headStyles: {
          fillColor: '#0053FF', 
        },
      });
      doc.save("Agreement.pdf");
    };
  };

  return (
    <React.Fragment>
      {/*mimi widgets */}
      <Row>
        <RequireUserType userType={USER_TYPES_ENUM.ADMIN}>
          <Col xl={"12"}>
            <Miniwidget reports={chipData} />
          </Col>
        </RequireUserType>
        <RequireUserType userType={USER_TYPES_ENUM.CLIENT}>
          <Col xl={"8"}>
              <Miniwidget reports={chipData} />
          </Col>
          <Col xl="4">
            <Card className="agreement-card">
              <CardBody className="agreement-body">
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
                  <h2 className="mb-0 font-size-20 text-black">{agreementData.validUntil ? ordinalFormatDate(agreementData.validUntil): "Day/MM/YYYY"}</h2>
                </div>
                <StyledButton color={'primary'} onClick={downloadPDF} type="button" className={'w-md agreement-btn'} disabled={!agreementData.validUntil || !agreementData.paymentTerms}>
                  <i className={'btn-icon mdi mdi-download'}></i>
                  Download Agreement
                </StyledButton>
              </CardBody>
            </Card>
          </Col>
        </RequireUserType>
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
