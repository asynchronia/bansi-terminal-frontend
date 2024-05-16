import React, {
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Form,
  Input,
  Label,
  FormFeedback,
  Table,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { connect } from "react-redux";
import "./styles/AddCategory.scss";
import { ToastContainer, toast } from "react-toastify";
import { setBreadcrumbItems } from "../../store/Breadcrumb/actions";
import {
  createCategoryReq,
  getCategoriesReq,
} from "../../service/categoryService";

import "react-toastify/dist/ReactToastify.css";
import StyledButton from "../../components/Common/StyledButton";

const AddCategory = (props) => {
  document.title = "Categories";
  const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Items", link: "/items" },
    { title: "Category", link: "#" },
  ];
  const [allCategories, setAllCategories] = useState([]);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const getCategories = useCallback(async () => {
    const response = await getCategoriesReq();
    let categories = response?.payload?.categories;
    setAllCategories(categories);
  });
  useEffect(() => {
    props.setBreadcrumbItems("Category", breadcrumbItems);
    getCategories();
  }, []);

  const validation = useFormik({
   
    enableReinitialize: true,

    initialValues: {
      categoryName: "",
      categoryParent: "",
      categoryDescription: "",
    },
    validationSchema: Yup.object({
      categoryName: Yup.string().required("Please Enter Category Name")
      //categoryParent: Yup.string().required("Please Enter Parent Category"),
    }),
    onSubmit: (values, { resetForm }) => {
      setIsButtonLoading(true);
      let body = {
        name: values.categoryName,
        description: values.categoryDescription,
      };
      if(values.categoryParent && values.categoryParent !== ""){
       body. parentCategoryId = values.categoryParent
      }
      handleSubmit(body, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    try {
      const response = await createCategoryReq(values);
      if (response.success === true) {
        notify("Success", response.message);
      } else {
        notify("Error", response.payload[0].message);
      }
      setIsButtonLoading(false);
    } catch (error) {
      notify("Error", error.message);
      setIsButtonLoading(false);
    }
    resetForm();
    getCategories();
  };
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
  };

  const [openCategories, setOpenCategories] = useState([]);

  const handleCategoryClick = (categoryId) => {
    setOpenCategories((prevOpenCategories) => {
      if (prevOpenCategories.includes(categoryId)) {
        return prevOpenCategories.filter((id) => id !== categoryId);
      } else {
        return [...prevOpenCategories, categoryId];
      }
    });
  };

  const handleChildClick = (event, childId) => {
    event.stopPropagation();
    setOpenCategories((prevOpenCategories) => {
      if (prevOpenCategories.includes(childId)) {
        return prevOpenCategories.filter((id) => id !== childId);
      } else {
        return [...prevOpenCategories, childId];
      }
    });
  };

  const onCreateCategoryClick=(e)=>{
    e.preventDefault();
    validation.handleSubmit();
    return false;
  }

  return (
    <React.Fragment>
      <ToastContainer position="top-center" theme="colored" />
      <Row>
        <Col md={5}>
          <Card>
            <CardBody>
              <CardTitle className="h4">Item Primary</CardTitle>
              <hr />
              <Form
                className="form-horizontal mt-4"
                
              >
                <div className="mb-3">
                  <Label>Category Name</Label>
                  <Input
                    id="categoryName"
                    name="categoryName"
                    className="form-control"
                    placeholder="Enter Category Name"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.categoryName || ""}
                    invalid={
                      validation.touched.categoryName &&
                      validation.errors.categoryName
                        ? true
                        : false
                    }
                  />
                  {validation.touched.categoryName &&
                  validation.errors.categoryName ? (
                    <FormFeedback type="invalid">
                      {validation.errors.categoryName}
                    </FormFeedback>
                  ) : null}
                </div>
                <div className="mb-3">
                  <Label htmlFor="categoryParent">Parent Category</Label>
                  <select
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    id="categoryParent"
                    name="categoryParent"
                    value={validation.values.categoryParent || ""}
                    className="form-select focus-width"
                    invalid={
                      validation.touched.categoryParent &&
                      validation.errors.categoryParent
                        ? true
                        : false
                    }
                  >
                    <option value="" selected disabled>
                      Category
                    </option>
                    {allCategories.map((e) => (
                      <option value={e._id}>{e.name}</option>
                    ))}
                  </select>
                  {validation.touched.categoryParent &&
                  validation.errors.categoryParent ? (
                    <FormFeedback type="invalid">
                      {validation.errors.categoryParent}
                    </FormFeedback>
                  ) : null}
                </div>
                <div className="form-group mb-3">
                  <label className="col-form-label">Category Description</label>
                  <Col lg={12}>
                    <textarea
                      id="categoryDescription"
                      className="form-control"
                      placeholder="Add category description for item"
                      name="categoryDescription"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      rows={5}
                      value={validation.values.categoryDescription || ""}
                    ></textarea>
                    {validation.touched.categoryDescription &&
                    validation.errors.categoryDescription ? (
                      <FormFeedback type="invalid" className="d-block">
                        {validation.errors.categoryDescription}
                      </FormFeedback>
                    ) : null}
                  </Col>
                </div>
                <div className="mb-3 row mt-4">
                  <div className="col-12 text-start">
                  <StyledButton
                color={"primary"}
                className={"w-md"}
                onClick={onCreateCategoryClick}
                isLoading={isButtonLoading}
              >
                Submit
              </StyledButton>
                  </div>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
        <Col xl={7}>
          <Card>
            <CardBody>
            <Table>
              <thead>
              <tr>
                <th>
                Category Name
                </th>
                <th>
                Category Description
                </th>
              </tr>    
              </thead>
            </Table>
              <div>
                {allCategories.map((category, index) => (
                  <div
                    key={category._id}
                    className="option"
                  >
                    <Row className={index!==0?"my-2":null}>
                      <Col
                        xs="1"
                        onClick={() => handleCategoryClick(category._id)}
                      >
                        {category.children &&
                        openCategories.includes(category._id) ? (
                          <i className="mdi mdi-24px mdi-minus" />
                        ) : category.children ? (
                          <i className="mdi mdi-24px mdi-plus" />
                        ) : null}
                      </Col>
                      <Col xs="5">
                        <label className="h6 mt-2">{` ${category.name}`}</label>
                      </Col>
                      <Col xs="6">
                        <label className="h6  mt-2">{` ${
                          category?.description || ""
                        }`}</label>
                      </Col>
                    </Row>

                    {category.children &&
                      openCategories.includes(category._id) && (
                        <div  className="child-options opened mx-2">
                          {category.children.map((child) => (
                            <div key={child._id} className="child-option">
                              <Row>
                                <Col
                                  onClick={(event) =>
                                    handleChildClick(event, child._id)
                                  }
                                  xs="1"
                                >
                                  {child.children &&
                                  openCategories.includes(child._id) ? (
                                    <i className="mdi mdi-24px mdi-minus" />
                                  ) : child.children ? (
                                    <i className="mdi mdi-24px mdi-plus" />
                                  ) : null}
                                </Col>
                                <Col xs="5">
                                  <label className="h6 mt-2 ">{` ${child.name}`}</label>
                                </Col>
                                <Col xs="6">
                                  <label className="h6 mt-2">{` ${
                                    child?.description || ""
                                  }`}</label>
                                </Col>
                              </Row>

                              {child.children &&
                                openCategories.includes(child._id) && (
                                  <div className="grandchild-options mx-2">
                                    {child.children.map((grandchild) => (
                                      <div
                                        key={grandchild._id}
                                        className="grandchild-option"
                                      >
                                        <Row>
                                          <Col xs="1"></Col>
                                          <Col xs="5">
                                            <label className="h5 mt-2">{` ${grandchild.name}`}</label>
                                          </Col>
                                          <Col xs="6">
                                            <label className="h5 mt-2">{` ${
                                              grandchild?.description || ""
                                            }`}</label>
                                          </Col>
                                        </Row>
                                      </div>
                                    ))}
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default connect(null, { setBreadcrumbItems })(AddCategory);
