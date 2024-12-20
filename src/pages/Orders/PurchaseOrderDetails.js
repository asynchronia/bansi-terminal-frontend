import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Card, CardBody, Modal, Button, CardHeader } from "reactstrap";
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
import { Cancel, CheckCircle, Print } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import Hero from "../../components/Common/Hero";
import { toast } from "react-toastify";
import { formatDate } from "../../utility/formatDate";
import { getAgreement } from "../../api";
import getPaymentTerm from "../../utility/getPaymentTerm";
import PdfComponent from "./PdfComponent";

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
  const [paymentTerms, setPaymentTerms] = useState()

  const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Purchase Orders", link: "/purchase-orders" },
    { title: "Purchase Order", link: "#" },
  ];

  const effectCalled = useRef(false);

  const statusToTextMap = {
    "draft": "Draft",
    "published": "Publish",
    "sent": "Approve",
    "accepted": "Accept",
    "rejected": "Reject",
    "declined": "Declined"
  }

  async function handlePurchaseOrderStatusChange(status) {
    const body = {
      "purchaseOrderId": id,
      "status": status
    };
    setIsButtonLoading(true);
    if (status === 'accepted') {
      try {
        const response = await convertToSalesOrderReq({ purchaseOrderId: body.purchaseOrderId });
        if(response.success){
          toast.success("Purchase order Accepted")
          setStatus(status);
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.error('Bad Request:', error);
          toast.error("Something went wrong")
          // Handle the 400 error here, e.g., show an error message to the user
        } else {
          console.error('Failed to convert to sales order', error);
          toast.error("Something went wrong")
        }
      } finally {
        setIsButtonLoading(false);
        setApproveModal(false)
      }
    } else {
      try {
        const response = await purchaseOrderStatusChangeReq(body);
        if(response.success){
          toast.success(`Purchase Order ${statusToTextMap[status]}`)
          setStatus(status);
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.error('Bad Request:', error);
          toast.error("Something went wrong")
          // Handle the 400 error here, e.g., show an error message to the user
        } else {
          console.error('Failed to change purchase order status:', error);
          toast.error("Something went wrong")
        }
      } finally {
        setIsButtonLoading(false);
        setApproveModal(false)
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
    setSelectedStatus('accepted')
    setApproveModal(true);
    //setStatus('accepted');
    //setSelectedStatus('accepted');
    //TODO: The handlePurchaseOrderStatusChange(); is taking the old value of selectedStatus
    //TODO: ADD BUTTON LOADER, IN THE BACKEND ADD ZOHO SYNC API CALL
  }

  const declinePurchaseOrder = () => {
    setSelectedStatus('declined')
    setApproveModal(true);
  }

  const handleStatusChange = (event) => {
    const newStatus = event.target.value;
    if (newStatus === 'published') {
      setPublishModal(true);
    }
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

  const getAgreementData = async (id) => {
    try {
      const data = {clientId: id}
      const res = await getAgreement(data);
      
      setPaymentTerms(res.payload.paymentTerms)
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    props.setBreadcrumbItems("Purchase Order", breadcrumbItems);
    if (!effectCalled.current) {
      getPurchaseOrderDetails();
      effectCalled.current = true;
    }
  }, []);

  useEffect(() => {
    if(orderInfo.clientId) {
      getAgreementData(orderInfo.clientId);
    }
  }, [orderInfo.clientId]);

  const options = {
    filename: "Purchase Order.pdf",
    method: "save",
    resolution: Resolution.HIGH,
    page: {
      margin: Margin.MEDIUM,
      format: "A4",
      orientation: "portrait",
    },
    canvas: {
      mimeType: "image/jpeg",
      qualityRatio: 1,
    },
    overrides: {
      pdf: {
        compress: true,
      },
      canvas: {
        useCORS: true,
      },
    },
  };

  const getTargetElement = () => document.getElementById("print-container");
  const downloadPDF = () => generatePDF(getTargetElement, options);

  return (
    <>
      <div style={{ position: "relative" }}>
        <div
          className="d-flex align-items-center gap-2"
          style={{
            position: "absolute",
            top: -50,
            right: 10,
          }}
        >
          <Modal centered toggle={() => setPublishModal(!publishModal)} isOpen={publishModal}>
            <PublishConfirm setPublishModal={setPublishModal} setStatus={setStatus} id={id} />
          </Modal>
          <Modal centered toggle={() => setApproveModal(!approveModal)} isOpen={approveModal}>
            <ApproveConfirm setApproveModal={setApproveModal} handlePurchaseOrderStatusChange={handlePurchaseOrderStatusChange} status={selectedStatus} isButtonLoading={isButtonLoading} />
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
              :
              <>
                {OrderStatusRenderer({ value: status })}
                <PdfComponent data={{orderInfo, itemsData, paymentTerms}}/>
              </>
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
                  onClick={submitPurchaseOrder}
                >
                  <CheckCircle className="me-1" />
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
                  onClick={rejectPurchaseOrder}
                >
                  <Cancel className="me-1" />
                  Reject
                </StyledButton>
              )}
            </RequirePermission>
          </RequireUserType>
          <RequireUserType userType={USER_TYPES_ENUM.ADMIN}>
            {status === 'sent' && (
              <StyledButton
                color={"success"}
                className={"w-md"}
                onClick={acceptPurchaseOrder}
              >
                <CorrectSign className="me-1" />
                Accept
              </StyledButton>
            )}
          </RequireUserType>
          <RequireUserType userType={USER_TYPES_ENUM.ADMIN}>
            {status === 'sent' && (
              <StyledButton
              color={"danger"}
              className={"w-md mx-2"}
              onClick={declinePurchaseOrder}
            >
              <Cancel className="me-1" />
              Decline
            </StyledButton>
            )}
          </RequireUserType>
        </div>
      </div >
      <div id='print-container'>
        <Card>
          <CardBody>
            <div className="card-content">
              <div className="details">
                  <h3 className="fw-bolder">
                    {orderInfo.clientName}
                  </h3>
                  <p className="m-0">
                    {orderInfo.billing?.branchName}
                  </p>
                  <p className="m-0">
                    {orderInfo.billing?.address}
                  </p>
                  <p className="m-0">{orderInfo.billing?.contact}</p>
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
            <Row className="equal-height-cards">
              <Col xl="7">
                <Card>
                  <CardBody>
                    <Row className="py-2 border-bottom">
                      <Col>Order Date</Col>
                      <Col>{formatDate(orderInfo?.createdAt)}</Col>
                    </Row>
                    <Row className="py-2 border-bottom">
                      <Col>Payment Terms</Col>
                      <Col>
                        {getPaymentTerm(paymentTerms)}
                      </Col>
                    </Row>
                    <Row className="py-2 border-bottom">
                      <Col>Sales Order No.</Col>
                      <Col>
                        {orderInfo?.salesOrderNumber ? orderInfo?.salesOrderNumber : "-"}
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col xl="5">
                <Card>
                  <CardBody className="d-flex flex-column gap-2">
                    <div style={{ flex: 1 }} className="border-bottom">
                      <p className="fw-lighter m-0">Vendor Address</p>
                      <h5 className="fw-medium text-uppercase m-0">
                        Bansi Office Solutions Private Limited
                        #1496, 19th Main Road, Opp Park Square Apartment, HSR Layout,
                        Bangalore Karnataka 560102, India
                      </h5>
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
                <Card className="mt-3" style={{ height: "fit-content" }}>
                  <CardHeader>Sales Information</CardHeader>
                  <CardBody>
                    <Row className="py-2 border-bottom">
                      <Col xl="4">Item & Description</Col>
                      <RequirePermission module={MODULES_ENUM.ORDERS} permission={PERMISSIONS_ENUM.CREATE}>
                        <Col xl="3">Rate</Col>
                      </RequirePermission>
                      <Col xl="3">Ordered</Col>
                      <RequirePermission module={MODULES_ENUM.ORDERS} permission={PERMISSIONS_ENUM.CREATE}>
                        <Col xl="2">Amount</Col>
                      </RequirePermission>
                    </Row>
                    {itemsData && itemsData.map((item, index) => (
                      <Row key={index} className="py-2 border-bottom align-items-center">
                        <Col xl="4">
                          <h6 style={{margin: 0, fontSize: '14px', paddingTop: '3px'}}>{item.itemName}</h6>
                          <span style={{margin: 0, fontSize: '12px', color: 'grey', paddingTop: '2px'}}>{item.itemDescription}</span>
                        </Col>
                        <RequirePermission module={MODULES_ENUM.ORDERS} permission={PERMISSIONS_ENUM.CREATE}>
                          <Col xl="3">
                            <h6 className="m-0">{formatNumberWithCommasAndDecimal(item.unitPrice)}</h6>
                          </Col>
                        </RequirePermission>
                        <Col xl="3">{item.quantity}&nbsp;{item.itemUnit}</Col>
                        <RequirePermission module={MODULES_ENUM.ORDERS} permission={PERMISSIONS_ENUM.CREATE}>
                          <Col xl="2">
                            <h6 className="m-0">{formatNumberWithCommasAndDecimal(item.unitPrice * item.quantity)}</h6>
                          </Col>
                        </RequirePermission>
                      </Row>
                    ))}
                  </CardBody>
                </Card>
              </Col>
              <RequirePermission module={MODULES_ENUM.ORDERS} permission={PERMISSIONS_ENUM.CREATE}>
                <Col xl="4">
                  <Card className="mt-3">
                    <CardHeader>Order Info</CardHeader>
                    <CardBody style={{ display: "flex", flexDirection: "column" }}>
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
              </RequirePermission>
            </Row>
            <Row>
            <Col xl="8">
              <Card className="mt-3">
                <CardHeader>Terms & Conditions</CardHeader>
                <CardBody>
                  {orderInfo.terms ?
                  <div style={{ whiteSpace: "pre-wrap" }}>
                    {orderInfo.terms} 
                  </div> 
                  : <span style={{color: 'grey'}}>No Terms & Conditions</span>
                  }
                </CardBody>
              </Card>
            </Col>
          </Row>
          </div>
        </Row>
      </div>
    </>
  );
};

export default connect(null, { setBreadcrumbItems })(PurchaseOrderDetails);
