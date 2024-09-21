import React from "react";
import { Card, CardBody, Row, Col } from "reactstrap";

const Miniwidget = (props) => {
  return (
    <React.Fragment>
      <Row>
        {props.reports.map((report, key) => (
          <Col sm={6} key={key}>
            <Card className="mini-stat">
              <CardBody className="card-body d-flex gap-4">
                <div className="mini-stat-icon bg-primary">
                  <i className={"float-start mdi mdi-chart-line"}></i>
                </div>
                <div className="">
                  <h2 className="mb-1 font-size-24">{report.total}</h2>
                  <h6
                    style={{
                      color: "#6B6B6B",
                    }}
                    className="mb-1 font-size-12 "
                  >
                    {report.title}
                  </h6>
                  {/* <span className={"badge bg-" + report.badgecolor}> {report.average} </span> <span className="ms-2">From previous period</span> */}
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </React.Fragment>
  );
};

export default Miniwidget;
