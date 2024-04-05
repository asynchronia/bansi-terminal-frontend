import React, { useEffect, useState } from "react";
import { setBreadcrumbItems } from "../../store/actions";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";

import Img404 from "../../assets/images/Img404.png";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Modal,
  Row,

} from "reactstrap";
import { Avatar, CircularProgress } from "@mui/material";
import Agreement from "../../components/CustomComponents/Agreement";
import AgreementTable from "../../components/CustomComponents/AgreementTable";
import { ToastContainer, toast } from "react-toastify";
import {
  createAgreementReq,
  getAgreementReq,
  getClientWithIdReq,
} from "../../service/clientService";
import AddBranch from "../../components/CustomComponents/AddBranch";
import BranchData from "../../components/CustomComponents/BranchData";
import UserData from "../../components/CustomComponents/UserData";
import { createBranchReq } from "../../service/branchService";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { signinReq } from "../../service/authService";

const ViewClient = (props) => {
  const [clientData, setClientData] = useState({});
  const [agreementData, setAgreementData] = useState([]);
  const [displayTableData, setDisplayTableData] = useState([]);
  const [agreementAvailable, setAgreementAvailable] = useState({
    loading: true,
    value: false,
  });
  const [openModal, setOpenModal] = useState({
    agreement: false,
    branch: false,
    user: false,
  });
  const { id } = useParams();

  const [seletedData, setSelectedData] = useState({
    branch: true,
    user: false,
  });

  const notify = (type, message) => {
    if (type === "Error") {
      toast.error(message, {
        position: "top-center",
        theme: "colored",
      });
    } else {
      toast.success(message, {
        position: "top-center",
        theme: "colored",
      });
    }
    setTimeout(() => {
      window.location.reload();
    }, [5000]);
  };



  const getAgreement = async (id) => {
    try {
      const data = { clientId: id };
      const res = await getAgreementReq(data);

      let array = [];

      if (res?.payload?.items) {
        array = res?.payload?.items?.flatMap((item) => {
          return item.variants.map((variant) => {
            return {
              id: variant.variant._id,
              itemId: variant.variant.itemId,
              title: item.item.title,
              sku: variant.variant.sku,
              costPrice: variant.variant.costPrice,
              sellingPrice: variant.variant.sellingPrice,
            };
          });
        });

        const items = res.payload.items;

        // Iterate over items and their variants
        for (const item of items) {
          const {
            item: { _id: itemId },
            variants,
          } = item;

          for (const variantItem of variants) {
            const {
              variant: { _id: variantId, sellingPrice: price },
            } = variantItem;

            // Wait for handleAddToAgreement to complete
            await handleAddToAgreement(itemId, variantId, price);
          }
        }
      }

      if (array.length > 0) {
        setDisplayTableData(array);
        setAgreementAvailable({ loading: false, value: true });
      } else {
        setAgreementAvailable({ loading: false, value: false });
      }
    } catch (error) {
      if (error === 404) {
        setAgreementAvailable({ loading: false, value: false });;
      } else {
        setAgreementAvailable({ loading: false, value: false });
      }
      
    }
  };

  const handleAddToAgreement = (itemId, variantId, price) => {
    const itemIndex = agreementData.findIndex((item) => item.item === itemId);

    if (itemIndex === -1) {
      // If itemId doesn't exist, create a new object and add it to agreementArray
      setAgreementData((prevArray) => [
        ...prevArray,
        {
          item: itemId,
          variants: [
            {
              variant: variantId,
              price: price,
            },
          ],
        },
      ]);
    } else {
      const variantIndex = agreementData[itemIndex].variants.findIndex(
        (variant) => variant.variant === variantId
      );

      if (variantIndex === -1) {
        // If variantId doesn't exist, add it to variants array
        setAgreementData((prevArray) => {
          const newArray = [...prevArray];
          newArray[itemIndex].variants.push({
            variant: variantId,
            price: price,
          });
          return newArray;
        });
      }
    }
  };

  const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Client", link: "/client" },
    { title: "View", link: "/client/:id" },
  ];

  const handleSubmitAgreement = async () => {
    try {
      let values = {
        clientId: id,
        items: [...agreementData],
      };

      const response = await createAgreementReq(values);
      if (response.success === true) {
        notify("Success", response.message);
      } else {
        notify("Error", response.message);
      }
    } catch (error) {
      notify("Error", error.message);
    }
  };

  const handleSubmitBranch = async (data) => {
    try {
      const response = await createBranchReq(data);
      if (response.success === true) {
        notify("Success", response.message);
      } else {
        notify("Error", response.message);
      }
    } catch (error) {
      notify("Error", error.message);
    }
  };
  const handleSubmitUser = async (data) => {
    try {
      const response = await signinReq(data);
      if (response.success === true) {
        notify("Success", response.message);
      } else {
        notify("Error", response.message);
      }
    } catch (error) {
      notify("Error", error.message);
    }
  };

  const handleModalToggle = (key) => {
    setOpenModal((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
    removeBodyCss();
  };

  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }
  useEffect(() => {
    searchClient(id);
    getAgreement(id);
  }, []);

  const searchClient = async (id) => {
 
    try {
      const data = { _id: id };
      const res = await getClientWithIdReq(data);

      setClientData(res.payload?.client);
    } catch (error) {
      console.log(error);
    }
  };

  const downloadPDF = () => {
    const data = [...displayTableData];

    const doc = new jsPDF();
    const tableColumn = Object.keys(data[0]);
    const tableRows = data.map((obj) => Object.values(obj));

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("Agreement.pdf");
  };

  useEffect(() => {
    props.setBreadcrumbItems("EditClient", breadcrumbItems);
  });

  return (
    <div style={{ position: "relative" }}>
      <ToastContainer position="top-center" theme="colored" />
      <Modal
        size="lg"
        isOpen={openModal.agreement}
        toggle={() => {
          handleModalToggle("agreement");
        }}
      >
        <Agreement
          handleSubmitAgreement={handleSubmitAgreement}
          displayTableData={displayTableData}
          setDisplayTableData={setDisplayTableData}
          agreementData={agreementData}
          setAgreementData={setAgreementData}
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
      </Modal>
      <Modal>
        <AddBranch />
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
          Edit
        </button>
      </div>
      <Row>
        <Col xs="8">
          <Card style={{ border: "2px solid #0053FF" }}>
            <CardBody>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h4 className="card-title">Agreement</h4>
                {!agreementAvailable.loading && agreementAvailable.value ? (
                  <div style={{ display: "flex", gap: "20px" }}>
                    <Button
                      className="btn btn-primary w-xl mb-1"
                      onClick={downloadPDF}
                    >
                      <i className="mdi mdi-download mx-2"></i>
                      Download PDF
                    </Button>
                    <Button
                      onClick={() => {
                        handleModalToggle("agreement");
                      }}
                      className="btn-primary"
                    >
                      <i className="mdi mdi-book-edit mx-2"></i>
                      Rework Agreement
                    </Button>
                  </div>
                ) : null}
              </div>

              {agreementAvailable.loading ? (
                <CircularProgress style={{ marginLeft: "50%" }} />
              ) : !agreementAvailable.value ? (
                <div>
                  <CardHeader className="mt-3">
                    <Row>
                      <Col>Product name</Col>
                      <Col>SKU</Col>
                      <Col>Cost Price</Col>
                      <Col> Selling Price</Col>
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
                        onClick={() => {
                          setOpenModal({ ...openModal, agreement: true });
                        }}
                      >
                        <i className=" mdi mdi-18px mdi-plus"></i>
                        <label className="card-title mx-1">
                          Create New Agreement
                        </label>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <AgreementTable
                    editable={false}
                    agreementData={agreementData}
                    setAgreementData={setAgreementData}
                    displayTableData={displayTableData}
                    setDisplayTableData={setDisplayTableData}
                  />
                </div>
              )}
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div style={{ display: "flex", gap: "10px" }}>
                <div>
                  <label
                    onClick={() => {
                      setSelectedData({
                        branch: true,
                        user: false,
                      });
                    }}
                    className={
                      seletedData.branch
                        ? "text-primary card-title mx-1 "
                        : "card-title mx-1"
                    }
                  >
                    Branch
                  </label>
                </div>

                <div>
                  <label
                    onClick={() => {
                      setSelectedData({
                        branch: false,
                        user: true,
                      });
                    }}
                    className={
                      seletedData.user
                        ? "text-primary card-title mx-1"
                        : "card-title mx-1"
                    }
                  >
                    Users
                  </label>
                </div>
              </div>
              {seletedData.branch ? (
                <BranchData
                  handleSubmit={handleSubmitBranch}
                  clientId={id}
                  openModal={openModal}
                  setOpenModal={setOpenModal}
                  handleToggle={handleModalToggle}
                />
              ) : (
                <UserData
                  handleSubmit={handleSubmitUser}
                  clientId={id}
                  openModal={openModal}
                  setOpenModal={setOpenModal}
                  handleToggle={handleModalToggle}
                />
              )}
            </CardBody>
          </Card>
        </Col>
        <Col xs="4">
          <Card>
            <CardBody>
              <h4 className="card-title">Client Details</h4>
              <hr></hr>
              <div className="mt-3" style={{ display: "flex", gap: "20px" }}>
                <Avatar variant="rounded" sx={{ bgcolor: "#0053FF" }}>
                  {clientData?.name?.match(/\b\w/g)?.join("") || "UN"}
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
                      {clientData?.bankAccountNumber
                        ? clientData?.bankAccountNumber[
                            clientData?.bankAccountNumber.length - 3
                          ]
                        : null}
                      {clientData?.bankAccountNumber
                        ? clientData?.bankAccountNumber[
                            clientData?.bankAccountNumber.length - 2
                          ]
                        : null}
                      {clientData?.bankAccountNumber
                        ? clientData?.bankAccountNumber[
                            clientData?.bankAccountNumber?.length - 1
                          ]
                        : null}
                    </p>
                  </Col>
                </Row>
              </div>
              <div>
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
              <div>
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
