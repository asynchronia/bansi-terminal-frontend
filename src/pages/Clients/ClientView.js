import React,{useEffect} from "react";
import { setBreadcrumbItems } from "../../store/actions";
import { connect } from "react-redux";
import { Row, Col, Card, CardBody, CardTitle, Form, Input, Label, FormFeedback, Button } from "reactstrap";


const ClientView = (props) =>{
    document.title = "Categories";
    const breadcrumbItems = [
      
      { title: "Dashboard", link: "#" },
      { title: "Clients", link: "#" }
      
    ];
    useEffect(() => {
        props.setBreadcrumbItems('Clients', breadcrumbItems);
        
      },[]);
    return(
        <>
        <Row>
        <Col md={6}>
          <Card>
            <CardBody>
              <CardTitle className="h4">Agreement</CardTitle>
              </CardBody>
          </Card>
        </Col>
        <Col xl={6}>
            <Card>
            <CardBody>
            </CardBody>
        </Card>
        </Col>
        </Row>
        </>
    )
}
export default connect(null, { setBreadcrumbItems })(ClientView);
