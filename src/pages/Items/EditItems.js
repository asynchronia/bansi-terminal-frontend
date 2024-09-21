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
  Modal,
} from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import Dropzone from "react-dropzone";
import { ReactComponent as Edit } from "../../assets/images/svg/edit-button.svg";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import { useNavigate, useParams } from "react-router-dom";
import InputWithChips from "../../components/CustomComponents/InputWithChips";
import { v4 as uuidv4 } from "uuid";
import * as Yup from "yup";
import { useFormik } from "formik";
import AllVariantRows from "../../components/CustomComponents/AllVariantRows";

import { toast } from "react-toastify";
import Standard from "../../components/CustomComponents/Standard";
// import MultipleLayerSelect from "../../components/CustomComponents/MultipleLayerSelect";
import { Box } from "@mui/material";
import {
  editItemReq,
  getCategoriesReq,
  getItemByIdReq,
  getTaxesReq,
} from "../../service/itemService";
import StyledButton from "../../components/Common/StyledButton";
import StatusConfirm from "../../components/CustomComponents/StatusConfirm";
import { updateItemStatusReq } from "../../service/statusService";

const EditItems = (props) => {
  const [itemsData, setItemsData] = useState({});
  const [loadedItem, setLoadedItems] = useState(false);
  const [selectedFiles, setselectedFiles] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allTaxes, setAllTaxes] = useState([]);
  const [variantData, setVariantData] = useState([]);
  const [taxArr, setTaxArr] = useState(null);
  const [variantOptions, setVariantOptions] = useState([]);
  const [deletedVariant, setDeletedVariant] = useState([]);
  const [itemType, setItemType] = useState("variable");
  const [typeValue, setTypeValue] = useState("variable");
  const [variantDataChanged, setVariantDataChanged] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [categoryData, setCategoryData] = useState({
    name: "",
    id: null,
    show: false,
  });
  const navigate = useNavigate();

  const [otherData, setOtherData] = useState({
    sku: "",
    inventory: "",
    costPrice: "",
    sellingPrice: "",
  });

  const [openModal, setOpenModal] = useState({
    status: false,
  });

  const [fieldInvalid, setFieldInvalid] = useState(false);

  const { id } = useParams();

  const searchItemData = async (id) => {
    try {
      const data = { _id: id };
      const res = await getItemByIdReq(data);
      setItemsData(res);
      setVariantData(res?.payload?.variants);
      setTaxArr(res?.payload?.item?.taxes[0]._id);
      setItemType(res?.payload?.item?.itemType);
      setOtherData({
        sku: res?.payload.variants[0]?.sku,
        inventory: res?.payload.variants[0]?.inventory,
        costPrice: res?.payload.variants[0]?.costPrice,
        sellingPrice: res?.payload.variants[0]?.sellingPrice,
      });
      setLoadedItems(true);
    } catch (error) {
      if (error === 404) {
        console.log("Item not found");
      } else {
        console.log("An error occurred while searching for item");
      }
    }
  };

  useEffect(() => {
    searchItemData(id);
  }, [loadedItem]);

  useEffect(() => {
    let options = [...variantOptions]; // Make a copy of the current variantOptions
    let products = variantData;

    products.forEach((product) => {
      product.attributes.forEach((attribute) => {
        const existingOptionIndex = options.findIndex(
          (option) => option.name === attribute.name
        );

        if (existingOptionIndex === -1) {
          // Option doesn't exist, add it with the new value
          options.push({
            id: uuidv4(),
            name: attribute.name,
            chips: [attribute.value],
          });
        } else {
          // Option exists, update chips if value is not already present
          if (!options[existingOptionIndex].chips.includes(attribute.value)) {
            options[existingOptionIndex].chips.push(attribute.value);
          }
        }
      });
    });

    setVariantOptions(options);
    setVariantDataChanged(false); // Reset variantDataChanged flag
  }, [variantData, variantDataChanged]);

  const notify = (type, message) => {
    if (type === "Error") {
      toast.error(message, {
        position: "top-center",
        theme: "colored",
      });
    } else {
      let path = `/view-item/${id}`;
      navigate(path);
    }
  };

  const handleTaxes = (e) => {
    const value = e.target.value;
    setTaxArr([...taxArr, value]);
  };

  const searchCategories = async () => {
    try {
      const response = await getCategoriesReq();
      let categoriesArr = response?.payload?.categories;
      setAllCategories(categoriesArr);
      const categoryName = findCategoryName(
        categoriesArr,
        itemsData.payload?.item?.category?._id
      );

      setCategoryData({
        name: categoryName,
        id: itemsData.payload?.item?.category?._id,
        show: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  function findCategoryName(categories, categoryId) {
    for (const category of categories) {
      if (category._id === categoryId) {
        return category.name;
      }
      if (category.children) {
        const foundInChildren = findCategoryName(category.children, categoryId);
        if (foundInChildren) {
          return foundInChildren;
        }
      }
    }
    return null;
  }

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
  }, [loadedItem]);

  const handleVariantChange = (id, name, value) => {
    const updatedVariants = variantData
      .map((variant) => {
        if (variant._id === id) {
          if (name === "attributes") {
            const attributeIndex = variant.attributes.findIndex(
              (attr) => attr.name === value.name
            );
            if (attributeIndex !== -1) {
              const updatedAttributes = [...variant.attributes];
              updatedAttributes[attributeIndex] = value;
              return {
                ...variant,
                attributes: updatedAttributes,
              };
            } else {
              // Add the new attribute if it doesn't exist
              return {
                ...variant,
                attributes: [...variant.attributes, value],
              };
            }
          }
          return {
            ...variant,
            [name]: value,
          };
        }
        return variant;
      })
      .map((variant) => {
        if (variant._id === id) {
          // Remove _id from the updated variant
          const { _id, ...rest } = variant;
          return rest;
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

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      _id: id,
      title: itemsData.payload?.item?.title,
      hsnCode: itemsData.payload?.item?.hsnCode,
      category: itemsData.payload?.item?.category?._id,
      description: itemsData.payload?.item?.description,
      itemUnit: itemsData.payload?.item?.itemUnit,
      taxPreference: itemsData.payload?.item?.taxPreference,
      taxes: itemsData.payload?.item?.taxes[0],
      status: itemsData.payload?.item?.status,
      images: itemsData.payload?.item?.images,
      variants: itemsData.payload?.variants,
      deletedVariants: [],
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Please Enter Item Name"),
      hsnCode: Yup.string().required("Please Enter HSN Code"),
      category: Yup.string().required("Please Select Category"),
    }),
    onSubmit: (values) => {
      setIsButtonLoading(true);
      let unhandled = false;
      if (itemType === "variable") {
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
      } else if (itemType === "service") {
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
        setIsButtonLoading(false);
        return;
      } else {
        if (itemType === "variable") {
          const newData = variantData.map(
            ({ _id, sku, attributes, costPrice, sellingPrice, inventory }) => ({
              _id,
              sku,
              attributes,
              costPrice,
              sellingPrice,
              inventory,
            })
          );

          values.variants = [...newData];
        } else if (itemType === "standard") {
          values.variants = [{ ...otherData }];
        } else {
          const { inventory, ...rest } = otherData;
          values.variants = [{ ...rest }];
        }

        values.images = [...selectedFiles];
        values.taxes = [taxArr];
        values.category = categoryData.id;
        values.deletedVariants = [...deletedVariant];

        handleItemEdit(values);
      }
    },
  });

  const handleItemEdit = async (values) => {
    try {
      const response = await editItemReq(values);
      if (response.success === true) {
        notify("Success", response.message);
      } else {
        notify("Error", response.message);
      }
      setIsButtonLoading(false);
    } catch (error) {
      if (error === 404) {
        notify("Error", "Item not found");
      } else {
        notify("Error", "An error occurred while editing the item");
      }
      setIsButtonLoading(false);
    }
  };

  const handleAddRow = () => {
    const newRow = { id: uuidv4() };
    setVariantOptions([...variantOptions, newRow]);
  };

  const handleAddVariantData = () => {
    const newRow = { _id: uuidv4(), attributes: [] };
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
            (attr) => attr.name !== deletedAttributeName
          );
        }
        return el;
      });

      setVariantData(updatedVariantData);
    }
  };

  const handleDeleteVariantData = (id) => {
    const deletedRow = variantData.filter((row) => row._id === id);
    setDeletedVariant([...deletedVariant, deletedRow[0]._id]);
    const updatedRows = variantData.filter((row) => row._id !== id);
    setVariantData(updatedRows);
  };

  //Handles BreadCrumbs
  const breadcrumbItems = [
    { title: "All Items", link: "/items" },
    { title: "Edit Items", link: `/edit-item/:${id}` },
  ];

  useEffect(() => {
    props.setBreadcrumbItems("Edit Items", breadcrumbItems);
  });

  const editPage = true;

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

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
  // if(!loadedItem){
  //   return (
  //     <div>
  //       <CircularProgress/>
  //     </div>
  //   )
  // }

  const onEditItemClick = (e) => {
    e.preventDefault();
    validation.handleSubmit();
    return false;
  };

  const handleTypeChange = (e) => {
    setTypeValue(e.target.value);
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

  const handleItemStatus = async () => {
    try {
      let values ={
        _id: id,
        status: validation.values.status
    }

      const response = await updateItemStatusReq(values);
      console.log(response)
      if (response.success === true) {
        notify("Success", response.message);
      } else {
        notify("Error", response.message);
      }
    } catch (error) {
      notify("Error", error.message);
    }
  };

  const handleStatusChange = (e) => {
    const { name, value } = e.target;
    validation.setFieldValue(name, value); 
    setOpenModal({...openModal, status:true})
  };


  return (
    <div style={{ position: "relative" }}>
      <Modal
        isOpen={openModal.status}
        toggle={() => {
          handleModalToggle("status");
        }}
      >
        <StatusConfirm
          type={"Item"}
          openModal={openModal}
          setOpenModal={setOpenModal}
          handleSubmitStatus={handleItemStatus}
        />
      </Modal>
      <Form className="form-horizontal mt-4">
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
                    {validation.errors.title ? (
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
                    {validation.errors.hsnCode ? (
                      <p style={{ color: "red" }}>
                        {validation.errors.hsnCode}
                      </p>
                    ) : null}
                  </div>
                  <div className="mt-3 mb-0">
                    <label className="form-label focus-width">Category</label>
                    <label
                      name="category"
                      id="category"
                      onClick={() => {
                        setCategoryData({
                          ...categoryData,
                          show: !categoryData.show,
                        });
                      }}
                      className="form-control"
                    >
                      {categoryData.name}
                    </label>
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
                onChange={handleStatusChange}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
              <StyledButton
                color={"primary"}
                className={"w-md mx-2"}
                onClick={onEditItemClick}
                isLoading={isButtonLoading}
              >
                <Edit style={{ marginRight: "5px", fill: "white" }} />
                Edit
              </StyledButton>
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
                        value={validation.values.taxPreference}
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
                        value={validation.values?.taxes?._id}
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
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "20px",
                  }}
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
                  <div
                    style={{ maxWidth: "50%" }}
                    className="dropzone-previews mt-3"
                    id="file-previews"
                  >
                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
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
                  disabled={true}
                    name="itemType"
                    id="itemType"
                    value={typeValue}
                    onBlur={validation.handleBlur}
                    onChange={handleTypeChange}
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
            {itemType === "variable" ? (
              <CardBody>
                {variantOptions.map((row) => (
                  <AttributesRow
                    key={row.id}
                    _id={row.id}
                    data={row}
                    disabledDelete={variantOptions.length === 1}
                    setVariantOptions={setVariantOptions}
                    onDelete={handleDeleteRow}
                    fieldInvalid={fieldInvalid}
                  />
                ))}
                <div className="mt-3">
                  {!editPage ? (
                    <button
                      type="button"
                      className="btn btn-primary waves-effect waves-light "
                      onClick={handleAddRow}
                    >
                      <label className="card-title mx-1">Add</label>
                      <i className=" mdi mdi-18px mdi-plus"></i>
                    </button>
                  ) : null}
                </div>
                {variantData.map((row) => (
                  <AllVariantRows
                    editPage={editPage}
                    data={row}
                    key={row._id}
                    _id={row._id}
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
                  editPage={editPage}
                  data={otherData}
                  type={itemType}
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
  const { _id, onDelete, disabledDelete, setVariantOptions, data } = props;
  const [displayValue, setDisplayValue] = useState(data.name || "");
  const nameRef = useRef(data.name || "");
  const [inputValue, setInputValue] = useState("");
  const [chips, setChips] = useState(data.chips || []);

  useEffect(() => {
    setVariantOptions((prevOptions) =>
      prevOptions.map((e) => {
        if (e.id === _id) {
          return {
            ...e,
            name: data.name ? data.name : displayValue,
            chips: [...chips],
          };
        }
        return e;
      })
    );
  }, [chips]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const setNameRef = (event) => {
    nameRef.current = event.target.value;
    setDisplayValue(nameRef.current);
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

  const editPage = true;

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
            value={displayValue}
            ref={nameRef}
            disabled={true}
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
          {!editPage ? (
            <button
              type="button"
              className="btn btn-primary waves-effect waves-light mt-5"
              disabled={disabledDelete}
              onClick={() => onDelete(_id)}
            >
              <i className="mdi mdi-18px mdi-delete"></i>
            </button>
          ) : null}
        </Col>
      </Row>
    </div>
  );
};

export default connect(null, { setBreadcrumbItems })(EditItems);
