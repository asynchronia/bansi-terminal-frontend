import React, { useEffect, useState } from "react";
import { setBreadcrumbItems } from "../../store/actions";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
const ViewClient = (props) => {
    const [clientData, setClientData]= useState({});
   const {id}= useParams();
   const breadcrumbItems = [
    { title: "Lexa", link: "#" },
    { title: "Client", link: "/client" },
    { title: "View", link: "/client/:id" },
  ];

   useEffect(()=>{
    searchClient(id);
   }, [])

   
   const searchClient = async (id) => {
    const url = `http://localhost:3000/api/clients/get`;
    const data = { _id: id };
    try {
      const res = await axios.post(url, data);
      setClientData(res?.data?.payload?.client);
    } catch (error) {
      console.log(error);
    }
  };

 

  useEffect(() => {
    props.setBreadcrumbItems("EditClient", breadcrumbItems);
  });
  return <div>Edit Client</div>;
};

export default connect(null, { setBreadcrumbItems })(ViewClient);
