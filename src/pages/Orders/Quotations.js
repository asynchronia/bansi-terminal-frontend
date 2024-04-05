import React,{useEffect} from "react";

import { connect } from "react-redux";



//Import Action to copy breadcrumb items from local state to redux state
import { setBreadcrumbItems } from "../../store/Breadcrumb/actions";


const Quotations = (props) => {
  document.title = "Quotations";

  const breadcrumbItems = [
    
    { title: "Dashboard", link: "/dashboard" },
    { title: "Sales Order", link: "/orders" },
    { title: "Quotations", link: "#" },
    
  ];

  useEffect(() => {
    props.setBreadcrumbItems('Quotations', breadcrumbItems);
  },[]);

  return (
    <>
       
    </>
  )
}

export default connect(null, { setBreadcrumbItems })(Quotations);