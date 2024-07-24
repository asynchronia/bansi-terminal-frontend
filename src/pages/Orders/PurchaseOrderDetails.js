import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Card, CardBody, Modal } from "reactstrap";
import { ToastContainer } from "react-toastify";
import { formatNumberWithCommasAndDecimal } from "../Invoices/invoiceUtil";
import StyledButton from "../../components/Common/StyledButton";
import { ReactComponent as CorrectSign } from "../../assets/images/svg/correct-sign.svg";
import { ReactComponent as Delete } from "../../assets/images/svg/delete-button.svg";
import { setBreadcrumbItems } from "../../store/Breadcrumb/actions";
import { connect } from "react-redux";
import { convertToSalesOrderReq, getPurchaseOrderDetailsReq, purchaseOrderStatusChangeReq } from "../../service/purchaseService";
import { Link, useParams } from "react-router-dom";
import PublishConfirm from "../../components/CustomComponents/PublishConfirm";
import ApproveConfirm from "../../components/CustomComponents/ApproveConfirm";
import OrderStatusRenderer from "./OrderStatusRenderer";
import RequireUserType from "../../routes/middleware/requireUserType";
import { MODULES_ENUM, PERMISSIONS_ENUM, USER_TYPES_ENUM } from "../../utility/constants";
import RequirePermission from "../../routes/middleware/requirePermission";
import generatePDF, { Resolution, Margin, Options } from "react-to-pdf";

const PurchaseOrderDetails = (props) => {
  const { id } = useParams();
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [itemsData, setItemsData] = useState([]);
  const [orderInfo, setOrderInfo] = useState({});
  const [status, setStatus] = useState("");
  const [publishModal, setPublishModal] = useState(false);
  const [approveModal, setApproveModal] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("published");

  const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Purchase Order", link: "#" },
    { title: "Purchase Order", link: "#" },
  ];

  const effectCalled = useRef(false);

  async function handlePurchaseOrderStatusChange(status) {
    const body = {
      "purchaseOrderId": id,
      "status": status
    };
    setIsButtonLoading(true);
    if (status === 'accepted') {
      try {
        const response = await convertToSalesOrderReq({ purchaseOrderId: body.purchaseOrderId });
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.error('Bad Request:', error);
          // Handle the 400 error here, e.g., show an error message to the user
        } else {
          console.error('Failed to convert to sales order', error);
        }
      } finally {
        setIsButtonLoading(false);
        setStatus(status);
      }
    } else {
      try {
        const response = await purchaseOrderStatusChangeReq(body);
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.error('Bad Request:', error);
          // Handle the 400 error here, e.g., show an error message to the user
        } else {
          console.error('Failed to change purchase order status:', error);
        }
      } finally {
        setIsButtonLoading(false);
        setStatus(status);
      }
    }
  }

  const submitPurchaseOrder = () => {
    setSelectedStatus('sent');
    setApproveModal(true);
  }

  const rejectPurchaseOrder = () => {
    setSelectedStatus('rejected');
    setApproveModal(true);
    console.log("PURCHASE ORDER REJECTED")
  }

  const acceptPurchaseOrder = () => {
    //setSelectedStatus('accepted')
    handlePurchaseOrderStatusChange('accepted');
    //setStatus('accepted');
    //setSelectedStatus('accepted');
    //TODO: The handlePurchaseOrderStatusChange(); is taking the old value of selectedStatus
    //TODO: ADD BUTTON LOADER, IN THE BACKEND ADD ZOHO SYNC API CALL
  }

  const handleStatusChange = (event) => {
    const newStatus = event.target.value;
    if (newStatus === 'published') {
      setPublishModal(true);
    }
    setStatus(newStatus);
  };

  const getPurchaseOrderDetails = async () => {
    const response = await getPurchaseOrderDetailsReq(id);
    const purchaseOrder = response?.purchaseOrder;

    setItemsData(purchaseOrder?.items);
    setOrderInfo(purchaseOrder);
    setStatus(purchaseOrder?.status);
    if (purchaseOrder?.status !== 'draft') {
      setIsDisabled(true);
    }
    else {
      setIsDisabled(false);
    }


    let subTotal = 0;
    let totalQuantity = 0;
    let gstTotal = 0;

    purchaseOrder.items.forEach((item) => {
      subTotal += item.unitPrice * item.quantity;
      totalQuantity += item.quantity;
      item.taxes.forEach((tax) => {
        gstTotal += (item.unitPrice * item.quantity * tax.taxPercentage) / 100;
      });
    });

    const total = subTotal + gstTotal;

    setOrderInfo({
      ...purchaseOrder,
      subTotal,
      totalQuantity,
      gstTotal,
      total,
    });
  };

  useEffect(() => {
    props.setBreadcrumbItems("Purchase Order", breadcrumbItems);
    if (!effectCalled.current) {
      getPurchaseOrderDetails();
      effectCalled.current = true;
    }
  }, []);

  const options: Options = {
    filename: "invoice.pdf",
    method: "save",
    // default is Resolution.MEDIUM = 3, which should be enough, higher values
    // increases the image quality but also the size of the PDF, so be careful
    // using values higher than 10 when having multiple pages generated, it
    // might cause the page to crash or hang.
    resolution: Resolution.MEDIUM,
    page: {
      // margin is in MM, default is Margin.NONE = 0
      margin: Margin.MEDIUM,
      // default is 'A4'
      format: "A4",
      // default is 'portrait'
      orientation: "portrait",
    },
    canvas: {
      // default is 'image/jpeg' for better size performance
      mimeType: "image/jpeg",
      qualityRatio: 1,
    },
    // Customize any value passed to the jsPDF instance and html2canvas
    // function. You probably will not need this and things can break,
    // so use with caution.
    overrides: {
      // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
      pdf: {
        compress: true,
      },
      // see https://html2canvas.hertzen.com/configuration for more options
      canvas: {
        useCORS: true,
      },
    },
  };

  const getTargetElement = () => document.getElementById("invoice-container");
  const downloadPDF = () => generatePDF(getTargetElement, options);

  return (
    <>
      <div style={{ position: "relative" }}>
        <ToastContainer position="top-center" theme="colored" />
        <div
          style={{
            position: "absolute",
            top: -50,
            right: 10,
            display: "flex",
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <Modal size="m" isOpen={publishModal}>
            <PublishConfirm setPublishModal={setPublishModal} setStatus={setStatus} />
          </Modal>
          <Modal size="m" isOpen={approveModal}>
            <ApproveConfirm setApproveModal={setApproveModal} handlePurchaseOrderStatusChange={handlePurchaseOrderStatusChange} status={selectedStatus} />
          </Modal>
          {
            status === 'draft' ? (
              <>
                <select
                  className="form-select focus-width"
                  name="status"
                  disabled={isDisabled}
                  value={status} // Bind status state to select element
                  onChange={handleStatusChange} // Update status on change
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
                <Link to='edit' className="w-md btn btn-primary">Edit</Link>
              </>)
              : OrderStatusRenderer({ value: status })
            // : (<Typography variant="body1" component="span">
            //   <strong>Status:</strong> {status}
            // </Typography>)
          }
          <RequireUserType userType={USER_TYPES_ENUM.CLIENT}>
            <RequirePermission module={MODULES_ENUM.ORDERS} permission={PERMISSIONS_ENUM.CREATE}>
              {status === 'published' && (
                <StyledButton
                  color={"success"}
                  className={"w-md mx-2"}
                  isLoading={isButtonLoading}
                  onClick={submitPurchaseOrder}
                >
                  <CorrectSign className="me-1" />
                  Approve
                </StyledButton>
              )}
            </RequirePermission>
          </RequireUserType>
          <RequireUserType userType={USER_TYPES_ENUM.CLIENT}>
            <RequirePermission module={MODULES_ENUM.ORDERS} permission={PERMISSIONS_ENUM.CREATE}>
              {status === 'published' && (
                  <StyledButton
                    color={"danger"}
                    className={"w-md mx-2"}
                    isLoading={isButtonLoading}
                    onClick={rejectPurchaseOrder}
                  >
                    <Delete className="me-1" />
                    Reject
                  </StyledButton>
                )}
            </RequirePermission>
          </RequireUserType>
          <RequireUserType userType={USER_TYPES_ENUM.ADMIN}>
            {status === 'sent' && (
              <StyledButton
                color={"success"}
                className={"w-md mx-2"}
                isLoading={isButtonLoading}
                onClick={acceptPurchaseOrder}
              >
                <CorrectSign className="me-1" />
                Accept
              </StyledButton>
            )}
          </RequireUserType>
        </div>
      </div>
      <Card>
        <CardBody>
          <div className="card-content">
            <div className="image-container">
              <img
                src={require("../../assets/images/Willsmeet-Logo.png")}
                alt="Company Logo"
                className="card-image"
              />
            </div>
            <div className="details">
              <h3 className="fw-bolder">Bansi Office Solutions Private Limited</h3>
              <p className="m-0">#1496, 19th Main Road, Opp Park Square Apartment, HSR Layout, Bangalore Karnataka 560102, India</p>
              <p className="m-0">GSTIN: 29AAJCB1807A1Z3 CIN:U74999KA2020PTC137142</p>
              <p className="m-0">MSME No : UDYAM-KR-03-0065095</p>
              <p className="m-0">Web: www.willsmeet.com, Email:sales@willsmeet.com</p>
            </div>
            <div>
              <span className="purchase-order">Purchase Order</span>
              <br />
              <span className="purchase-order-no">{orderInfo.purchaseOrderNumber}</span>
            </div>
          </div>
        </CardBody>
      </Card>

      <Row className="mb-3">
        <div style={{ position: "relative" }}>
          <ToastContainer position="top-center" theme="colored" />
          <Row className="equal-height-cards">
            <Col xl="7">
              <Card>
                <CardBody>
                  <Row className="py-2 border-bottom">
                    <Col>Order Date</Col>
                    <Col>{new Date(orderInfo?.createdAt).toLocaleDateString()}</Col>
                  </Row>
                  <Row className="py-2 border-bottom">
                    <Col>Payment Terms</Col>
                    <Col></Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col xl="5">
              <Card>
                <CardBody className="d-flex flex-column gap-2">
                  <div style={{ flex: 1 }} className="border-bottom">
                    <p className="fw-lighter m-0">Billing Address</p>
                    <h5 className="fw-medium text-uppercase m-0">{orderInfo.billing?.address}</h5>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="fw-lighter m-0">Shipping Address</p>
                    <h5 className="fw-medium text-uppercase m-0">{orderInfo.shipping?.address}</h5>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl="8">
              <Card className="mt-3" style={{ height: "100%" }}>
                <CardBody>
                  <div
                    className="mb-3"
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <h4 className="card-title mt-1">Sales Information</h4>
                  </div>
                  <Row className="py-2 border-bottom">
                    <Col xl="4">Item & Description</Col>
                    <Col xl="3">Rate</Col>
                    <Col xl="3">Ordered</Col>
                    <Col xl="2">Amount</Col>
                  </Row>
                  {itemsData && itemsData.map((item, index) => (
                    <Row key={index} className="py-2 border-bottom align-items-center">
                      <Col xl="4">
                        <h6 className="m-0">{item.itemName}</h6>
                        <span>{item.itemDescription}</span>
                      </Col>
                      <Col xl="3">
                        <h6 className="m-0">{formatNumberWithCommasAndDecimal(item.unitPrice)}</h6>
                      </Col>
                      <Col xl="3">{item.quantity} Nos</Col>
                      <Col xl="2">
                        <h6 className="m-0">{formatNumberWithCommasAndDecimal(item.unitPrice * item.quantity)}</h6>
                      </Col>
                    </Row>
                  ))}
                </CardBody>
              </Card>
            </Col>
            <Col xl="4">
              <Card className="mt-3">
                <CardBody style={{ display: "flex", flexDirection: "column" }}>
                  <h4 className="card-title">Order Info</h4>
                  <hr />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <h5
                      className="mb-0"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Sub Total :</span>
                      <span>{formatNumberWithCommasAndDecimal(orderInfo.subTotal)}</span>
                    </h5>
                    <div style={{ fontSize: "0.7rem" }}>
                      Total Quantity: {orderInfo.totalQuantity}
                    </div>
                    <hr />
                    <h5
                      className="mb-0"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>GST :</span>
                      <span>{formatNumberWithCommasAndDecimal(orderInfo.gstTotal)}</span>
                    </h5>
                    <hr />
                    <h5
                      className="mb-0"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Total :</span>
                      <span>{formatNumberWithCommasAndDecimal(orderInfo.total)}</span>
                    </h5>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </Row>
    </>
  );
};

export default connect(null, { setBreadcrumbItems })(PurchaseOrderDetails);
