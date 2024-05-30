import React, { useState,useEffect,useRef } from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import { ToastContainer } from "react-toastify";
import { formatNumberWithCommasAndDecimal } from "../Invoices/invoiceUtil";
import StyledButton from "../../components/Common/StyledButton";
import { ReactComponent as CorrectSign } from "../../assets/images/svg/correct-sign.svg";
import { ReactComponent as EditSign } from "../../assets/images/svg/edit-button.svg";
import { setBreadcrumbItems } from "../../store/Breadcrumb/actions";
import { connect } from "react-redux";
import { getPurchaseOrderDetailsReq } from "../../service/purchaseService";


const PurchaseOrderDetails = (props) => {
  const [subTotal, setSubTotal] = useState(0);
  const [gstTotal, setGstTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  
  const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Purchase Order", link: "#" },
    { title: "Purchase Order" + {}, link: "#" },
  ];
  
  const data = {
    id : "66452914796a60ed23ca91df",
  }

  const effectCalled = useRef(false);

  const getPurchaseOrderDetails=async ()=>{
    const response = await getPurchaseOrderDetailsReq(data.id);
    console.log(response);
  }

  useEffect(() => {
    props.setBreadcrumbItems("Order "+{}, breadcrumbItems);
    if (!effectCalled.current) {
      getPurchaseOrderDetails();
      effectCalled.current = true;
    }
  }, []);

  const Items = {
    Item1: {
      name: "PUN - Printed Register 8q",
      rate: "₹ 0.00",
      ordered: "1 Nos",
      amount: "₹ 0.00",
    },
    Item2: {
      name: "PUN - Printed Register 8q",
      rate: "₹ 0.00",
      ordered: "1 Nos",
      amount: "₹ 0.00",
    },
    Item3: {
      name: "PUN - Printed Register 8q",
      rate: "₹ 0.00",
      ordered: "1 Nos",
      amount: "₹ 0.00",
    },
    Item4: {
      name: "PUN - Printed Register 8q",
      rate: "₹ 0.00",
      ordered: "1 Nos",
      amount: "₹ 0.00",
    },
    Item5: {
      name: "PUN - Printed Register 8q",
      rate: "₹ 0.00",
      ordered: "1 Nos",
      amount: "₹ 0.00",
    },
  };

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
          }}
        >
          <StyledButton
            className={"w-md mx-2 bg-white text-black border-0"}
            isLoading={isButtonLoading}
          >
            <EditSign className="me-1" />
            Edit
          </StyledButton>
          <select className="form-select focus-width" name="status">
            <option value="draft">Draft</option>
            <option value="active">Published</option>
          </select>
          <StyledButton
            color={"success"}
            className={"w-md mx-2"}
            isLoading={isButtonLoading}
          >
            <CorrectSign className="me-1" />
            Approve
          </StyledButton>
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
              <h3>
                <br />
                <span>Bansi Office Solutions Private Limited</span>
              </h3>
              #1496, 19th Main Road, Opp Park Square Apartment, HSR Layout,
              Bangalore Karnataka 560102, India
              <br />
              GSTIN: 29AAJCB1807A1Z3 CIN:U74999KA2020PTC137142
              <br />
              MSME No : UDYAM-KR-03-0065095
              <br />
              Web: www.willsmeet.com, Email:sales@willsmeet.com
              <br />
            </div>
            <div>
              <span className="purchase-order">Purchase Order</span>
              <br />
              <span className="purchase-order-no">PO #BLR/S0/11742</span>
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
                  <Row>
                    <div className="d-flex align-items-md-center">
                      <Col>
                        <p className="mt-2"> Order Date </p>
                      </Col>
                      <Col>
                        <h6 className="justify-content-start">19/03/2024</h6>
                      </Col>
                      <hr />
                    </div>
                  </Row>
                  <Row>
                    <div className="d-flex justify-content-between align-items-md-center">
                      <Col>
                        <p className="mt-2"> Payment Terms </p>
                      </Col>
                      <Col>
                        <h6 className="justify-content-start">Net 30</h6>
                      </Col>
                      <hr />
                    </div>
                  </Row>
                  <Row>
                    <div className="d-flex justify-content-between align-items-md-center">
                      <Col>
                        <p className="mt-2"> Delivery Method </p>
                      </Col>
                      <Col>
                        <h6 className="justify-content-start">By Vehicle</h6>
                      </Col>
                      <hr />
                    </div>
                  </Row>
                  <Row>
                    <div className="d-flex justify-content-between align-items-md-center">
                      <Col>
                        <p className="mt-2"> PO NO </p>
                      </Col>
                      <Col>
                        <h6 className="justify-content-start">From Office</h6>
                      </Col>
                      <hr />
                    </div>
                  </Row>
                  <Row>
                    <div className="d-flex justify-content-between align-items-md-center">
                      <Col>
                        <p className="mt-2"> Acknowledgement Uploaded </p>
                      </Col>
                      <Col>
                        <h6 className="justify-content-start">No</h6>
                      </Col>
                    </div>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col xl="5">
              <Card>
                <CardBody>
                  <span>
                    <h6>Billing Address</h6>
                  </span>
                  <span>
                    <p className="m-0">IP EXPRESS CARGO</p>
                  </span>
                  <span>
                    <p className="m-0">
                      SHOP NO:22 & 23, CTS NO: 1184, PLOT NO:559,
                    </p>
                  </span>
                  <span>
                    <p className="m-0">
                      FIRST FLOOR, SHRINATH PLAZA, SHIVAJI NAGAR,
                    </p>
                  </span>
                  <span>
                    <p className="m-0">PUNE, MAHARASHTRA,</p>
                  </span>
                  <span>
                    <p>INDIA - 412207</p>
                  </span>

                  <span>
                    <h6>Shipping Address</h6>
                  </span>
                  <span>
                    <p className="m-0">IP EXPRESS CARGO</p>
                  </span>
                  <span>
                    <p className="m-0">JADHAV WAREHOUSE, WAGHOLI</p>
                  </span>
                  <span>
                    <p className="m-0">PUNE, MAHARASHTRA,</p>
                  </span>
                  <span>
                    <p className="m-0">INDIA - 412207</p>
                  </span>
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
                  <Row className="mb-4">
                    <Col>Item & Description</Col>
                    <Col>Rate</Col>
                    <Col>Ordered</Col>
                    <Col>Amount</Col>
                  </Row>

                  {Object.keys(Items).map((key) => {
                    const item = Items[key];
                    return (
                      <Row key={key} className="mb-4">
                        <Col>
                          <span>{item.name}</span>
                          <br />
                          {/* <span>{item.name}</span>{" "} */}
                        </Col>
                        <Col>
                          <h6>{item.rate}</h6>
                        </Col>
                        <Col>{item.ordered}</Col>
                        <Col>
                          {" "}
                          <h6>{item.amount}</h6>
                        </Col>
                      </Row>
                    );
                  })}
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
                      <span>{formatNumberWithCommasAndDecimal(subTotal)}</span>
                    </h5>
                    <div style={{ fontSize: "0.7rem" }}>
                      Total Quantity: {selectedItems.length}
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
                      <span>{formatNumberWithCommasAndDecimal(gstTotal)}</span>
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
                      <span>{formatNumberWithCommasAndDecimal(total)}</span>
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
