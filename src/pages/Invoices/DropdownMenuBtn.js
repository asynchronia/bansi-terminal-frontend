import React,{useState} from "react";
import CustomDropdown from "../../components/CustomComponents/CustomDropdown"; 
import "./styles/DropdownMenuBtn.scss";

const DropdownMenuBtn = (props) =>{
    const {data, handleViewClick} = props;
    const [menu, setMenu] = useState(false);

    const onViewClick = () =>{
      handleViewClick(data);
    }
    return (
      <CustomDropdown 
          isOpen={menu}
          direction={'bottom'}
          toggle={() => setMenu(!menu)}
          items={[
            { label: 'View Item', onClick: onViewClick }
          ]}
      />
      );
}
export default DropdownMenuBtn;