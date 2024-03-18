import React,{useEffect} from "react";

import { connect } from "react-redux";



//Import Action to copy breadcrumb items from local state to redux state
import { setBreadcrumbItems } from "../../store/Breadcrumb/actions";


const AllOrders = (props) => {
  document.title = "All Orders";

  const breadcrumbItems = [
    
    { title: "Dashboard", link: "#" },
    { title: "Sales-Order", link: "#" },
    { title: "All Orders", link: "#" },
    
  ];

  useEffect(() => {
    props.setBreadcrumbItems('All Orders', breadcrumbItems);
  },[]);

  return (
    <>
       
    </>
  )
}

export default connect(null, { setBreadcrumbItems })(AllOrders);