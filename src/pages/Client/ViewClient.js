import React, { useEffect, useState } from "react";
import { setBreadcrumbItems } from "../../store/actions";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import Img404 from "../../assets/images/Img404.png";
import { Card, CardBody, CardHeader, Col, Modal, Row, Table } from "reactstrap";
import { Avatar } from "@mui/material";
import Agreement from "../../components/CustomComponents/Agreement";
const ViewClient = (props) => {
  const [clientData, setClientData] = useState({});
  const { id } = useParams();
  const breadcrumbItems = [
    { title: "Dashboard", link: "#" },
    { title: "Client", link: "/client" },
    { title: "View", link: "/client/:id" },
  ];
  const [openModal, setOpenModal]= useState(false);

  const handleModalToggle=()=>{
    setOpenModal(!openModal);
    removeBodyCss()
  }
  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }

  useEffect(() => {
    searchClient(id);
  }, []);

  const searchClient = async (id) => {
    const url = `http://localhost:3000/api/clients/get`;
    const data = { _id: id };
    try {
      const res = await axios.post(url, data);

      setClientData(res?.data?.payload?.client);
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(clientData);
  useEffect(() => {
    props.setBreadcrumbItems("EditClient", breadcrumbItems);
  });

  return (
    <div style={{ position: "relative" }}>
    <Modal size="lg" isOpen={openModal} toggle={()=>{handleModalToggle()}}>
      <Agreement setOpenModal={setOpenModal}/>
    </Modal>
      <div
        style={{
          position: "absolute",
          top: -50,
          right: 10,
          display: "flex",
        }}
      >
        <select className="form-select focus-width" name="status">
          <option value="active">Published</option>
          <option value="draft">Draft</option>
        </select>
        <button type="submit" className="btn btn-primary w-xl mx-3">
          Submit
        </button>
      </div>
      <Row>
        <Col xs="8">
          <Card style={{ border: "2px solid #7a6ebe" }}>
            <CardBody>
              <h4 className="card-title">Agreement</h4>
              <CardHeader className="mt-3">
                <Row>
                  <Col xs="6">Product name</Col>
                  <Col xs="3">SKU</Col>
                  <Col xs="3">Cost</Col>
                </Row>
              </CardHeader>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                }}
              >
                <img
                  src={Img404}
                  height={"300px"}
                  width={"300px"}
                  style={{ margin: "auto" }}
                  alt="404"
                ></img>
                <label className="text-label">No Agreement found</label>
                <div className="mt-1">
                  <button
                    type="button"
                    className="btn btn-primary waves-effect waves-light "
                    onClick={()=>{
                      setOpenModal(true);
                    }}
                  >
                    <i className=" mdi mdi-18px mdi-plus"></i>
                    <label className="card-title mx-1">
                      Create New Agreement
                    </label>
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col xs="4">
          <Card>
            <CardBody>
              <h4 className="card-title">Client Details</h4>
              <hr></hr>
              <div className="mt-3" style={{ display: "flex", gap: "20px" }}>
                <Avatar variant="rounded" sx={{ bgcolor: "#7a6ebe" }}>
                  {clientData?.name?.match(/\b\w/g).join("")}
                </Avatar>
                <h4 className="my-auto">{clientData?.name}</h4>
              </div>

              <div className="mt-3">
                <Row>
                  <Col xs="4">
                    <p>Email:</p>
                  </Col>
                  <Col xs="8">
                    <p>{clientData?.email}</p>
                  </Col>
                </Row>
              </div>
              <div>
                <Row>
                  <Col xs="4">
                    {" "}
                    <p>Contact:</p>
                  </Col>
                  <Col xs="8">
                    <p>{clientData?.contact}</p>
                  </Col>
                </Row>
              </div>
              <div>
                <Row>
                  <Col xs="4">
                    {" "}
                    <p>Type:</p>
                  </Col>
                  <Col xs="8">
                    {" "}
                    <p>{clientData?.clientType}</p>
                  </Col>
                </Row>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h4 className="card-title">Payment Details</h4>
              <hr></hr>
              <div className="mt-3">
                <Row>
                  <Col xs="4">
                    <p>Account Name:</p>
                  </Col>
                  <Col xs="8">
                    <p>{clientData?.bankAccountName}</p>
                  </Col>
                </Row>
              </div>
              <div>
                <Row>
                  <Col xs="4">
                    <p>Account Number:</p>
                  </Col>
                  <Col xs="8">
                    <p>
                      **********
                      {
                        clientData?.bankAccountNumber?
                        clientData?.bankAccountNumber[
                          clientData?.bankAccountNumber.length - 3
                        ]:null
                      }
                      {
                        clientData?.bankAccountNumber? clientData?.bankAccountNumber[
                          clientData?.bankAccountNumber.length - 2
                        ]:null
                      }
                      {
                        clientData?.bankAccountNumber?
                        clientData?.bankAccountNumber[
                          clientData?.bankAccountNumber?.length - 1
                        ]:null
                      }
                    </p>
                  </Col>
                </Row>
              </div>
              <div >
                <Row>
                  <Col xs="4">
                    <p>IFSC:</p>
                  </Col>
                  <Col xs="8">
                    <p>{clientData?.ifscCode}</p>
                  </Col>
                </Row>
              </div>
              <div>
                <Row>
                  <Col xs="4">
                    <p>GST:</p>
                  </Col>
                  <Col xs="8">
                    <p>{clientData?.gstin}</p>
                  </Col>
                </Row>
              </div>
              <div className="mt-3">
                <Row>
                  <Col xs="4">
                    <p>PAN:</p>
                  </Col>
                  <Col xs="8">
                    <p>{clientData?.pan}</p>
                  </Col>
                </Row>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default connect(null, { setBreadcrumbItems })(ViewClient);
