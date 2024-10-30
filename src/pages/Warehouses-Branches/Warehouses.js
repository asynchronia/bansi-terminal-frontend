import { useCallback, useEffect, useState } from "react";
import { setBreadcrumbItems } from "../../store/actions";
import { connect } from "react-redux";
import { Card, CardBody, Row, Col } from "reactstrap";
import { Chip } from "@mui/material";
import { getWarehouseListReq } from "../../service/branchService";

const Warehouses = (props) => {
    const breadcrumbItems = [
        { title: "Dashboard", link: "/dashboard" },
        { title: "Warehouses", link: "#" },
    ];

    const [warehouseList, setWarehouseList] = useState([]);

    const getWarehousesData = useCallback(async () => {
        const response = await getWarehouseListReq();
        if (response) {
          setWarehouseList(response?.payload?.warehouses);
        }
    }, []);
    
    useEffect(() => {
        props.setBreadcrumbItems("Warehouses", breadcrumbItems);
        getWarehousesData()
    }, []);


    return (
        <Row className="equal-height-cards">
        {warehouseList.map((warehouse, index) => {
            return (
                <Col key={`${warehouse.name}-${index}`} xl="6" className="mt-4">
                <Card>
                    <CardBody style={{paddingBottom: '0px'}}>
                        <Row className="align-items-center">
                            <Col>
                                <h3 className="card-title capitalize">
                                {warehouse?.name}
                                <span>
                                {" "}
                                {warehouse.isPrimary ? (
                                    <Chip className="mx-2" size="sm" label="Primary" />
                                ) : null}
                                </span>
                                </h3>
                            </Col>
                        </Row>
                        <Row className="mt-1">
                            <Col xs="6">
                                <p>Code:</p>
                            </Col>
                            <Col xs="6">
                                {warehouse.code}
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="6">
                                <p>Address:</p>
                            </Col>
                            <Col xs="6">
                            <p>
                                {warehouse.addressLine1},&nbsp;
                                {warehouse.addressLine2},&nbsp;
                                {warehouse.city}&nbsp;-&nbsp;{warehouse.pincode},&nbsp;
                                {warehouse.state}
                            </p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="6">
                                <p>Contact:</p>
                            </Col>
                            <Col xs="6">
                                <p>{warehouse?.contact}</p>
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

export default connect(null, { setBreadcrumbItems })(Warehouses);
