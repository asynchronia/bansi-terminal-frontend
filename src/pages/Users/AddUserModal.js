import React, { useState } from "react";
import { Col, Form, Modal, ModalBody, Row } from "reactstrap";
import { FormControl, Select, Chip, MenuItem } from "@mui/material";
import StyledButton from "../../components/Common/StyledButton";
import { updateUserReq } from "../../service/usersService";
import { useFormik } from "formik";
import * as Yup from 'yup'

const AddUserModal = (props) => {
  const {selectedItems, setSelectedItems, selectedRole, warehouseList, editUserData, getUsersData, notify, openModal, setOpenModal } = props
  const [isButtonLoading, setIsButtonLoading] = useState(false)

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
        firstName: editUserData?.firstName,
        lastName: editUserData?.lastName,
        email: editUserData?.email,
        password: editUserData?.password,
        contact: editUserData?.contact?.toString(),
        gender: editUserData?.gender,
        role: editUserData?.role,
        associatedWarehouses: selectedItems
    },
    validationSchema: Yup.object({
        firstName: Yup.string().required("Please Enter First Name"),
        lastName: Yup.string().required("Please Enter Last Name"),
        email: Yup.string().required("Please Enter Email Id"),
        password: Yup.string().required("Please Enter Password"),
        contact: Yup.string().required("Please Enter Valid Contact Number"),
        gender: Yup.string().required("Please Enter Gender"),
        role: Yup.string().required("Please select user role")
    }),
    onSubmit: (values) => {
      const warehouseArray = selectedItems.map((e) => {
        return e._id;
      });

      const updatedUser = {
        ...values,
        id: editUserData?._id,
        associatedWarehouses: warehouseArray
      };
      
      handleEditUser(updatedUser);
    },
  });

  const handleWarehouseChange = (event) => {
    const selectedIDs = event.target.value.map(item => item._id);
    
    const uniqueSelectedItems = selectedIDs.reduce((acc, id) => {
        const exists = acc.find(item => item._id === id);
        if (exists) {
            return acc.filter(item => item._id !== id);
        } else {
            const itemToAdd = event.target.value.find(item => item._id === id);
            return [...acc, itemToAdd];
        }
    }, []);

    setSelectedItems(uniqueSelectedItems);
};



  const handleEditUser = async (data) => {
    try {
        setIsButtonLoading(true)

        const response = await updateUserReq(data);
        
        if (response.success) {
            setOpenModal(!openModal)
            notify("Success", response.message)
            setSelectedItems([])
            getUsersData()
        }
        setIsButtonLoading(false)
    } catch (error) {
        notify("Error", error.message)
        setOpenModal(!openModal)
        setSelectedItems([])
        setIsButtonLoading(false)
    }
  };

  return (
    <Modal 
        size="lg"
        centered
        isOpen={openModal}
        toggle={() => {
            setOpenModal(!openModal)
            validation.resetForm()
            setSelectedItems([])
        }}>
        <Form
            className="form-horizontal"
            onSubmit={(e) => {
                e.preventDefault();
                validation.handleSubmit();
                return false;
            }}
            >
            <div className="modal-header">
                <div className="d-flex justify-content-between align-items-center w-100">
                <h4 className="card-title">Edit User</h4>
                <hr />
                <div className="d-flex gap-1">
                    <StyledButton
                    type="button"
                    outline
                    color="danger"
                    className="waves-effect waves-light"
                    onClick={() => {
                        validation.resetForm();
                        setOpenModal(!openModal);
                        setSelectedItems([]);
                    }}
                    >
                    Close
                    </StyledButton>
                    <StyledButton
                        type="submit"
                        className="btn btn-primary waves-effect waves-light "
                        isLoading={isButtonLoading}
                    >
                    Save
                    </StyledButton>
                </div>
                </div>
            </div>
            <ModalBody>
                <Row>
                    <Col className="mt-2">
                        <label className="item-name">First Name</label>
                        <input
                            name="firstName" // Update the name attribute
                            id="firstName"
                            className="form-control"
                            type="text"
                            placeholder="Enter First Name"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.firstName || ""}
                            invalid={
                            validation.touched &&
                            validation.touched.firstName &&
                            validation.errors &&
                            validation.errors.firstName
                            }
                        />
                        {validation.touched &&
                        validation.touched.firstName &&
                        validation.errors &&
                        validation.errors.firstName ? (
                            <p style={{ color: "red" }}>
                            {validation.errors.firstName}
                            </p>
                        ) : null}
                    </Col>
                    <Col className="mt-2">
                        <label className="item-name">Last Name</label>
                        <input
                            name="lastName" // Update the name attribute
                            id="LastName"
                            className="form-control"
                            type="text"
                            placeholder="Enter Last Name"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.lastName || ""}
                            invalid={
                            validation.touched &&
                            validation.touched.lastName &&
                            validation.errors &&
                            validation.errors.lastName
                            }
                        />
                        {validation.touched &&
                        validation.touched.lastName &&
                        validation.errors &&
                        validation.errors.lastName ? (
                            <p style={{ color: "red" }}>
                            {validation.errors.lastName}
                            </p>
                        ) : null}
                    </Col>
                </Row>
                <Row>
                    <Col className="mt-3">
                        <label className="item-name">Email</label>
                        <input
                            name="email" // Update the name attribute
                            id="email"
                            className="form-control"
                            type="email"
                            placeholder="Enter Email"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email || ""}
                            invalid={
                            validation.touched &&
                            validation.touched.email &&
                            validation.errors &&
                            validation.errors.email
                            }
                        />
                        {validation.touched &&
                        validation.touched.email &&
                        validation.errors &&
                        validation.errors.email ? (
                            <p style={{ color: "red" }}>
                            {validation.errors.email}
                            </p>
                        ) : null}
                    </Col>
                    <Col className="mt-3">
                        <label className="item-name">User Contact</label>
                        <input
                            name="contact" // Update the name attribute
                            id="contact"
                            className="form-control"
                            type="text"
                            placeholder="Enter User Contact Number"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.contact || ""}
                            invalid={
                            validation.touched &&
                            validation.touched.contact &&
                            validation.errors &&
                            validation.errors.contact
                            }
                        />
                        {validation.touched &&
                        validation.touched.contact &&
                        validation.errors &&
                        validation.errors.contact ? (
                            <p style={{ color: "red" }}>
                            {validation.errors.contact}
                            </p>
                        ) : null}
                    </Col>
                </Row>
                <Row>
                    <Col className="mt-3">
                        <label className="item-name">Gender</label>
                        <select
                            className="form-select focus-width"
                            name="gender"
                            id="gender"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.gender || ""}
                            invalid={
                            validation.touched &&
                            validation.touched.gender &&
                            validation.errors &&
                            validation.errors.gender
                            }
                        >
                            <option>Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="others">Others</option>
                        </select>
                        {validation.touched &&
                        validation.touched.gender &&
                        validation.errors &&
                        validation.errors.gender ? (
                            <p style={{ color: "red" }}>
                            {validation.errors.gender}
                            </p>
                        ) : null}
                    </Col>
                    <Col className="mt-3">
                        <label className="item-name">Set Password</label>
                        <input
                            name="password" // Update the name attribute
                            id="password"
                            className="form-control"
                            type="text"
                            placeholder="Xyz#123"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.password || ""}
                            invalid={
                            validation.touched &&
                            validation.touched.password &&
                            validation.errors &&
                            validation.errors.password
                            }
                        />
                        {validation.touched &&
                        validation.touched.password &&
                        validation.errors &&
                        validation.errors.password ? (
                            <p style={{ color: "red" }}>
                            {validation.errors.password}
                            </p>
                        ) : null}
                    </Col>
                </Row>
                <Row>
                    <Col className="mt-3">
                        <FormControl 
                            style={{
                                width: '100%',
                            }}
                        >
                        <label className="item-name">Associated Warehouses</label>
                        <Select
                            name="associatedWarehouses"
                            size="small"
                            labelId="multiple-select-label"
                            id="multiple-select"
                            multiple
                            value={selectedItems}
                            onChange={handleWarehouseChange}
                            renderValue={(selected) => (
                            <div>
                                {selected.map((value) => (
                                <Chip className="mx-2" size="small" key={value._id} label={value.code ? value.code : value.name} />
                                ))}
                            </div>
                            )}
                        >
                            {warehouseList.length > 0? warehouseList.map((option) => (
                            <MenuItem key={option._id} value={option} >
                                {option.code ? option.code : option.name}
                            </MenuItem>
                            )):null}
                        </Select>
                        </FormControl>
                    </Col>
                    <Col className="mt-3">
                        <label className="form-label">User Role</label>
                        <select
                        className="form-select focus-width"
                        name="role" // Update the name attribute
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.role || ""}
                        invalid={
                            validation.touched &&
                            validation.touched.role &&
                            validation.errors &&
                            validation.errors.role
                        }
                        >
                        <option>Select User Role</option>
                        {selectedRole.map((e) => (
                            <option key={e._id} value={e._id}>{e.title}</option>
                        ))}
                        </select>
                        {validation.touched &&
                        validation.touched.role &&
                        validation.errors &&
                        validation.errors.role ? (
                        <p style={{ color: "red" }}>
                            {validation.errors.role}
                        </p>
                        ) : null}
                    </Col>
                </Row>
            </ModalBody>
        </Form>
    </Modal>
  );
};

export default AddUserModal;
