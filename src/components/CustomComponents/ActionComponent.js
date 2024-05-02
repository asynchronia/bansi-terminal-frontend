import React, { useState } from "react";
import CustomDropdown from "./CustomDropdown";

import "./styles/ActionComponent.scss";
import { getBranchByIdReq } from "../../service/branchService";
import { getUserByIdReq } from "../../service/usersService";
const ActionComponent = (props) => {
  const { setEdit, type, data, clientId, validation, openModal, setOpenModal } =
    props;
  const [menu, setMenu] = useState(false);

  const getBranchData = async () => {
    try {
      const response = await getBranchByIdReq({
        clientId: clientId,
        branchId: data._id,
      });
      const branchValues = response?.payload?.branch;

      // Update the state immutably
      validation.setValues((prevValues) => ({
        ...prevValues,
        primaryBranch: {
          ...prevValues.primaryBranch,
          name: branchValues.name,
          address: branchValues.address,
          associatedWarehouse: branchValues.associatedWarehouse._id,
          contact: branchValues.contact,
        },
      }));

      setOpenModal({ ...openModal, branch: true });
    } catch (error) {
      console.log(error);
    }
  };

  const getUserData = async () => {
    try {
      const response = await getUserByIdReq({
        id: data._id,
      });
      const userValues = response?.payload?.user;

      const associatedBranchIds = userValues.associatedBranches.map(
        (branch) => ({ _id: branch._id, address: branch.address })
      );

      validation.setValues((prevValues) => ({
        ...prevValues,
        primaryUser: {
          firstName: userValues.firstName,
          lastName: userValues.lastName,
          email: userValues.email,
          password: userValues.password,
          contact: userValues.contact.toString(),
          gender: userValues.gender,
          role: userValues.role._id,
          clientId: clientId,
          associatedBranches: [...associatedBranchIds],
        },
      }));

      setOpenModal({ ...openModal, user: true });
    } catch (error) {
      console.log(error);
    }
  };

  const onEditClick = () => {
    setEdit(data._id);
    if (type === "branch") {
      getBranchData();
    } else if (type === "user") {
      getUserData();
    }
  };

  const onDeleteClick = () => {};

  //onclicking on edit when type is branch, editBranch popup will show up that needs, clientId and branchId to get the data.
  //Branch id is available in data need client Id from props.

  return (
    <CustomDropdown
      isOpen={menu}
      direction={"bottom"}
      toggle={() => setMenu(!menu)}
      items={[
        { label: "Edit", onClick: onEditClick },
        { label: "Delete", onClick: onDeleteClick },
      ]}
    />
  );
};
export default ActionComponent;
