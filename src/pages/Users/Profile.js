import * as Yup from "yup";
import { useFormik } from "formik";
import { Card, CardBody, CardHeader, Col, Input, Label, Row } from "reactstrap";
import { setBreadcrumbItems } from "../../store/Breadcrumb/actions";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import StyledButton from "../../components/Common/StyledButton";
import { USER_GENDER_ENUM } from "../../utility/constants";
import { getUserProfileReq } from "../../service/usersService";
import './styles/Profile.scss'

const UserProfile = (props) => {
  document.title = "Users";

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      emailID: "",
      gender: USER_GENDER_ENUM.MALE,
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Please Enter First name"),
      lastName: Yup.string().required("Please Enter Last name"),
      emailID: Yup.string().required("Please Enter Email ID"),
      gender: Yup.string().required("Please select gender"),
    }),
    onSubmit: (values) => {},
  });

  const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Profile", link: "#" },
  ];

  // const [gender, setGender] = useState(USER_GENDER_ENUM.MALE);
  const [userRole, setUserRole] = useState();

  // const handleGenderChange = (event) => {
  //   setGender(event.target.value);
  // };

  useEffect(() => {
    props.setBreadcrumbItems("Profile", breadcrumbItems);
  }, [props, breadcrumbItems]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await getUserProfileReq();
      const getUserData = res.payload.user;

      setUserRole(getUserData.role.title);

      formik.setValues({
        firstName: getUserData.firstName,
        lastName: getUserData.lastName,
        emailID: getUserData.email,
        gender: getUserData.gender,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <form onSubmit={formik.handleSubmit} autoComplete="off">
      <Row className="mb-3">
        <div>
          <Row>
            <Col xl="7">
              <Card>
                <CardHeader
                  className="card-header"
                >
                  User Profile
                </CardHeader>
                <CardBody className="gray-text">
                  <div className="d-flex mb-1">
                    <div className="p-2 width-49">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={formik.values.firstName}
                        placeholder="Enter First Name"
                        onBlur={formik.handleBlur}
                        readOnly
                      />
                      {formik.touched.firstName && formik.errors.firstName ? (
                        <div className="text-danger">
                          {formik.errors.firstName}
                        </div>
                      ) : null}
                    </div>
                    <div className="p-2 width-49">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={formik.values.lastName}
                        placeholder="Enter Last Name"
                        onBlur={formik.handleBlur}
                        readOnly
                      />
                      {formik.touched.lastName && formik.errors.lastName ? (
                        <div className="text-danger">
                          {formik.errors.lastName}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div className="p-2 width-49">
                      <Label htmlFor="emailID">Email ID</Label>
                      <Input
                        type="text"
                        name="emailID"
                        id="emailID"
                        value={formik.values.emailID}
                        placeholder="Enter Email ID"
                        onBlur={formik.handleBlur}
                        readOnly
                      />
                      {formik.touched.emailID && formik.errors.emailID ? (
                        <div className="text-danger">
                          {formik.errors.emailID}
                        </div>
                      ) : null}
                    </div>
                    <div className="p-2 width-49">
                      <Label htmlFor="gender">Gender</Label>
                      <select
                        className="form-select focus-width capitalize"
                        name="gender"
                        value={formik.values.gender}
                        // onChange={handleGenderChange}
                        disabled
                      >
                        <option value={USER_GENDER_ENUM.MALE}>
                          {USER_GENDER_ENUM.MALE}
                        </option>
                        <option value={USER_GENDER_ENUM.FEMALE}>
                          {USER_GENDER_ENUM.FEMALE}
                        </option>
                        <option value={USER_GENDER_ENUM.OTHERS}>
                          {USER_GENDER_ENUM.OTHERS}
                        </option>
                      </select>
                      {formik.touched.gender && formik.errors.gender ? (
                        <div className="text-danger">
                          {formik.errors.gender}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  {/* <StyledButton
                    color={"primary"}
                    type="submit"
                    className={"w-md mx-2"}
                  >
                    Update Profile
                  </StyledButton> */}
                </CardBody>
              </Card>
            </Col>
            <Col xl="5">
              <Card>
                <CardHeader
                  className="card-header"
                >
                  Roles & Permissions
                </CardHeader>
                <CardBody
                className="gray-text"
                >
                  <Label className="pt-2">Branch / Warehouse Access</Label>
                  <div className="d-flex gap-2 flex-wrap pb-2">
                    <p className="px-2 py-1 rounded border text-sm text-nowrap m-0">
                      Pune Branch
                    </p>
                    <p className="px-2 py-1 rounded border text-sm text-nowrap m-0">
                      Nagpur Branch
                    </p>
                    <p className="px-2 py-1 rounded border text-sm text-nowrap m-0">
                      Hyderabad Branch
                    </p>
                  </div>
                  <Label className="pt-2">User Role</Label>
                  <p>{userRole}</p>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </Row>
    </form>
  );
};

export default connect(null, { setBreadcrumbItems })(UserProfile);
