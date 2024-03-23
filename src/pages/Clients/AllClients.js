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
    { headerName: "Name", field: "name", headerCheckboxSelection: true, checkboxSelection: true, comparator: () => false },
    { headerName: "Status", field: "status", sortable: false },
    { headerName: "Primary Email", field: "email", sortable: false },
    { headerName: "Type", field: "clientType", comparator: () => false },
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
  ];
  
  //TODO to check for autoSizeStrategy
  const autoSizeStrategy = {
    type: 'fitGridWidth'
  };

  // const paginationPageSizeSelector = [5, 10, 20, 50, 100];
  const paginationPageSizeSelector = [1, 2, 3, 4, 5];

  // TODO check from where status will come.
  const [allStatuses, setAllStatuses] = useState(['active', 'inactive']);
  const [status, setStatus] = useState("");
  const [rowData, setRowData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [paginationPageSize, setPaginationPageSize] = useState(5);
  const [sortData, setSortData] = useState(null);
  const [page, setPage] = useState(1);

  const onPaginationChanged = useCallback((event) => {
    // Workaround for bug in events order
    let pageSize = gridRef.current.api.paginationGetPageSize();
    setPaginationPageSize(pageSize);
    const page = gridRef.current.api.paginationGetCurrentPage() + 1;
    setPage(page);
  }, []);

  useEffect(() => {
    props.setBreadcrumbItems('Clients', breadcrumbItems);
    getListOfRowData();
  }, []);

  useEffect(() => {
    getListOfRowData();
  }, [page, paginationPageSize]);

  useEffect(() => {
    props.setBreadcrumbItems('Clients', breadcrumbItems);
    if (status && status !== undefined && status !== "") {
      getListOfRowData();
    }
  }, [status]);

  useEffect(() => {
    props.setBreadcrumbItems('Clients', breadcrumbItems);
    if (searchValue && searchValue !== undefined && searchValue !== "") {
      getListOfRowData();
    } else {
      setPaginationPageSize(paginationPageSize);
      getListOfRowData();
    }
  }, [searchValue]);

  useEffect(() => {
    if (sortData?.key && sortData?.order) {
      getListOfRowData();
    }
  }, [sortData]);

  const getListOfRowData = useCallback(async () => {
    const response = await getClientsReq({
      page,
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
    });

    if (response) {
      const { payload: { clients, total } } = response;
      const emptyCount = total - clients.length;
      const emptyObjects = Array.from({ length: emptyCount }, () => ({}));

      // Combine clients and empty objects

      let filledClients = [...clients];
      if (rowData.length === 0) {
        filledClients = [...clients, ...emptyObjects];
      }

      // Replace the section of data for the current page
      const newData = [...rowData];
      newData.splice((page - 1) * paginationPageSize, paginationPageSize, ...filledClients);
      setRowData(newData);
    }
  });

  const handleChange = (e) => {
    setRowData([]);
    setPage(1);
    setStatus(e.target.value);
  }
  const handleInputChange = (e) => {
    setRowData([]);
    setPage(1);
    setSearchValue(e.target.value);
  }

  const handleSortChange = (e) => {
    const columns = gridRef.current.api.getColumnState();
    const ele = columns.find(ele => ele.sort === 'asc' || ele.sort === 'desc');

    if (ele) {
      setRowData([]);
      setPage(1);
      setSortData({
        key: ele.colId,
        order: ele.sort,
      });
    }
  }

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
                    pagination
                    paginationPageSize={paginationPageSize}
                    paginationPageSizeSelector={paginationPageSizeSelector}
                    rowSelection="multiple"
                    reactiveCustomComponents
                    rowData={rowData}
                    onPaginationChanged={onPaginationChanged}
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