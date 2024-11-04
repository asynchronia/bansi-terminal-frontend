import React, { useEffect, useState } from "react";
import { setBreadcrumbItems } from "../../store/actions";
import { connect } from "react-redux";
import { Card, CardBody, Col, Form, Row } from "reactstrap";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import StyledButton from "../../components/Common/StyledButton";
import { getClientWithIdReq, updateClientReq } from "../../service/clientService";

const EditClient = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [breadcrumbItems, setBreadCrubmsItems] = useState([
    { title: "Dashboard", link: "/dashboard" },
    { title: "Client", link: "/clients" },
    { title: "Edit", link: "/client/edit/:id" },
  ]);

  const [selectedFiles, setselectedFiles] = useState([]);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [status, setStatus] = useState("active")

  const notify = (type, message, id) => {
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
      let path = `/client/${id}`;
      navigate(path);
    }
  };

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      name: null,
      contact: null,
      email: null,
      clientType: "individual",
      logo: "",
      gstin: null,
      pan: null,
      zohoCustomerId: "",
      poPrefix: "",
      bankAccountName: null,
      bankAccountNumber: null,
      ifscCode: null,
      status: "active",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Client Name"),
      contact: Yup.string()
        .matches(/^\d+$/, 'Contact number must only contain digits')
        .length(10, 'Contact number must be exactly 10 digits')
        .required('Contact number is required'),
      email: Yup.string().email("Please Enter Valid Email").required("Please Enter Client Email"),
      gstin: Yup.string().required("Please Enter GST Number"),
      pan: Yup.string().required("Please Enter PAN Number"),
      zohoCustomerId: Yup.string().required("Please Enter Zoho Customer Id"),
      bankAccountName: Yup.string().required("Please Enter Bank Account Name"),
      bankAccountNumber: Yup.string().required("Please Enter Back Account Number"),
      ifscCode: Yup.string().required("Please Enter IFSC Code"),
    }),
    onSubmit: (values) => {
      setIsButtonLoading(true);

      const body = {
        ...values,
        _id: id,
        status
      }

      handleEditClient(body);
    },
  });

  const handleEditClient = async (body) => {
    try {
      setIsButtonLoading(true)
      const response = await updateClientReq(body);

      if (response.success) {
        notify("Success", response.message, id)
      }
      setIsButtonLoading(false)
    } catch (error) {
      notify("Error", error.message, id)
      setIsButtonLoading(false)
    }
};

  const handleClientStatus = async (e) => {
    setStatus(e.target.value)
  };


  function handleAcceptedFiles(files) {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setselectedFiles(files);
  }
  
  const getClientData = async (id) => {
    try {
      const data = { _id: id };
      const res = await getClientWithIdReq(data);
  
      const client = res.payload?.client;
      if (client) {
        validation.setFieldValue("name", client.name || "");
        validation.setFieldValue("contact", client.contact || "");
        validation.setFieldValue("email", client.email || "");
        validation.setFieldValue("clientType", client.clientType || "");
        validation.setFieldValue("logo", client.logo || "");
        validation.setFieldValue("gstin", client.gstin || "");
        validation.setFieldValue("pan", client.pan || "");
        validation.setFieldValue("zohoCustomerId", client.zohoCustomerId || "");
        validation.setFieldValue("poPrefix", client.poPrefix || "");
        validation.setFieldValue("bankAccountName", client.bankAccountName || "");
        validation.setFieldValue("bankAccountNumber", client.bankAccountNumber || "");
        validation.setFieldValue("ifscCode", client.ifscCode || "");
        validation.setFieldValue("status", client.status || "");
        setStatus(client.status)
  
        setBreadCrubmsItems([
          { title: "Dashboard", link: "/dashboard" },
          { title: "Clients", link: "/clients" },
          { title: client.name, link: `/client/${id}` }, 
          { title: "Edit", link: `/client/edit/:id` }, 
        ]);
      } else {
        console.log("Client not found in response");
      }
    } catch (error) {
      console.error("Error fetching client data:", error);
    }
  };
  

  useEffect(() => {
    getClientData(id);
  }, []);

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  useEffect(() => {
    props.setBreadcrumbItems("Edit", breadcrumbItems);
  }, [breadcrumbItems]);

  return (
    <Form className="form-horizontal mt-4" autoComplete="off" onSubmit={validation.handleSubmit}>
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: -50,
            right: 10,
            display: "flex",
          }}
        >
          <select className="form-select focus-width" name="status" value={status} onChange={handleClientStatus}>
            <option value="active">Published</option>
            <option value="inactive">Draft</option>
          </select>
          <StyledButton
            type="submit"
            color={"primary"}
            className={"w-md mx-2"}
            isLoading={isButtonLoading}
          >
            Submit
          </StyledButton>
        </div>
        <Row>
          <Col xs="8">
            <Card>
              <CardBody>
                <Row>
                  <h4 className="card-title">Client Details</h4>
                </Row>
                <Row className="mt-4">
                  <Col xs="2">
                    <div className="rounded-circle text-center">
                      <label className="item-name text-center">
                        Client Logo
                      </label>
                      {selectedFiles.length > 0 ? (
                        <img
                          data-dz-thumbnail=""
                          style={{ borderRadius: "50%" }}
                          className="avatar-sm rounded- bg-light"
                          alt={selectedFiles[0].name}
                          src={selectedFiles[0].preview}
                        />
                      ) : (
                        <Dropzone
                          onDrop={(acceptedFiles) => {
                            handleAcceptedFiles(acceptedFiles);
                          }}
                        >
                          {({ getRootProps, getInputProps }) => (
                            <div className="rounded-circle">
                              <div
                                style={{
                                  background: "#ffffff",
                                  border: "1px solid #dee2e6",
                                }}
                                className="dz-message needsclick rounded-circle"
                                {...getRootProps()}
                              >
                                <input {...getInputProps()} />
                                <i className="mdi mdi-36px mdi-cloud-upload-outline"></i>
                              </div>
                            </div>
                          )}
                        </Dropzone>
                      )}
                    </div>
                  </Col>
                  <Col>
                    <div className="mt-4">
                      <label className="item-name">Client Name</label>
                      <input
                        name="name"
                        id="name"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.name || ""}
                        invalid={
                          validation.touched.name && validation.errors.name
                        }
                        className="form-control"
                        type="text"
                        placeholder="Enter Item Name"
                      />
                      {validation.touched.name && validation.errors.name ? (
                        <p style={{ color: "red" }}>{validation.errors.name}</p>
                      ) : null}
                    </div>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col>
                    <div className="mt-3">
                      <label className="item-name">Client Phone Number</label>
                      <input
                        name="contact"
                        id="contact"
                        className="form-control"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.contact || ""}
                        invalid={
                          validation.touched.contact &&
                          validation.errors.contact
                        }
                        placeholder="Enter Item Name"
                      />
                      {validation.touched.contact &&
                        validation.errors.contact ? (
                        <p style={{ color: "red" }}>
                          {validation.errors.contact}
                        </p>
                      ) : null}
                    </div>
                  </Col>
                  <Col>
                    <div className="mt-3">
                      <label className="item-name">Primary Email</label>
                      <input
                        name="email"
                        id="email"
                        className="form-control"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.email || ""}
                        invalid={
                          validation.touched.email && validation.errors.email
                        }
                        placeholder="Enter Item Name"
                      />
                      {validation.touched.email && validation.errors.email ? (
                        <p style={{ color: "red" }}>
                          {validation.errors.email}
                        </p>
                      ) : null}
                    </div>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <div>
                    <label className="col-form-label">Client Type</label>
                    <select
                      name="clientType"
                      id="clinetType"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.clientType || ""}
                      invalid={
                        validation.touched.clientType &&
                        validation.errors.clientType
                      }
                      className="form-select focus-width"
                    >
                      <option>Select Client Type</option>
                      <option value="business">Business</option>
                      <option value="individual">Individual</option>
                    </select>
                    {validation.touched.clientType &&
                      validation.errors.clientType ? (
                      <p style={{ color: "red" }}>
                        {validation.errors.clientType}
                      </p>
                    ) : null}
                  </div>
                </Row>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <h4 className="card-title">Additional Details</h4>
                <Row className="mt-4">
                  <Col>
                    <label className="item-name">Zoho Customer Id</label>
                    <input
                      name="zohoCustomerId"
                      id="zohoCustomerId"
                      className="form-control"
                      type="text"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.zohoCustomerId}
                      invalid={
                        validation.touched.zohoCustomerId &&
                        validation.errors.zohoCustomerId
                      }
                      placeholder="Enter Zoho Customer Id"
                    />
                    {validation.touched.zohoCustomerId &&
                      validation.errors.zohoCustomerId ? (
                      <p style={{ color: "red" }}>
                        {validation.errors.zohoCustomerId}
                      </p>
                    ) : null}
                  </Col>
                  <Col>
                    <label className="item-name">PO Prefix</label>
                    <input
                      name="poPrefix"
                      id="poPrefix"
                      className="form-control"
                      type="text"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.poPrefix}
                      invalid={
                        validation.touched.poPrefix &&
                        validation.errors.poPrefix
                      }
                      placeholder="Enter PO Prefix"
                    />
                    {validation.touched.poPrefix &&
                      validation.errors.poPrefix ? (
                      <p style={{ color: "red" }}>
                        {validation.errors.poPrefix}
                      </p>
                    ) : null}
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col xs="4">
            <Card>
              <CardBody>
                <h4 className="card-title">Payment & Tax Details</h4>
                <div className="mt-4">
                  <label className="item-name">Account Number</label>
                  <input
                    name="bankAccountNumber"
                    id="bankAccountNumber"
                    className="form-control"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.bankAccountNumber}
                    invalid={
                      validation.touched.bankAccountNumber &&
                      validation.errors.bankAccountNumber
                    }
                    placeholder="Enter Account Number"
                  />
                  {validation.touched.bankAccountNumber &&
                    validation.errors.bankAccountNumber ? (
                    <p style={{ color: "red" }}>
                      {validation.errors.bankAccountNumber}
                    </p>
                  ) : null}
                </div>
                <div className="mt-3">
                  <label className="item-name">Account Name</label>
                  <input
                    name="bankAccountName"
                    id="bankAccountName"
                    className="form-control"
                    type="text"
                    placeholder="Enter Account Name"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.bankAccountName}
                    invalid={
                      validation.touched.bankAccountName &&
                      validation.errors.bankAccountName
                    }
                  />
                  {validation.touched.bankAccountName &&
                    validation.errors.bankAccountName ? (
                    <p style={{ color: "red" }}>
                      {validation.errors.bankAccountName}
                    </p>
                  ) : null}
                </div>
                <div className="mt-3">
                  <label className="item-name">IFSC</label>
                  <input
                    name="ifscCode"
                    id="ifscCode"
                    className="form-control"
                    type="text"
                    placeholder="Enter IFSC Code"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.ifscCode}
                    invalid={
                      validation.touched.ifscCode && validation.errors.ifscCode
                    }
                  />
                  {validation.touched.ifscCode && validation.errors.ifscCode ? (
                    <p style={{ color: "red" }}>{validation.errors.ifscCode}</p>
                  ) : null}
                </div>
                <div className="mt-3">
                  <label className="item-name">PAN</label>
                  <input
                    name="pan"
                    id="pan"
                    className="form-control"
                    type="text"
                    placeholder="Enter PAN Number"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.pan}
                    invalid={validation.touched.pan && validation.errors.pan}
                  />
                  {validation.touched.pan && validation.errors.pan ? (
                    <p style={{ color: "red" }}>{validation.errors.pan}</p>
                  ) : null}
                </div>
                <div className="mt-3">
                  <label className="item-name">GST Number</label>
                  <input
                    name="gstin"
                    id="gstin"
                    className="form-control"
                    type="text"
                    placeholder="Enter GST Number"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.gstin}
                    invalid={
                      validation.touched.gstin && validation.errors.gstin
                    }
                  />
                  {validation.touched.gstin && validation.errors.gstin ? (
                    <p style={{ color: "red" }}>{validation.errors.gstin}</p>
                  ) : null}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </Form>
  );
};

export default connect(null, { setBreadcrumbItems })(EditClient);