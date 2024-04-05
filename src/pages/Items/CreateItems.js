import React, { useEffect, useRef, useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Label,
  Input,
  CardTitle,
  Form,
} from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import Dropzone from "react-dropzone";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import InputWithChips from "../../components/CustomComponents/InputWithChips";
import { v4 as uuidv4 } from "uuid";
import * as Yup from "yup";
import { useFormik } from "formik";
import AllVariantRows from "../../components/CustomComponents/AllVariantRows";

import { createItemReq, getCategoriesReq, getTaxesReq } from "../../service/itemService";
import { ToastContainer, toast } from "react-toastify";
import Standard from "../../components/CustomComponents/Standard";
import MultipleLayerSelect from "../../components/CustomComponents/MultipleLayerSelect";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CreateItems = (props) => {
  const [selectedFiles, setselectedFiles] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allTaxes, setAllTaxes] = useState([]);
  const [taxArr, setTaxArr] = useState([]);
  const [variantOptions, setVariantOptions] = useState([{ id: uuidv4() }]);
  const [fieldInvalid, setFieldInvalid] = useState(false);
  const [categoryData, setCategoryData] = useState({
    name: "",
    id: null,
    show: false,
  });
  const navigate = useNavigate();

  const [variantData, setVariantData] = useState([
    { id: uuidv4(), attributes: [] },
  ]);

  const [otherData, setOtherData] = useState({
    sku: "",
    inventory: "",
    costPrice: "",
    sellingPrice: "",
  });

  const notify = (type, message, id) => {
    if (type === "Error") {
      toast.error(message, {
        position: "top-center",
        theme: "colored",
      });
    } else {
      let path = `/view-item/${id}`
      navigate(path);
    }
    
  };

  const handleTaxes = (e) => {
    const value = e.target.value;
    setTaxArr([value]);
  };

  const searchCategories = async () => {
    try {
      const response = await getCategoriesReq();
      let categories = response?.payload?.categories;
      setAllCategories(categories);
    } catch (error) {
      console.log(error);
    }
  };

  const searchAllTaxes = async () => {
    try {
      const response = await getTaxesReq();
      let data = await response;
      setAllTaxes(data?.payload?.taxes);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    searchCategories();
    searchAllTaxes();
  }, []);

  const handleVariantChange = (id, name, value) => {
    const updatedVariants = variantData.map((variant) => {
      if (variant.id === id) {
        if (name === "attributes") {
          return {
            ...variant,
            attributes: [...variant.attributes, value],
          };
        }
        return {
          ...variant,
          [name]: value,
        };
      }
      return variant;
    });
    setVariantData(updatedVariants);
  };

  const handleOtherChange = (name, value) => {
    setOtherData({
      ...otherData,
      [name]: value,
    });
  };

  const handleItemCreation = async (values) => {
    try {
      const response = await createItemReq(values);
      if (response.success === true) {
        notify("Success", response.message, response.payload.itemId);
      } else {
        notify("Error", response.message);
      }
    } catch (error) {
      notify("Error", error.message);
    }
  };

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      title: "",
      hsnCode: "",
      category: "category",
      description: "",
      itemType: "standard",
      itemUnit: "unit",
      taxPreference: "taxable",
      taxes: [],
      status: "published",
      images: [],
      variants: [],
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Please Enter Item Name"),
      hsnCode: Yup.string().required("Please Enter HSN Code"),
      category: Yup.string()
        .required("Please Select Category")
        .min(3, "Please Select Category"),
      itemType: Yup.string().required("Please Select Item Type"),
    }),
    onSubmit: (values) => {
      let unhandled = false;
      if (values.itemType === "variable") {
        for (let i = 0; i < variantData.length; i++) {
          if (
            variantData[i].attributes.length === 0 ||
            variantData[i].inventory === ""
          ) {
            unhandled = true;
          } else if (
            variantData[i].sku === "" ||
            variantData[i].costPrice === "" ||
            variantData[i].sellingPrice === ""
          ) {
            unhandled = true;
          }
        }
      } else if (values.itemType === "service") {
        if (
          otherData.sku === "" ||
          otherData.costPrice === "" ||
          otherData.sellingPrice === ""
        ) {
          unhandled = true;
        }
      } else {
        if (
          otherData.sku === "" ||
          otherData.costPrice === "" ||
          otherData.sellingPrice === "" ||
          otherData.inventory === ""
        ) {
          unhandled = true;
        }
      }

      if (unhandled) {
        setFieldInvalid(false);
        notify("Error", "Please enter all the fields");
        return;
      } else {
        if (values.itemType === "variable") {
          const finalVariant = variantData.map((element) => {
            const { id, ...rest } = element;
            return rest;
          });
          values.variants = [...finalVariant];
        } else if (values.itemType === "standard") {
          values.variants = [{ ...otherData }];
        } else {
          const { inventory, ...rest } = otherData;
          values.variants = [{ ...rest }];
        }

        values.images = [...selectedFiles];
        values.taxes = [...taxArr];
        values.category = categoryData.id;
       
        handleItemCreation(values);
      }
    },
  });
  const handleAddRow = () => {
    const newRow = { id: uuidv4() };
    setVariantOptions([...variantOptions, newRow]);
  };

  const handleAddVariantData = () => {
    const newRow = { id: uuidv4(), attributes: [] };
    setVariantData([...variantData, newRow]);
  };

  const handleDeleteRow = (id) => {
    const deletedOption = variantOptions.find((option) => option.id === id);
    const updatedRows = variantOptions.filter((row) => row.id !== id);
    setVariantOptions(updatedRows);

    if (deletedOption) {
      const deletedAttributeName = deletedOption.name;
      const updatedVariantData = variantData.map((el) => {
        if (el.attributes) {
          el.attributes = el.attributes.filter(
            (attr) => !attr.hasOwnProperty(deletedAttributeName)
          );
        }
        return el;
      });

      setVariantData(updatedVariantData);
    }
  };

  const handleDeleteVariantData = (id) => {
    const updatedRows = variantData.filter((row) => row.id !== id);
    setVariantData(updatedRows);
  };

  //Handles BreadCrumbs
  const breadcrumbItems = [
    { title: "All Items", link: "/items" },
    { title: "Create Items", link: "/create-items" },
  ];

  useEffect(() => {
    props.setBreadcrumbItems("CreateItems", breadcrumbItems);
  });

  //Handle File Upload
  function handleAcceptedFiles(files) {
    const updatedFiles = files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setselectedFiles([...selectedFiles, updatedFiles[0]]);
  }

  /**
   * Formats the size
   */
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  return (
    <div style={{ position: "relative" }}>
      <ToastContainer position="top-center" theme="colored" />
      <Form
        className="form-horizontal mt-4"
        onSubmit={(e) => {
          e.preventDefault();
          validation.handleSubmit();
          return false;
        }}
      >
        <Row>
          <Col xl="4">
            <Card>
              <CardBody>
                <h4 className="card-title">Item Primary</h4>

                <div>
                  <div className="mt-3 mb-0">
                    <label className="item-name">Item Name</label>
                    <input
                      name="title"
                      id="title"
                      className="form-control"
                      type="text"
                      placeholder="Enter Item Name"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.title || ""}
                      invalid={
                        validation.touched.title && validation.errors.title
                      }
                    />
                    {validation.errors.title && validation.touched.title ? (
                      <p style={{ color: "red" }}>{validation.errors.title}</p>
                    ) : null}
                  </div>
                  <div className="mt-3 mb-0">
                    <label className="form-label">HSN Code</label>
                    <input
                      id="hsnCode"
                      name="hsnCode"
                      className="form-control"
                      type="text"
                      placeholder="Enter HSN Code"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.hsnCode || ""}
                      invalid={
                        validation.touched.hsnCode && validation.errors.hsnCode
                      }
                    />
                    {validation.errors.hsnCode && validation.touched.hsnCode ? (
                      <p style={{ color: "red" }}>
                        {validation.errors.hsnCode}
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-3 mb-0">
                    <label className="form-label">Select Category</label>
                    <label
                      name="category"
                      id="category"
                      onClick={() => {
                        setCategoryData({
                          ...categoryData,
                          show: !categoryData.show,
                        });
                      }}
                      className="form-select focus-width"
                    >
                      {categoryData.name !== ""
                        ? `Category: ${categoryData.name}`
                        : `Select Category`}
                    </label>
                    {categoryData.show ? (
                      <MultipleLayerSelect
                        categories={allCategories}
                        setCategoryData={setCategoryData}
                      />
                    ) : null}

                   
                  </div>
                  <div className="mt-3">
                    <Label>Item Short Description</Label>
                    <Input
                      type="textarea"
                      id="description"
                      name="description"
                      onChange={validation.handleChange}
                      value={validation.values.description}
                      onBlur={validation.handleBlur}
                      rows="14"
                      placeholder="Add a short description for the item"
                    />
                    <span className="badgecount badge badge-success"></span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col xl="8">
            <div
              style={{
                position: "absolute",
                top: -80,
                right: 10,
                display: "flex",
              }}
            >
              <select
                className="form-select focus-width"
                name="status"
                // id = "status"
                value={validation.values.status}
                onBlur={validation.handleBlur}
                onChange={validation.handleChange}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
              <button type="submit" className="btn btn-primary w-xl mx-3">
                Submit
              </button>
            </div>
            <Card>
              <CardBody>
                <h4 className="card-title">Item Details</h4>
                <Row>
                  <Col>
                    <div className="mt-3 mb-0">
                      <label className="col-form-label">Taxable?</label>
                      <select
                        id="taxPreference"
                        name="taxPreference"
                        value={validation.values.taxPreference || ""}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        className="form-select focus-width"
                      >
                        <option value="taxable">Taxable</option>
                        <option value="exempt">Exempt</option>
                        <option value="nil">Nil</option>
                      </select>
                    </div>
                  </Col>

                  <Col>
                    <div className="mt-3 mb-0">
                      <label className="col-form-label">Tax Bracket</label>
                      <select
                        id="taxes"
                        name="taxes"
                        value={validation.values.taxes[0]}
                        onChange={handleTaxes}
                        onBlur={validation.handleBlur}
                        className="form-select focus-width"
                      >
                        <option>Select Tax</option>
                        {allTaxes.map((e) => (
                          <option value={e._id}>{e.name}</option>
                        ))}
                      </select>
                    </div>
                  </Col>
                  <Col>
                    <div className="mt-3 mb-0">
                      <label className="col-form-label">Item Unit</label>
                      <select
                        id="itemUnit"
                        name="itemUnit"
                        value={validation.values.itemUnit || ""}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        className="form-select focus-width"
                      >
                        <option value="unit">unit</option>
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="l">l</option>
                        <option value="ml">ml</option>
                        <option value="m">m</option>
                        <option value="cm">cm</option>
                        <option value="mm">mm</option>
                      </select>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <CardTitle className="h4">Item Gallery</CardTitle>
                <Form
                  style={{ display: "flex", justifyContent: "center", gap:'20px' }}
                >
                  <Dropzone
                    onDrop={(acceptedFiles) => {
                      handleAcceptedFiles(acceptedFiles);
                    }}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div className="dropzone dz-clickable">
                        <div
                          className="dz-message needsclick"
                          {...getRootProps()}
                        >
                          <input {...getInputProps()} />
                          <div className="mb-3">
                            <i className="mdi mdi-cloud-upload-outline text-muted display-4"></i>
                          </div>
                          <h4>Drop files here or click to upload.</h4>
                        </div>
                      </div>
                    )}
                  </Dropzone>
                  <div style={{maxWidth:'50%'}} className="dropzone-previews mt-3" id="file-previews">
                    <Box 
                    sx={{display:'flex', flexWrap:'wrap', gap:'10px'}}
                      
                      className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                    >
                      {selectedFiles.map((f, i) => {
                        return (
                          <Box key={i + "-file"} className="p-2">
                            <img
                              data-dz-thumbnail=""
                              height="80"
                              className="avatar-sm rounded bg-light"
                              alt={f.name}
                              src={f.preview}
                            />
                          </Box>
                        );
                      })}
                    </Box>
                  </div>
                </Form>

                <div className="text-center mt-4">
                  <button
                    type="button"
                    className="btn btn-primary waves-effect waves-light"
                  >
                    Send Files
                  </button>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <h4 className="card-title">Type</h4>
                <div className="mb-1">
                  <select
                    name="itemType"
                    id="itemType"
                    value={validation.values.itemType}
                    onBlur={validation.handleBlur}
                    onChange={validation.handleChange}
                    className="form-select focus-width"
                  >
                    <option value="variable">Variable Item</option>
                    <option value="standard">Standard Item</option>
                    <option value="service">Service Item</option>
                  </select>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Card>
            {validation.values.itemType == "variable" ? (
              <CardBody>
                {variantOptions.map((row) => (
                  <AttributesRow
                    key={row.id}
                    _id={row.id}
                    variantData={variantData}
                    setVariantData={setVariantData}
                    disabledDelete={variantOptions.length === 1}
                    setVariantOptions={setVariantOptions}
                    onDelete={handleDeleteRow}
                    fieldInvalid={fieldInvalid}
                  />
                ))}
                <div className="mt-3">
                  <button
                    type="button"
                    className="btn btn-primary waves-effect waves-light "
                    onClick={handleAddRow}
                  >
                    <label className="card-title mx-1">Add</label>
                    <i className=" mdi mdi-18px mdi-plus"></i>
                  </button>
                </div>
                {variantData.map((row) => (
                  <AllVariantRows
                    key={row.id}
                    _id={row.id}
                    variantOptions={variantOptions}
                    disabledDelete={variantData.length === 1}
                    onChange={handleVariantChange}
                    onDelete={handleDeleteVariantData}
                  />
                ))}
                <div className="mt-3">
                  <button
                    type="button"
                    className="btn btn-primary waves-effect waves-light "
                    onClick={handleAddVariantData}
                  >
                    <label className="card-title mx-1">Add</label>
                    <i className=" mdi mdi-18px mdi-plus"></i>
                  </button>
                </div>
              </CardBody>
            ) : (
              <CardBody>
                <Standard
                  type={validation.values.itemType}
                  onChange={handleOtherChange}
                />
              </CardBody>
            )}
          </Card>
        </Row>
      </Form>
    </div>
  );
};

const AttributesRow = (props) => {
  const nameRef = useRef("");
  const [inputValue, setInputValue] = useState("");
  const [chips, setChips] = useState([]);

  const {
    _id,
    onDelete,
    disabledDelete,
    setVariantOptions,
    variantData,
    setVariantData,
  } = props;

  useEffect(() => {
    setVariantOptions((prevOptions) =>
      prevOptions.map((e) => {
        if (e.id === _id) {
          return {
            ...e,
            name:
              nameRef.current.placeholder !== "Enter Variant Key"
                ? nameRef.current
                : null,
            chips: [...chips],
          };
        }
        return e;
      })
    );
  }, [chips, nameRef]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const setNameRef = (event) => {
    nameRef.current = event.target.value;
  };

  //Handling Chips Creation on space or enter
  const handleInputKeyPress = (event) => {
    if (
      (event.key === "Enter" || event.key === " ") &&
      inputValue.trim() !== ""
    ) {
      event.preventDefault();
      setChips([...chips, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleChipDelete = (chipIndex) => {
    setChips(chips.filter((_, index) => index !== chipIndex));
  };

  return (
    <div>
      <Row>
        <Col xs="3" className="mt-1">
          <label className="form-label mt-3">Variant</label>
          <input
            name="variantKey"
            className="form-control"
            type="text"
            placeholder="Enter Variant Key"
            onChange={setNameRef}
            ref={nameRef}
          />
        </Col>
        <Col xs="8">
          <InputWithChips
            chips={chips}
            inputValue={inputValue}
            handleInputChange={handleInputChange}
            handleInputKeyPress={handleInputKeyPress}
            handleChipDelete={handleChipDelete}
          />
        </Col>

        <Col xs="1">
          <button
            type="button"
            className="btn btn-primary waves-effect waves-light mt-5"
            disabled={disabledDelete}
            onClick={() => onDelete(_id)}
          >
            <i className="mdi mdi-18px mdi-delete"></i>
          </button>
        </Col>
      </Row>
    </div>
  );
};

export default connect(null, { setBreadcrumbItems })(CreateItems);
