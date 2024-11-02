import { useCallback, useEffect, useState } from "react";
import { setBreadcrumbItems } from "../../store/actions";
import { connect } from "react-redux";
import { getClientBranchListReq } from "../../service/branchService";
import { Card, CardBody, Row, Col } from "reactstrap";
import { Chip } from "@mui/material";

const Branches = (props) => {
    const breadcrumbItems = [
        { title: "Dashboard", link: "/dashboard" },
        { title: "Branches", link: "#" },
    ];
    const [branchList, setBranchList] = useState([]);

    const getBranchData = useCallback(async () => {
        const response = await getClientBranchListReq();
        if (response) {
          setBranchList(response?.payload?.branches);
        }
    }, []);
    
    useEffect(() => {
        props.setBreadcrumbItems("Branches", breadcrumbItems);
        getBranchData()
    }, []);

    return (
        <Row className="equal-height-cards">
            {branchList.map((branch, index) => {
                return (
                    <Col key={`${branch.name}-${index}`} xl="6" className="mt-4">
                    <Card>
                        <CardBody style={{paddingBottom: '0px'}}>
                            <Row className="align-items-center">
                                <Col>
                                    <h3 className="card-title capitalize">
                                    {branch?.name}
                                    <span>
                                    {" "}
                                    {branch.isPrimary ? (
                                        <Chip className="mx-2" size="sm" label="Primary" />
                                    ) : null}
                                    </span>
                                    </h3>
                                </Col>
                            </Row>
                            <Row className="mt-1">
                                <Col xs="6">
                                    <p>Associated Warehouse:</p>
                                </Col>
                                <Col xs="6">
                                    <div className="d-flex flex-wrap">
                                        <Chip label={branch?.associatedWarehouse.code} className="mr-2" />
                                    </div>
                                </Col>
                            </Row>
                            <Row className="mt-1">
                                <Col xs="6">
                                    <p>Address:</p>
                                </Col>
                                <Col xs="6">
                                    {branch.address}
                                </Col>
                            </Row>
                            <Row className="mt-1">
                                <Col xs="6">
                                    <p>Code:</p>
                                </Col>
                                <Col xs="6">
                                    {branch.code}
                                </Col>
                            </Row>
                            <Row className="mt-1">
                                <Col xs="6">
                                    <p>Contact:</p>
                                </Col>
                                <Col xs="6">
                                    <p>{branch?.contact}</p>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    </Col>
                )
            })}
        </Row>
    )
}

export default connect(null, { setBreadcrumbItems })(Branches);
