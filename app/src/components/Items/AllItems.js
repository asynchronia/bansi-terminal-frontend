import React,{useEffect, useState, useCallback} from "react";
import { Row, Col, Card, CardBody, CardTitle, Button } from "reactstrap"

import { connect } from "react-redux";

import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-quartz.css';

/*.dropdown-toggle::after {
  display: none !important; 
}*/

//Import Action to copy breadcrumb items from local state to redux state
import { setBreadcrumbItems } from "../../store/Breadcrumb/actions";
import {getItemsReq } from "../../service/itemService";
import "../../pages/Tables/datatables.scss";
import "./styles/AllItems.scss";
import DropdownMenuBtn from "./DropdownMenuBtn";

const AllItems = (props) => {
  document.title = "All Items";
  const breadcrumbItems = [
    
    { title: "Dashboard", link: "#" },
    { title: "All Items Order", link: "#" },
    
  ];
 
/*const  columnDefs =  [
    {headerName: "Item Name", field: "title", headerCheckboxSelection: true, checkboxSelection: true},
    {headerName: "Type", field: "categoryN"},
    {headerName: "Status", field: "status"},
    {headerName: "HSN Code", field: "hsnCode"},
    {headerName: "Category", field: "category"},
    {headerName: "Sale Price", field: "salePrice"},
    {headerName: "GST", field: "gst"},
    {headerName: "Created On", field: "createdAt"},
    {headerName: "Action", field: "action",
    cellClass:"actions-button-cell",
    cellRenderer: DropdownMenuBtn
}*/
const columnDefs = [
    {headerName: "Item Name", field: "title", headerCheckboxSelection: true, checkboxSelection: true},
    {headerName: "Type", field: "itemType"},
    {headerName: "HSN Code", field: "hsnCode"},
    {headerName: "Status", field: "status"},
    {headerName: "Sale Price", field: "salePrice"},
    {headerName: "Created On", field: "createdAt", cellRenderer: (props)=>{
      console.log("created on props"+props.data);
      let date= new Date(props.value);
      return <>{date.toDateString()}</>
    }},
    {headerName: "Category", field: "category"},
    {headerName: "GST", field: "gst"},
    {headerName: "Action", field: "action",
    cellClass:"actions-button-cell",
    cellRenderer: DropdownMenuBtn
}
],
 agRowData =  [
    {itemName: "Byju's", type: "Variable", status: 'published', hsnCode:"ABU-123888", category: 'electronics', salePrice: '500', gst: '18%', created: '13 march 2010'},
    {itemName: "Byju's", type: "Variable", status: 'published', hsnCode:"ABU-123888", category: 'electronics', salePrice: '500', gst: '18%', created: '13 march 2010'},
    {itemName: "Byju's", type: "Variable", status: 'published', hsnCode:"ABU-123888", category: 'electronics', salePrice: '500', gst: '18%', created: '13 march 2010'},
    {itemName: "Byju's", type: "Variable", status: 'published', hsnCode:"ABU-123888", category: 'electronics', salePrice: '500', gst: '18%', created: '13 march 2010'},
    {itemName: "Byju's", type: "Variable", status: 'published', hsnCode:"ABU-123888", category: 'electronics', salePrice: '500', gst: '18%', created: '13 march 2010'},
];
const autoSizeStrategy = {
    type: 'fitGridWidth'
};
// enables pagination in the grid
const pagination = true;

// sets 10 rows per page (default is 100)
const paginationPageSize = 10;
const getListOfRowData =  useCallback(async () => {
    const response = await getItemsReq();
    console.log(response);
     response.map((val,id)=>{
        val.category = val.category.name;
        val.salePrice = val.variant.sellingPrice;
    });
    setRowData(response);
    
   
});
// allows the user to select the page size from a predefined list of page sizes
const paginationPageSizeSelector = [10, 20, 50, 100];
const [rowData, setRowData] = useState([]);

useEffect(() => {
    props.setBreadcrumbItems('All Items', breadcrumbItems);
   getListOfRowData();
   
  },[]);

/*
const onGridReady = useCallback((params) => {
    createItemReq
      .then((resp) => resp.json())
      .then((data) => {
        // add id to data
        var idSequence = 1;
        data.forEach(function (item) {
          item.id = idSequence++;
        });
        // setup the fake server with entire dataset
        var fakeServer = new FakeServer(data);
        // create datasource with a reference to the fake server
        var datasource = getItemsReq(fakeServer);
        // register the datasource with the grid
        params.api.setGridOption('serverSideDatasource', datasource);
      });
  }, []);
*/
  return (
    <React.Fragment>
        
          <Row>
            <Col className="col-12">
              <Card>
                <CardBody>
                    <div>
                    <Button
                      color="primary"
                    >
                     Create Item
                    </Button>
                    <Button
                      color="secondary"
                    >
                     Import Items
                    </Button>
                    </div>
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
                                pagination={pagination}
                                paginationPageSize={paginationPageSize}
                                paginationPageSizeSelector={paginationPageSizeSelector}
                                rowSelection="multiple"
                                reactiveCustomComponents
                                autoSizeStrategy={autoSizeStrategy}
                                rowData={rowData}>

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