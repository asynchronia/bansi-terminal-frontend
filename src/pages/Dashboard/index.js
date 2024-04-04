import React , {useEffect} from "react"

import { connect } from "react-redux";
import {
  Row,
  Col,
} from "reactstrap"

// Pages Components
import Miniwidget from "./Miniwidget"
//import MonthlyEarnings from "./montly-earnings";
import EmailSent from "./email-sent";
import MonthlyEarnings2 from "./montly-earnings2";

//Import Action to copy breadcrumb items from local state to redux state
import { setBreadcrumbItems } from "../../store/actions";

const Dashboard = (props) => {

  document.title = "Dashboard | Lexa - Responsive Bootstrap 5 Admin Dashboard";


  const breadcrumbItems = [
    { title: "Dashboard", link: "#" }
  ]

  useEffect(() => {
    props.setBreadcrumbItems('Dashboard' , breadcrumbItems)
  },)

  const reports = [
    { title: "Ongoing Orders", iconClass: "cube-outline", total: "1,587", average: "+11%", badgecolor: "info" },
    { title: "Delivered Orders", iconClass: "buffer", total: "1000", average: "-29%", badgecolor: "danger" },
    { title: "Total Sales", iconClass: "tag-text-outline", total: "₹55,00,000", average: "0%", badgecolor: "warning" },
    { title: "Pending Amount", iconClass: "briefcase-check", total: "₹5,00,000", average: "+89%", badgecolor: "info" },
  ]

  return (
    <React.Fragment>

      {/*mimi widgets */}
      <Miniwidget reports={reports} />

      <Row>
        {/* <Col xl="3">
          <MonthlyEarnings />
        </Col> */}

        <Col xl="6">
          {/* Email sent */}
          <EmailSent />
        </Col>

        <Col xl="6">
          <MonthlyEarnings2 />
        </Col>

      </Row>
      {/* <Row>

        <Col xl="4" lg="6">
          <Inbox />
        </Col>
        <Col xl="4" lg="6">
          <RecentActivity />

        </Col>
        <Col xl="4">
          <WidgetUser />

          <YearlySales />
        </Col>
      </Row>

      <Row>
        <Col xl="6">
          <LatestTransactions />
        </Col>

        <Col xl="6">
          <LatestOrders />
        </Col>
      </Row> */}

    </React.Fragment>
  )
}

export default connect(null, { setBreadcrumbItems })(Dashboard);