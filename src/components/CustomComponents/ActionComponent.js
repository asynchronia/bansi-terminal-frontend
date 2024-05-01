import React,{useState} from "react";
import CustomDropdown from "./CustomDropdown";
 
import "./styles/ActionComponent.scss";
const ActionComponent = (props) =>{

    const {data,openModal, setOpenModal} = props;
   
   const [menu, setMenu] = useState(false);
    const onViewClick=()=>{
        // setOpenModal({ ...openModal, branch: true });   
    }

    const deleteBranch =()=>{

    }
   
    return (
      <CustomDropdown 
          isOpen={menu}
          direction={'bottom'}
          toggle={() => setMenu(!menu)}
          items={[
            { label: 'Edit',  onClick: onViewClick },
            { label: 'Delete', onClick:deleteBranch },
          ]}
      />
      );
}
export default ActionComponent;
