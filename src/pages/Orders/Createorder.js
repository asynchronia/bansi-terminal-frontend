import React,{useEffect} from "react";

import { connect } from "react-redux";


//Import Action to copy breadcrumb items from local state to redux state
import { setBreadcrumbItems } from "../../store/Breadcrumb/actions";


const CreateOrder = (props) => {
  document.title = "Create Order";

  const breadcrumbItems = [
    
    { title: "Dashboard", link: "#" },
    { title: "Sales-Order", link: "#" },
    { title: "Create Order", link: "#" },
    
  ];

  useEffect(() => {
    props.setBreadcrumbItems('Create Order', breadcrumbItems);
  },[]);

  return (
    <>
       
    </>
  )
}

export default connect(null, { setBreadcrumbItems })(CreateOrder);