import React,{useEffect, useState, useRef,useCallback, useMemo} from "react";
import { Row, Col, Card, CardBody, CardTitle, Form, Input, Label, FormFeedback, Button } from "reactstrap"
// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";
import { connect } from "react-redux";

import { ToastContainer, toast } from "react-toastify";
import { setBreadcrumbItems } from "../../store/Breadcrumb/actions";
import {AgGridReact} from 'ag-grid-react';
import {getCategoriesReq } from "../../service/itemService";
import { createCategoryReq } from "../../service/categoryService";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-enterprise';
import 'react-toastify/dist/ReactToastify.css';
import plusIcon from "../../assets/images/small/plus-icon.png";
import minusIcon from "../../assets/images/small/minus-icon.png";
import CategoryList from "./CategoryList";
const AddCategory = (props) =>{
  const gridRef = useRef();
    document.title = "Categories";
    const breadcrumbItems = [
      
      { title: "Dashboard", link: "#" },
      { title: "Items", link: "#" },
      { title: "Category", link: "#" },
    ];
    const [allCategories, setAllCategories] = useState([]);
    const [category, setCategory] = useState("");
    const [rowData, setRowData] = useState([]);
    const getParentHierarchy = (rowData, it) =>{
      if(it?.children && it.children.length > 0) {
        it.children.map((itr, idx) =>{
          
          itr.parentHierarchy = [...it.parentHierarchy];
          itr.parentHierarchy.push(itr.name);
          rowData.push(itr);
          getParentHierarchy(rowData, itr);
            
        }); 
        }
        
      }

    const getCategories = useCallback(async () => {
        const response = await getCategoriesReq();
        let categories = response?.payload?.categories;
        let rowData  = response?.payload?.categories;
        rowData.map((it, id) =>{
           it.parentHierarchy = [it.name];
           console.log("Item Name"+it.name);
            getParentHierarchy(rowData, it);

        });
        console.log("ROWDATA>>> "+rowData);
        setRowData(rowData);
        setAllCategories(categories);
       
      });
    useEffect(() => {
        props.setBreadcrumbItems('Category', breadcrumbItems);
        getCategories();
      },[]);

      const getDataPath = useMemo(() => {
        return (data) => {
          console.log("getDATA>>"+data.parentHierarchy);
          return data.parentHierarchy;
        };
      }, []);
      const columnDefs =  [
          { headerName:'Category Description', field:'description'}
        ];
    
    
    const autoGroupColumnDef = useMemo(() => {
      return {
        headerName: 'Category Name',
        minWidth: 300,
        cellRendererParams: {
          suppressCount: true,
        },
      };
    }, []);
    /*  const autoGroupColumnDef = useMemo(() => {
        return {
          headerName: 'Category Name',
          field:'name',
          minWidth: 300,
          cellRendererParams: {
            suppressCount: true,
          },
        };
      }, []);*/
      const defaultColDef = useMemo(() => {
        return {
          flex: 1,
        };
      }, []);
      
  
   
    const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
        categoryName: '',
        categoryParent: '',
        categoryDescription: '',
    },
    validationSchema: Yup.object({
        categoryName: Yup.string().required("Please Enter Category Name"),
        categoryParent: Yup.string().required("Please Enter Category Parent"),
       // categoryDescription: Yup.string().required("Please Enter Category Description"),
    }),
    onSubmit: (values, { resetForm }) => {
      console.log("ON SUBMIT VALUES >> "+values);
       // dispatch(registerUser(values));
       let body = {
        name:  values.categoryName,
       description: values.categoryDescription,
       parentCategoryId: values.categoryParent};
       handleSubmit(body, resetForm);
    }
    
    });
  const autoSizeStrategy = {
    type: 'fitGridWidth'
  };
  const handleSubmit = async(values, resetForm) => {
    try {
      const response = await createCategoryReq(values);
      if (response.success === true) {
        notify("Success", response.message);
      } else {
        notify("Error", response.payload[0].message);
      }
    } catch (error) {
      notify("Error", error.message);
    }
    resetForm();
    getCategories();

  }
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
  const icons = {
    groupExpanded: '<img src="'+ minusIcon+' "style="width: 15px;"/>',
    groupContracted: '<img src="'+ plusIcon+' "style="width: 15px;"/>',
  };
    return(
        <React.Fragment>
          <ToastContainer position="top-center" theme="colored" />
      <Row>
        <Col md={6}>
          <Card>
            <CardBody>
              <CardTitle className="h4">Item Primary</CardTitle>
              <hr />
              <Form
                className="form-horizontal mt-4"
                onSubmit={(e) => {
                e.preventDefault();
                validation.handleSubmit();
                return false;
                }}
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
                        validation.touched.categoryName && validation.errors.categoryName ? true : false
                        }
                    />
                    {validation.touched.categoryName && validation.errors.categoryName ? (
                        <FormFeedback type="invalid">{validation.errors.categoryName}</FormFeedback>
                    ) : null}
                </div>
                <div className="mb-3">
                    <Label htmlFor="categoryParent">Category Parent</Label>
                    <select
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          id="categoryParent"
                          name="categoryParent"
                          value={validation.values.categoryParent || ""}
                          className="form-select focus-width"
                          invalid={
                            validation.touched.categoryParent && validation.errors.categoryParent ? true : false
                            }
                        >
                          <option value="" selected disabled>Category</option>
                          {allCategories.map(e => (
                            <option value={e._id}>{e.name}</option>
                          ))}
                        </select>
                    {validation.touched.categoryParent && validation.errors.categoryParent ? (
                        <FormFeedback type="invalid">{validation.errors.categoryParent}</FormFeedback>
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
                        <button className="btn btn-primary w-md waves-effect waves-light" type="submit">Add Category</button>
                    </div>
                </div>
            </Form>
            </CardBody>
          </Card>
        </Col>
        <Col xl={6}>
        <Card>
                <CardBody>
                  {/*<CategoryList {...rowData:rowData}/>*/}
                    <div
                            className="ag-theme-quartz"
                            style={{
                                height: '500px',
                                width: '100%'
                            }}
                        >
                            <AgGridReact
                              ref={gridRef}
                              rowData={rowData}
                              columnDefs={columnDefs}
                              defaultColDef={defaultColDef}
                              autoGroupColumnDef={autoGroupColumnDef}
                              treeData={true}
                              groupDefaultExpanded={-1}
                              getDataPath={getDataPath}
                              icons={icons}
                            />
                          </div>
            </CardBody>
              </Card>
        </Col>
        </Row>
        </React.Fragment>
    );
}

export default connect(null, { setBreadcrumbItems })(AddCategory);