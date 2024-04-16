import React, { useEffect, useRef, useState, useCallback } from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { getItemByIdReq } from "../../service/itemService";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-quartz.css";
import { attributesCellRenderer } from "./ItemsUtils";
import { formatNumberWithCommasAndDecimal } from "../Invoices/invoiceUtil";
import { MODULES_ENUM, PERMISSIONS_ENUM } from "../../utility/constants";
import RequirePermission from "../../routes/middleware/requirePermission";

const ViewItems = (props, { route, navigate }) => {
  let navigateTo = useNavigate();
  const [itemsData, setItemsData] = useState();
  const [variantData, setVariantData] = useState([]);
  const [taxData, setTaxData] = useState();
  const { id } = useParams();
  const effectCalled = useRef(false);
  const gridRef = useRef();

  //Handles BreadCrumbs
  const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Items", link: "/items" },
    { title: itemsData?.title, link: "#" },
  ];

  const autoSizeStrategy = {
    type: "fitGridWidth",
  };

  let bodyObject = {
    _id: id,
  };

  const redirectToEditPage = (id) => {
    let path = `/edit-item/${id}`;
    setTimeout(() => {
      navigateTo(path, id);
    }, 300);
  };

  const handleEditClick = (id) => {
    redirectToEditPage(id);
  };

  const getItemData = useCallback(async (body) => {
    const response = await getItemByIdReq(body);

    if (
      response &&
      response.payload &&
      response.payload.item &&
      response.payload.variants
    ) {
      const item = response.payload.item;
      setItemsData(item);
      const variants = Object.values(response.payload.variants);
      setVariantData(variants);
      if (item.taxes) {
        setTaxData(item?.taxes);
      }
    }
  });
  const pagination = false;

  // sets 10 rows per page (default is 100)
  // allows the user to select the page size from a predefined list of page sizes
  const paginationPageSizeSelector = [5, 10, 25, 50];
  const [paginationPageSize, setPaginationPageSize] = useState(5);

  const columnDefs = [
    {
      headerName: "SKU",
      field: "sku",
      sortable: false,
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
    },
    {
      headerName: "Stock Quantity",
      sortable: false,
      field: "inventory",
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
    },
    {
      headerName: "Cost Price",
      sortable: false,
      field: "costPrice",
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      valueFormatter: (params) =>
        formatNumberWithCommasAndDecimal(params.value),
    },
    {
      headerName: "Selling Price",
      sortable: false,
      field: "sellingPrice",
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      valueFormatter: (params) =>
        formatNumberWithCommasAndDecimal(params.value),
    },
    {
      headerName: "Variant Info",
      field: "attributes",
      sortable: false,
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      cellRenderer: attributesCellRenderer,
    },
  ];

  const onPaginationChanged = useCallback((event) => {
    // Workaround for bug in events order
    let pageSize = gridRef.current.api.paginationGetPageSize();
    setPaginationPageSize(pageSize);
  }, []);

  // const getCategories = useCallback(async () => {
  //   const response = await getCategoriesReq();
  //   // setCategories(response?.payload?.categories)
  // });

  useEffect(() => {
    props.setBreadcrumbItems(itemsData?.title, breadcrumbItems);
    if (!effectCalled.current) {
      getItemData(bodyObject);
      // getCategories();
      effectCalled.current = true;
    }
  }, [bodyObject]);

  useEffect(() => {
    props.setBreadcrumbItems(itemsData?.title, breadcrumbItems);
    if (paginationPageSize && paginationPageSize !== undefined) {
      getItemData(bodyObject);
      // getCategories();
    }
  }, [paginationPageSize]);

  return (
    <>
      <div style={{ position: "relative" }}>
        <ToastContainer position="top-center" theme="colored" />
        <RequirePermission
          module={MODULES_ENUM.ITEMS}
          permission={PERMISSIONS_ENUM.UPDATE}
        >
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
            <button
              type="submit"
              onClick={() => handleEditClick(itemsData?._id)}
              className="btn btn-primary w-xl mx-3"
            >
              Edit
            </button>
          </div>
        </RequirePermission>
        <Col>
          <Card>
            <CardBody>
              <h6 className="secondary">Product Name</h6>
              <h className="card-title">{itemsData?.title}</h>
              <hr></hr>
              <h6 className="secondary">Description</h6>
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
                        <p>{itemsData?.category?.name}</p>
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
                        <p>
                          {taxData && taxData[0] && <p>{taxData[0].name}</p>}
                        </p>
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
              <h4 className="card-title">{itemsData?.title}</h4>
              <hr></hr>
              <div className="mt-2" style={{ display: "flex", gap: "20px" }}>
                <div
                  className="ag-theme-quartz"
                  style={{
                    height: "250px",
                    width: "100%",
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
                    onPaginationChanged={onPaginationChanged}
                  ></AgGridReact>
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
