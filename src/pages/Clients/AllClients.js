import React, { useEffect, useState, useRef, useCallback } from "react";
import { Row, Col, Card, CardBody, CardTitle, Button, Input, Modal } from "reactstrap"
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-quartz.css';
import { setBreadcrumbItems } from "../../store/Breadcrumb/actions";
import { getClientsReq } from "../../service/clientService";
import "./styles/datatables.scss";
import "./styles/AllClients.scss";

import plusIcon from "../../assets/images/small/plus-icon.png";
import minusIcon from "../../assets/images/small/minus-icon.png";
import ClientActionField from "./ClientActionField";

const AllClients = (props) => {
  document.title = "Clients";
  const breadcrumbItems = [

    { title: "Dashboard", link: "#" },
    { title: "Clients", link: "#" },

  ];
  const gridRef = useRef();
  let navigate = useNavigate();
  const redirectToCreateClient = () => {
    let path = "/client/add";
    navigate(path);
  }
  const onViewClick = (id) => {
    let path = `/client/${id}`;
    setTimeout(() => {
      navigate(path, id);
    }, 300);
  }
  const columnDefs = [
    { headerName: "Name", field: "name", headerCheckboxSelection: true, checkboxSelection: true },
    { headerName: "Status", field: "status", sortable: false },
    { headerName: "Primary Email", field: "email", sortable: false  },
    { headerName: "Type", field: "clientType" },
    { headerName: "GST Number", field: "gstin", sortable: false },
    {
      headerName: "Action", field: "action",
      cellClass: "actions-button-cell",
      cellRenderer: ClientActionField,
      cellRendererParams: {
        handleViewClick: onViewClick
      },
      sortable: false,
    }
  ],
    agRowData = [
      { name: "Byju's", type: "Business", status: 'enabled', email: "rampal@byjus.com", gst: 'IMQWE978612312578', amount: '500,600' },
      { name: "Byju's", type: "Business", status: 'enabled', email: "rampal@byjus.com", gst: 'IMQWE978612312578', amount: '500,600' },
      { name: "Byju's", type: "Business", status: 'enabled', email: "rampal@byjus.com", gst: 'IMQWE978612312578', amount: '500,600' },
      { name: "Byju's", type: "Business", status: 'enabled', email: "rampal@byjus.com", gst: 'IMQWE978612312578', amount: '500,600' },
      { name: "Byju's", type: "Business", status: 'enabled', email: "rampal@byjus.com", gst: 'IMQWE978612312578', amount: '500,600' },
    ];
  const autoSizeStrategy = {
    type: 'fitGridWidth'
  };
  // enables pagination in the grid
  const pagination = true;

  // sets 10 rows per page (default is 100)
  // allows the user to select the page size from a predefined list of page sizes
  // const paginationPageSizeSelector = [5, 10, 20, 50, 100];
  const paginationPageSizeSelector = [1, 2, 3, 4, 5];

  const [allStatuses, setAllStatuses] = useState(['active', 'inactive']);
  const [status, setStatus] = useState("");
  const [rowData, setRowData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [gridApi, setGridApi] = useState(null);
  const [paginationPageSize, setPaginationPageSize] = useState(5);
  const [sortData, setSortData] = useState(null);

  let bodyObject = {
    "page": 1,
    "limit": paginationPageSize
  };
  const onPaginationChanged = useCallback((event) => {
    // Workaround for bug in events order
    let pageSize = gridRef.current.api.paginationGetPageSize();
    setPaginationPageSize(pageSize);
  }, []);

  /*
  {
      "page": 1,
      "limit": 10,
      "search": "p",
      "sort": {
          "key": "createdAt",
          "order": "asc"
      },
      "filter": {
          "gst": "65bab211ce0f79d56447c537"
      }
  }
  * */





  useEffect(() => {
    props.setBreadcrumbItems('Clients', breadcrumbItems);
    // getListOfRowData(bodyObject);
    // getCategories();
  }, []);

  useEffect(() => {
    props.setBreadcrumbItems('Clients', breadcrumbItems);
    if (status && status !== undefined && status !== "") {
      let bodyObjectWithgst = { ...bodyObject };
      bodyObjectWithgst.filter = {};
      bodyObjectWithgst.filter.status = status;
      // getListOfRowData(bodyObjectWithgst);
      setPaginationPageSize(paginationPageSize);
      // gridApi.refreshCells(params);
    } else {

    }
  }, [status]);

  useEffect(() => {
    props.setBreadcrumbItems('Clients', breadcrumbItems);
    if (searchValue && searchValue !== undefined && searchValue !== "") {
      let bodyObjectWithgst = { ...bodyObject };
      bodyObjectWithgst.search = searchValue;
      setPaginationPageSize(paginationPageSize);
    } else {
      setPaginationPageSize(paginationPageSize);
    }
  }, [searchValue]);

  const handleChange = (e) => {
    setStatus(e.target.value);
  }
  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  }

  const handleSortChange = (e) => {
    const columns = gridRef.current.api.getColumnState();
    const { colId, sort } = columns.find(ele => ele.sort === 'asc' || ele.sort === 'desc');
    setSortData({
      key: colId,
      order: sort,
    });
  }
  const serverSideDatasource = {
    // called by the grid when more rows are required
    getRows: async (params) => {

      // get data for request from server
      const response = await getClientsReq({
        page: Math.max(params.request.endRow / paginationPageSize, 1),
        limit: paginationPageSize,
        ...(status ? ({
            filter: {
              status,
            }
          }
        ) : {}),
        ...(searchValue ? ({
            search: searchValue
          }
        ) : {}),
        ...(sortData ? ({
          sort: sortData,
        }) : {}),
      })

      if (response.success) {
        // supply rows for requested block to grid
        // setRowData(response.payload.client);
        params.success({
          rowData: response.payload.clients,
          rowCount: response.payload.total,
        });
      } else {
        // inform grid request failed
        params.fail();
      }
    },
  };

  useEffect(() => {
    if (sortData?.key && sortData?.order) {
      setPaginationPageSize(paginationPageSize);
    }
  }, [sortData]);

  return (
    <React.Fragment>
      <div className="all-clients">
        <Row>
          <Col className="col-12">
            <Card>
              <CardBody>
                <div className="button-section">
                  <Button className="all-items-btn" color="primary" onClick={redirectToCreateClient}>

                    <img src={plusIcon} style={{ width: 15 }} />
                    Add New Client
                  </Button>
                  <Button color="secondary">
                    Import Customers
                  </Button>
                  <div className="button-right-section">
                    <div class="input-group">

                      <div className="search-box position-relative">
                        <Input type="text"
                          value={searchValue}
                          onChange={handleInputChange} className="form-control rounded border" placeholder="Search..." />
                        <i className="mdi mdi-magnify search-icon"></i>
                      </div>
                      {/*<input
                        className="form-control border-end-0 border"
                          placeholder="Search for..."
                          value={searchValue}
                          onChange={handleInputChange}
                        />
                          <span class="input-group-append">
                              <button class="btn btn-outline-secondary bg-white border-start-0 border ms-n5" type="button">
                                  <i class="fa fa-search"></i>
                              </button>
                        </span>*/}
                    </div>
                    <select
                      onChange={handleChange}
                      id="client-status"
                      name="client-status"
                      value={status}
                      className="form-select focus-width"
                    >
                      <option value="" selected>{"Status"}</option>
                      {allStatuses.map(ele => (
                        <option value={ele}>{ele}</option>
                      ))}
                    </select>
                  </div>

                </div>
                <div
                  className="ag-theme-quartz"
                  style={{
                    height: '500px',
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
                    // rowData={rowData}
                    onPaginationChanged={onPaginationChanged}
                    rowModelType={'serverSide'}
                    serverSideDatasource={serverSideDatasource}
                    cacheBlockSize={paginationPageSize}
                    onSortChanged={handleSortChange}
                  >
                  </AgGridReact>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  )
}

export default connect(null, { setBreadcrumbItems })(AllClients);