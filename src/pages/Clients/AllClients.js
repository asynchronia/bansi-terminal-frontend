import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
  Input,
  Modal,
} from "reactstrap";
import { connect, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { setBreadcrumbItems } from "../../store/Breadcrumb/actions";
import { getClientsReq } from "../../service/clientService";
import "./styles/datatables.scss";
import "./styles/AllClients.scss";

import ClientActionField from "./ClientActionField";
import { changePreloader } from "../../store/actions";

import { ReactComponent as Import } from "../../assets/images/svg/import-button.svg";
import { Add } from "@mui/icons-material";

const AllClients = (props) => {
  document.title = "Clients";
  const dispatch = useDispatch();

  const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Clients", link: "/clients" },
  ];
  const gridRef = useRef();
  let navigate = useNavigate();
  const redirectToCreateClient = () => {
    let path = "/client/add";
    navigate(path);
  };
  const onViewClick = (id) => {
    let path = `/client/${id}`;
    setTimeout(() => {
      navigate(path, id);
    }, 300);
  };
  const columnDefs = [
    {
      headerName: "Name",
      field: "name", flex: 1,
      tooltipField: "name",
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
      comparator: () => false,
    },
    {
      headerName: "Status",
      field: "status", width: 100,
      sortable: false,
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
    },
    {
      headerName: "Primary Email", flex: 1,
      field: "email",
      tooltipField: "email",
      sortable: false,
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
    },
    {
      headerName: "Type",
      field: "clientType", width: 100,
      suppressMenu: true,
      comparator: () => false,
      floatingFilterComponentParams: { suppressFilterButton: true },
    },
    {
      headerName: "GST Number",
      field: "gstin",
      sortable: false,
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
    },

    {
      headerName: "Action",
      field: "action", width: 100,
      cellClass: "actions-button-cell",
      cellRenderer: ClientActionField,
      cellRendererParams: {
        handleViewClick: onViewClick,
      },
      sortable: false,
      suppressMenu: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
    },
  ];

  //TODO to check for autoSizeStrategy
  const autoSizeStrategy = {
    type: "fitGridWidth",
  };

  // const paginationPageSizeSelector = [5, 10, 20, 50, 100];
  const paginationPageSizeSelector = [25, 50, 100];

  // TODO check from where status will come.
  const [allStatuses, setAllStatuses] = useState(["Active", "Inactive"]);
  const [status, setStatus] = useState("");
  const [rowData, setRowData] = useState([]);
  const [searchValue, setSearchValue] = useState(null);
  const [searchInputValue, setSearchInputValue] = useState(null);
  const timerRef = useRef(null);

  const [paginationPageSize, setPaginationPageSize] = useState(25);
  const [sortData, setSortData] = useState(null);
  const [page, setPage] = useState(1);

  const onPaginationChanged = useCallback((event) => {
    // Workaround for bug in events order
    const pageSize = gridRef.current.api.paginationGetPageSize();

    if (pageSize !== paginationPageSize) {
      setPaginationPageSize(pageSize);
    }
    const newPage = gridRef.current.api.paginationGetCurrentPage() + 1;

    if (page !== newPage) {
      setPage(newPage);
    }
  }, []);

  useEffect(() => {
    getListOfRowData("page");
  }, [page, paginationPageSize]);

  useEffect(() => {
    props.setBreadcrumbItems("Clients", breadcrumbItems);
    console.log(status);
    if (status && status !== undefined) {
      getListOfRowData("status");
    }
  }, [status]);

  useEffect(() => {
    props.setBreadcrumbItems("Clients", breadcrumbItems);
    if (searchValue || searchValue === "") {
      getListOfRowData("search");
    }
  }, [searchValue]);

  useEffect(() => {
    if (sortData?.key && sortData?.order) {
      getListOfRowData("sort");
    }
  }, [sortData]);

  const getListOfRowData = useCallback(
    async (param) => {
      if (rowData[(page - 1) * paginationPageSize]) {
        return;
      }

      dispatch(changePreloader(true));
      const response = await getClientsReq({
        page,
        limit: paginationPageSize,
        ...(status && status !== "Select Status"
          ? {
            filter: {
              status: status.toLowerCase(),
            },
          }
          : {}),
        ...(searchValue
          ? {
            search: searchValue,
          }
          : {}),
        ...(sortData
          ? {
            sort: sortData,
          }
          : {}),
      });

      setTimeout(() => {
        dispatch(changePreloader(false));
      }, 1000);

      if (response) {
        const {
          payload: { clients, total },
        } = response;
        const emptyCount = total - clients.length;
        const emptyObjects = Array.from({ length: emptyCount }, () => null);

        // Combine clients and empty objects

        let filledClients = [...clients];
        if (rowData.length === 0) {
          filledClients = [...clients, ...emptyObjects];
        }

        // Replace the section of data for the current page
        const newData = [...rowData];
        newData.splice(
          (page - 1) * paginationPageSize,
          paginationPageSize,
          ...filledClients
        );
        setRowData(newData);
      }
    },
    [page, paginationPageSize, status, searchValue, sortData]
  );

  const handleChange = (e) => {
    console.log("Status value", e.target.value);
    setRowData([]);
    setPage(1);
    setStatus(e.target.value);
  };
  const handleInputChange = (e) => {
    setSearchInputValue(e.target.value?.trim());
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setRowData([]);
      setPage(1);
      setSearchValue(e.target.value?.trim());
    }, 1000);
  };

  const handleSortChange = (e) => {
    const columns = gridRef.current.api.getColumnState();
    const ele = columns.find(
      (ele) => ele.sort === "asc" || ele.sort === "desc"
    );

    if (ele) {
      setRowData([]);
      setPage(1);
      setSortData({
        key: ele.colId,
        order: ele.sort,
      });
    }
  };

  return (
    <React.Fragment>
      <div className="all-clients">
        <Row>
          <Col className="col-12">
            <Card>
              <CardBody>
                <div className="button-section">
                  <Button
                    className="all-items-btn"
                    color="primary"
                    onClick={redirectToCreateClient}
                  >
                    <Add />
                    Add New Client
                  </Button>
                  {/* TODO <Button
                    style={{
                      color: "black",
                      backgroundColor: "#bfd8f7",
                      border: "none",
                    }}
                  >
                    <Import style={{ marginRight: "5px" }} />
                    Import Customers
                  </Button> */}
                  <div className="button-right-section">
                    <div className="input-group">
                      <div className="search-box position-relative">
                        <Input
                          type="text"
                          value={searchInputValue}
                          onChange={handleInputChange}
                          className="form-control rounded border"
                          placeholder="Search..."
                        />
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
                      <option value="Select Status" selected>
                        {"Select Status"}
                      </option>
                      {allStatuses.map((ele) => (
                        <option value={ele}>{ele}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div
                  className="ag-theme-quartz"
                  style={{
                    height: "500px",
                    width: "100%",
                  }}
                >
                  <AgGridReact
                    ref={gridRef}
                    columnDefs={columnDefs}
                    defaultColDef={{ resizable: false, suppressMovable: true }}
                    pagination
                    paginationPageSize={paginationPageSize}
                    paginationPageSizeSelector={paginationPageSizeSelector}
                    reactiveCustomComponents
                    rowData={rowData}
                    onPaginationChanged={onPaginationChanged}
                    onSortChanged={handleSortChange}
                    sortingOrder={["desc", "asc"]}
                  ></AgGridReact>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default connect(null, { setBreadcrumbItems })(AllClients);
