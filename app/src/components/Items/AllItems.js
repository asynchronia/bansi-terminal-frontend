import React,{useEffect} from "react";
import { Row, Col, Card, CardBody, CardTitle } from "reactstrap"

import { connect } from "react-redux";

import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-quartz.css';

/*.dropdown-toggle::after {
  display: none !important; 
}*/

//Import Action to copy breadcrumb items from local state to redux state
import { setBreadcrumbItems } from "../../store/Breadcrumb/actions";

import "../../pages/Tables/datatables.scss";
import "./styles/AllItems.scss";
import DropdownMenuBtn from "./DropdownMenuBtn";

const AllItems = (props) => {
  document.title = "All Items";
  const breadcrumbItems = [
    
    { title: "Dashboard", link: "#" },
    { title: "All Items Order", link: "#" },
    
  ];


  useEffect(() => {
    props.setBreadcrumbItems('Purchase Orders', breadcrumbItems);

  })
  
const  columnDefs =  [
    {headerName: "Item Name", field: "itemName", headerCheckboxSelection: true, checkboxSelection: true},
    {headerName: "Type", field: "type"},
    {headerName: "Status", field: "status"},
    {headerName: "HSN Code", field: "hsnCode"},
    {headerName: "Category", field: "category"},
    {headerName: "Sale Price", field: "salePrice"},
    {headerName: "GST", field: "gst"},
    {headerName: "Created On", field: "created"},
    {headerName: "Action", field: "action",
    cellClass:"actions-button-cell",
    cellRenderer: DropdownMenuBtn
}

], agRowData =  [
    {itemName: "Byju's", type: "Variable", status: 'published', hsnCode:"ABU-123888", category: 'electronics', salePrice: '500', gst: '18%', created: '13 march 2010'},
    {itemName: "Byju's", type: "Variable", status: 'published', hsnCode:"ABU-123888", category: 'electronics', salePrice: '500', gst: '18%', created: '13 march 2010'},
    {itemName: "Byju's", type: "Variable", status: 'published', hsnCode:"ABU-123888", category: 'electronics', salePrice: '500', gst: '18%', created: '13 march 2010'},
    {itemName: "Byju's", type: "Variable", status: 'published', hsnCode:"ABU-123888", category: 'electronics', salePrice: '500', gst: '18%', created: '13 march 2010'},
    {itemName: "Byju's", type: "Variable", status: 'published', hsnCode:"ABU-123888", category: 'electronics', salePrice: '500', gst: '18%', created: '13 march 2010'},
];
const autoSizeStrategy = {
    type: 'fitGridWidth'
};

  return (
    <React.Fragment>
        
          <Row>
            <Col className="col-12">
              <Card>
                <CardBody>
                  <CardTitle className="h4">Purchase Orders</CardTitle>
                    <div
                            className="ag-theme-quartz"
                            style={{
                                height: '500px',
                                width: '100%'
                            }}
                        >
                            <AgGridReact
                                suppressRowClickSelection={true}
                                columnDefs={columnDefs}
                                pagination={true}
                                rowSelection="multiple"
                                reactiveCustomComponents
                                autoSizeStrategy={autoSizeStrategy}
                                rowData={agRowData}>

                            </AgGridReact>
                        </div>
            </CardBody>
              </Card>
            </Col>
          </Row>
    </React.Fragment>
  )
}

export default connect(null, { setBreadcrumbItems })(AllItems);