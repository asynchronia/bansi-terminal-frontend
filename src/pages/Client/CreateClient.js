import React, { useEffect, useState } from "react"
import { setBreadcrumbItems } from "../../store/actions"
import { connect } from "react-redux"
import { Card, CardBody, Col, Form, Row } from "reactstrap"
import Dropzone from "react-dropzone"
import AddBranch from "../../components/CustomComponents/AddBranch"
import AddUser from "../../components/CustomComponents/AddUser"
import { ToastContainer, toast } from "react-toastify"
import { useFormik } from "formik"
import * as Yup from "yup"
import { createClientReq } from "../../service/clientService"

const CreateClient = props => {
  const breadcrumbItems = [
    { title: "Lexa", link: "#" },
    { title: "Client", link: "/client" },
    { title: "Add new Client", link: "/client/add" },
  ]

  const [selectedFiles, setselectedFiles] = useState([])

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

  const handleCreateClient = async (values) => {
    try {
      const response = await createClientReq(values)
      if (response.success === true) {
        notify("Success", response.message)
      } else {
        notify("Error", response.message)
      }
    } catch (error) {
      notify("Error", error.message)
    }
  }

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
      bankAccountName: null,
      bankAccountNumber: null,
      ifscCode: null,
      status:'active',
      primaryBranch:{
        name: null,
        address:null,
        associatedWarehouse:"65f4b5d66959ec3852a37e60",
        contact:null
      },
      primaryUser:{
        firstName:null,
        lastName:null,
        email:null,
        password:null,
        contact:null,
        gender:null,
        role:"65b4e43b671d73cc3c1bbf8e",
      }
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Client Name"),
      contact: Yup.string().required("Please Enter Valid Contact Number"),
      email: Yup.string().required("Please Enter Client Email"),
      gstin: Yup.string().required("Please Enter GST Number"),
      pan: Yup.string().required("Please Enter PAN Number"),
      bankAccountName: Yup.string().required("Please EnterBank Account Name"),
      bankAccountNumber: Yup.string().required(
        "Please Enter Back Account Number",
      ),
      ifscCode: Yup.string().required("Please Enter IFSC Code"),
      primaryBranch: Yup.object().shape({
        name:Yup.string().required("Please Enter Branch Name"),
        address:Yup.string().required("Please Enter Branch Address"),
        contact:Yup.string().required("Please Enter Valid Contact Number"),
      }),
      primaryUser: Yup.object().shape({
        firstName:Yup.string().required("Please Enter First Name"),
        lastName:Yup.string().required("Please Enter Last Name"),
        email:Yup.string().required("Please Enter Email Id"),
        password:Yup.string().required("Please Enter Password"),
        contact:Yup.string().required("Please Enter Valid Contact Number"),
        gender:Yup.string().required("Please Enter Gender"),
        
      })
    }),
    onSubmit: values => {
      values.logo=`${selectedFiles[0].preview}`
      handleCreateClient(values);
    },
  })

  function handleAcceptedFiles(files) {
    files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      }),
    )
    setselectedFiles(files)
  }

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }
  console.log(validation.values)

  useEffect(() => {
    props.setBreadcrumbItems("CreateItems", breadcrumbItems)
  })
  return (
    <Form
    className="form-horizontal mt-4"
    onSubmit={e => {
      e.preventDefault()
      validation.handleSubmit()
      return false
    }}
  >
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
          <Card>
            <CardBody>
              <Row>
                <h4 className="card-title">Client Details</h4>
              </Row>
              <Row className="mt-4">
                <Col xs="2">
                  <div className="rounded-circle text-center">
                    <label className="item-name text-center">Client Logo</label>
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
                        onDrop={acceptedFiles => {
                          handleAcceptedFiles(acceptedFiles)
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
                    {validation.errors.name ? (
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
                        validation.touched.contact && validation.errors.contact
                      }
                      placeholder="Enter Item Name"
                    />
                    {validation.errors.contact ? (
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
                    {validation.errors.email ? (
                      <p style={{ color: "red" }}>{validation.errors.email}</p>
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
                  {validation.errors.clientType ? (
                    <p style={{ color: "red" }}>
                      {validation.errors.clientType}
                    </p>
                  ) : null}
                </div>
              </Row>
            </CardBody>
          </Card>
          <AddBranch validation={validation} />
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
                    value={validation.values.bankAccountNumber }
                    invalid={
                      validation.touched.bankAccountNumber &&
                      validation.errors.bankAccountNumber
                    }
                  placeholder="Enter Account Number"
                />
                {validation.errors.bankAccountNumber ? (
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
                {validation.errors.bankAccountName ? (
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
                    value={validation.values.ifscCode }
                    invalid={
                      validation.touched.ifscCode &&
                      validation.errors.ifscCode
                    }
                />
                {validation.errors.ifscCode ? (
                    <p style={{ color: "red" }}>
                      {validation.errors.ifscCode}
                    </p>
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
                    invalid={
                      validation.touched.pan &&
                      validation.errors.pan
                    }
                />
                {validation.errors.pan ? (
                    <p style={{ color: "red" }}>
                      {validation.errors.pan}
                    </p>
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
                      validation.touched.gstin &&
                      validation.errors.gstin
                    }
                />
                {validation.errors.gstin ? (
                    <p style={{ color: "red" }}>
                      {validation.errors.gstin}
                    </p>
                  ) : null}
              </div>
            </CardBody>
          </Card>
          <AddUser validation={validation} />
        </Col>
      </Row>
    </div>
    </Form>
  )
}

export default connect(null, { setBreadcrumbItems })(CreateClient)
