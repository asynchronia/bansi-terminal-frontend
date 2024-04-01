import React,{useEffect, useState} from "react"
import { MDBDataTable, MDBInput } from "mdbreact";
import {MDBTable, MDBCheckbox , MDBTableBody, MDBTableHead} from "mdb-react-ui-kit";
import MUIDataTable from "mui-datatables";
import { Row, Col, Card, CardBody, CardTitle } from "reactstrap"

import { connect } from "react-redux";

import { setBreadcrumbItems } from "../../store/Breadcrumb/actions";

import "../../pages/Tables/datatables.scss";

const AllItems = (props) => {
  document.title = "Purchase Orders";
const[checked, setChecked] = useState([]);
const [data, setData] = useState({columns:[], rows:[]});
  const breadcrumbItems = [
    
    { title: "Dashboard", link: "#" },
    { title: "Purchase Order", link: "#" },
    
  ]
  const isChecked = id => checked.filter(name => name === id)[0] ? true : false
  const toggleCheck = e => {
    let checkedArr = checked;
    checkedArr.filter(name => name === e.target.id)[0] 
      ? checkedArr = checkedArr.filter(name => name !== e.target.id)
      : checkedArr.push(e.target.id);
    setChecked(checkedArr)
  };
  const options = {
    filterType: "textField",
    fixedHeader: true,
    sort: true,
    search: true,
    selectableRows: "multiple",
    responsive: "scrollMaxHeight",
    rowsPerPage: 15,
    rowHove: true,
    selectableRowsHeader: true,
    expandableRows: true,
    expandableRowsOnClick: true,
    renderExpandableRow: (rowData, rowMeta) => {
     /* return (
        <TableRow>
          <TableCell colSpan={6} className={classes.expandRow}>
            {this.state.comments && JSON.stringify(this.state.comments)}
          </TableCell>
        </TableRow>
      );*/
    },
    onRowsClick: (rowData, rowMeta) => {
      console.log("rowData", rowData);
      //this.handleClick(this.state.data[rowMeta.dataIndex]);
    },
    onRowsExpand: (curExpanded, allExpanded) => {
      console.log("rowExpand", curExpanded, allExpanded[0]);
      //this.handleClick(this.state.data[allExpanded[0].dataIndex]);
    }
  };
  useEffect(() => {
    let checked = [];
    let initData = {
        columns:[
              {
                label: 'Name',
                field: 'name',
                sort: 'asc',
                width: 150
              },
              {
                label: 'Position',
                field: 'position',
                sort: 'asc',
                width: 270
              },
              {
                label: 'Office',
                field: 'office',
                sort: 'asc',
                width: 200
              },
              {
                label: 'Age',
                field: 'age',
                sort: 'asc',
                width: 100
              },
              {
                label: 'Start date',
                field: 'date',
                sort: 'asc',
                width: 150
              },
              {
                label: 'Salary',
                field: 'salary',
                sort: 'asc',
                width: 100
              }
        ],
        rows: [
          {
            name: "Tiger Nixon",
            position: "System Architect",
            office: "Edinburgh",
            age: "61",
            date: "2011/04/25",
            salary: "$320",
          },
          {
            name: "Garrett Winters",
            position: "Accountant",
            office: "Tokyo",
            age: "63",
            date: "2011/07/25",
            salary: "$170",
          },
          {
            name: "Ashton Cox",
            position: "Junior Technical Author",
            office: "San Francisco",
            age: "66",
            date: "2009/01/12",
            salary: "$86",
          },
          {
            name: "Cedric Kelly",
            position: "Senior Javascript Developer",
            office: "Edinburgh",
            age: "22",
            date: "2012/03/29",
            salary: "$433",
          },
          {
            name: "Airi Satou",
            position: "Accountant",
            office: "Tokyo",
            age: "33",
            date: "2008/11/28",
            salary: "$162",
          },
          {
            name: "Brielle Williamson",
            position: "Integration Specialist",
            office: "New York",
            age: "61",
            date: "2012/12/02",
            salary: "$372",
          },
          
        ],
      };
  /*  initData && initData.rows.map((ele,idx) => {
        let cbVal  = 'checkbox'+idx ;
        checked.push(cbVal);
        ele.check = <MDBCheckbox label=' ' type='checkbox' id={cbVal} onClick={toggleCheck} checked={isChecked(cbVal)}/>;
    });*/
    console.log("Data Value >> "+data);
    setChecked(checked);
    setData(initData);
  },[]);

  useEffect(() => {
    props.setBreadcrumbItems('Purchase Orders', breadcrumbItems);

  })

  
  const getHeader =() =>{
        return (
            <MDBTableHead light>
                    <tr>
                    <th scope='col'>
                        <MDBCheckbox></MDBCheckbox>
                    </th>
                    <th scope='col'>Lorem</th>
                    <th scope='col'>Ipsum</th>
                    <th scope='col'>Dolor</th>
                    </tr>
                </MDBTableHead>
        );
  }
  return (
    <React.Fragment>
        <Row>
            <Col className="col-12">
              <Card>
                <CardBody>
                  <CardTitle className="h4">Purchase Orders </CardTitle>
                <MDBTable align='middle' >
                
                <MDBTableBody>
                    <tr>
                    <th scope='col'>
                        <MDBCheckbox></MDBCheckbox>
                    </th>
                    <td>Sit</td>
                    <td>Amet</td>
                    <td>Consectetur</td>
                    </tr>
                    <tr>
                        <th scope='col'>
                            <MDBCheckbox></MDBCheckbox>
                        </th>
                        <td>Adipsicing</td>
                        <td>Elit</td>
                        <td>Sint</td>
                    </tr>
                    <tr>
                        <th scope='col'>
                            <MDBCheckbox></MDBCheckbox>
                        </th>
                        <td>Adipsicing</td>
                        <td>Elit</td>
                        <td>Sint</td>
                    </tr>
                    <tr>
                        <th scope='col'>
                            <MDBCheckbox></MDBCheckbox>
                        </th>
                        <td>Adipsicing</td>
                        <td>Elit</td>
                        <td>Sint</td>
                    </tr>
                    <tr>
                        <th scope='col'>
                            <MDBCheckbox></MDBCheckbox>
                        </th>
                        <td>Adipsicing</td>
                        <td>Elit</td>
                        <td>Sint</td>
                    </tr>
                    <tr>
                    <th scope='col'>
                        <MDBCheckbox></MDBCheckbox>
                    </th>
                    <td>Hic</td>
                    <td>Fugiat</td>
                    <td>Temporibus</td>
                    </tr>
                </MDBTableBody>
                </MDBTable>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col className="col-12">
              <Card>
                <CardBody>
                  <CardTitle className="h4">Stripped example </CardTitle>
                  <p className="card-title-desc">
                    mdbreact DataTables has most features enabled by default, so
                    all you need to do to use it with your own tables is to call
                    the construction function:{" "}
                    <code>&lt;MDBDataTable striped /&gt;</code>.
                  </p>

                  <MDBDataTable responsive  striped bordered data={data} paging={true}/>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col className="col-12">
              <Card>
                <CardBody>
                  <CardTitle className="h4">MUI data table </CardTitle>
                    {data && (
                    <MUIDataTable
                        title={"Sample"}
                        data={data.rows}
                        columns={data.columns}
                        options={options}
                    />
                    )}
                </CardBody>
              </Card>
            </Col>
          </Row>
    </React.Fragment>
  )
}

export default connect(null, { setBreadcrumbItems })(AllItems);