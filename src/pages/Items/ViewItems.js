import React, { useEffect, useRef, useState,useCallback} from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
} from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import {useLocation} from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import { getCategoriesReq, getItemById } from "../../service/itemService";
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-quartz.css';
import { attributesCellRenderer,findCategoryNameById } from './ItemsUtils';
 

const ViewItems = (props,{route,navigate}) => {
  const location = useLocation();
  const [itemsData, setItemsData] = useState();
  const [variantData, setVariantData] = useState([]);
  const [categories, setCategories] = useState([]);
  const data = location.state.data;  
  const effectCalled = useRef(false);
  const gridRef = useRef();

  //Handles BreadCrumbs
  const breadcrumbItems = [
      { title: "Dashboard", link: "#" },
      { title: "View-Items", link: "#" },
      { title: data.title, link: "#" },
    ];
  
    const autoSizeStrategy = {
      type: 'fitGridWidth'
    };

    let bodyObject = {
        "_id": data._id
    };
    const getItemData =  useCallback(async (body) => {
      const response = await getItemById(bodyObject);
      setItemsData(response.payload.item);
      console.log("response"+JSON.stringify(response.payload.item));
      setVariantData(response.payload.variants);
    });
    const pagination = true;

    // sets 10 rows per page (default is 100)
    // allows the user to select the page size from a predefined list of page sizes
    const paginationPageSizeSelector = [5, 10, 25, 50];
  
    const [rowData, setRowData] = useState([]);
    const [paginationPageSize, setPaginationPageSize ]= useState(5);
  

    const columnDefs = [
      {headerName: "SKU", field: "sku", headerCheckboxSelection: true, checkboxSelection: true},
      {headerName: "Stock Quantity", field: "inventory"},
      {headerName: "Cost Price", field: "costPrice"},
      {headerName: "Selling Price", field: "sellingPrice"},
      {headerName: "Variant Info", field: "attributes",cellRenderer: attributesCellRenderer}
    ]
    
    const onPaginationChanged = useCallback((event) => {
      // Workaround for bug in events order
     let pageSize=  gridRef.current.api.paginationGetPageSize();
     setPaginationPageSize(pageSize)
    }, []);

    const getCategories = useCallback(async () => {
      const response = await getCategoriesReq();
      setCategories(response?.payload?.categories)
    });

    useEffect(() => {
      props.setBreadcrumbItems("View Item Details", breadcrumbItems);
      if (!effectCalled.current) {
        getItemData(bodyObject);
        getCategories();
        effectCalled.current=true;
      }
    },[]); 

    useEffect(() => {
      props.setBreadcrumbItems("View Item Details", breadcrumbItems);
      if(paginationPageSize && paginationPageSize !== undefined){
        getItemData(bodyObject);
        getCategories();
      }
    },[paginationPageSize]);

  return (
    <>
      <div style={{ position: "relative" }}>
        <ToastContainer position="top-center" theme="colored" />
        <Col>
          <Card>
            <CardBody>
              <h4 className="card-title">{data.title}</h4>
              <hr></hr>
              <div className="mt-2" style={{ display: "flex", gap: "20px" }}>
                  {itemsData?.description}
              </div>
            </CardBody>
          </Card>
          <Row>
          <Col xs="6">
            <Card>
              <CardBody>
                <h4 className="card-title">Item Primary</h4>
                <hr></hr>
                <div className="mt-3">
                  <Row>
                    <Col xs="4">
                      <p>HSN Code:</p>
                    </Col>
                    <Col xs="8">
                      <p>{itemsData?.hsnCode}</p>
                    </Col>
                  </Row>
                </div>
                <div>
                  <Row>
                    <Col xs="4">
                      {" "}
                      <p>Category:</p>
                    </Col>
                    <Col xs="8">
                      <p>{findCategoryNameById(itemsData?.category, categories)}</p>
                    </Col>
                  </Row>
                </div>
                <div>
                  <Row>
                    <Col xs="4">
                      {" "}
                      <p>Item Type:</p>
                    </Col>
                    <Col xs="8">
                      {" "}
                      <p>{itemsData?.itemType}</p>
                    </Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xs="6">
            <Card>
              <CardBody>
                <h4 className="card-title">Tax Information</h4>
                <hr></hr>
                <div className="mt-3">
                  <Row>
                    <Col xs="4">
                      <p>Tax Preference:</p>
                    </Col>
                    <Col xs="8">
                      <p>{itemsData?.taxPreference}</p>
                    </Col>
                  </Row>
                </div>
                <div>
                  <Row>
                    <Col xs="4">
                      {" "}
                      <p>Tax Bracket:</p>
                    </Col>
                    <Col xs="8">
                      <p>{itemsData?.category}</p>
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
                      <p>{itemsData?.itemType}</p>
                    </Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
          </Col>
          </Row>
          <Card>
            <CardBody>
              <h4 className="card-title">{data.title}</h4>
              <hr></hr>
              <div className="mt-2" style={{ display: "flex", gap: "20px" }}>
              <div
                            className="ag-theme-quartz"
                            style={{
                                height: '250px',
                                width: '100%'
                            }}
                        >
                            <AgGridReact
                                ref={gridRef}
                                suppressRowClickSelection={true}
                                columnDefs={columnDefs}
                                pagination={pagination}
                                paginationPageSize={paginationPageSize}
                                paginationPageSizeSelector={paginationPageSizeSelector}
                                rowSelection="multiple"
                                reactiveCustomComponents
                                autoSizeStrategy={autoSizeStrategy}
                                rowData={variantData}
                                onPaginationChanged={onPaginationChanged}>
                            </AgGridReact>
                        </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </div>
    </>
  );
};



export default connect(null, { setBreadcrumbItems })(ViewItems);
