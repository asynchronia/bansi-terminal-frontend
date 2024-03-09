import React, { useEffect, useState } from "react"
import { setBreadcrumbItems } from "store/actions"
import { connect } from "react-redux"
import { Card, CardBody, Col, Form, Row } from "reactstrap"
import Dropzone from "react-dropzone"
import AddBranch from "components/CustomComponents/AddBranch"
import AddUser from "components/CustomComponents/AddUser"

const CreateClient = props => {
  const breadcrumbItems = [
    { title: "Lexa", link: "#" },
    { title: "Client", link: "/client" },
    { title: "Add new Client", link: "/client/add" },
  ]

  const [selectedFiles, setselectedFiles] = useState([])

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

  useEffect(() => {
    props.setBreadcrumbItems("CreateItems", breadcrumbItems)
  })
  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: -50,
          right: 10,
          display: "flex",
        }}
      >
        <select className="form-control" name="status">
          <option value="published">Published</option>
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
                      name="title"
                      id="title"
                      className="form-control"
                      type="text"
                      placeholder="Enter Item Name"
                    />
                  </div>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col>
                  <div className="mt-3">
                    <label className="item-name">Client Phone Number</label>
                    <input
                      name="title"
                      id="title"
                      className="form-control"
                      type="text"
                      placeholder="Enter Item Name"
                    />
                  </div>
                </Col>
                <Col>
                  <div className="mt-3">
                    <label className="item-name">Primary Email</label>
                    <input
                      name="title"
                      id="title"
                      className="form-control"
                      type="text"
                      placeholder="Enter Item Name"
                    />
                  </div>
                </Col>
              </Row>
              <Row className="mt-3">
                <div>
                  <label className="col-form-label">Client Type</label>
                  <select className="form-control">
                    <option>Select</option>
                    <option>Option 1</option>
                    <option>Option 2</option>
                  </select>
                </div>
              </Row>
            </CardBody>
          </Card>
          <AddBranch />
        </Col>
        <Col xs="4">
          <Card>
            <CardBody>
              <h4 className="card-title">Payment & Tax Details</h4>
              <div className="mt-4">
                <label className="item-name">Account Number</label>
                <input
                  name="title"
                  id="title"
                  className="form-control"
                  type="text"
                  placeholder="Enter Account Number"
                />
              </div>
              <div className="mt-3">
                <label className="item-name">Account Name</label>
                <input
                  name="title"
                  id="title"
                  className="form-control"
                  type="text"
                  placeholder="Enter Account Name"
                />
              </div>
              <div className="mt-3">
                <label className="item-name">IFSC</label>
                <input
                  name="title"
                  id="title"
                  className="form-control"
                  type="text"
                  placeholder="Enter IFSC Code"
                />
              </div>
              <div className="mt-3">
                <label className="item-name">PAN</label>
                <input
                  name="title"
                  id="title"
                  className="form-control"
                  type="text"
                  placeholder="Enter PAN Number"
                />
              </div>
              <div className="mt-3">
                <label className="item-name">GST Number</label>
                <input
                  name="title"
                  id="title"
                  className="form-control"
                  type="text"
                  placeholder="Enter GST Number"
                />
              </div>
            </CardBody>
          </Card>
          <AddUser />
        </Col>
      </Row>
    </div>
  )
}

export default connect(null, { setBreadcrumbItems })(CreateClient)
