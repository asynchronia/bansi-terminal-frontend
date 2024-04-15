import React from 'react'
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, Label, Form, Alert, Input, FormFeedback, Button } from 'reactstrap';
import logoDark from "../../assets/images/logo-dark.png";
import logoLight from "../../assets/images/logo-dark.png";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";
import withRouter from '../../components/Common/withRouter';

// actions
import { loginUser, socialLogin } from "../../store/actions";
import { loginReq } from '../../service/authService';
import StyledButton from '../../components/Common/StyledButton';
import useAuth from '../../hooks/useAuth';

const Login = props => {
  document.title = "Login | WILLSMEET";

  const { setAuth } = useAuth();
  const dispatch = useDispatch();
  const [error, setError] = React.useState(null);
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);

  const validation = useFormik({
    // enableReinitialize : use this  flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: async (values) => {
      // dispatch(loginUser(values, props.router.navigate));
      setIsButtonLoading(true);
      const response = await loginReq(values);
      try {
        if (response.success) {
          localStorage.setItem("accessToken", response.payload.accessToken);
          localStorage.setItem("user", JSON.stringify(response.payload.user));
          setAuth(response.payload.user);
          props.router.navigate("/dashboard");
        } else {
          setError(response.message);
        }
      } catch (error) {
        setError(error.message);
      }
      setIsButtonLoading(false);
    }
  });

  const onloginClick = (e) => {
    e.preventDefault();
    validation.handleSubmit();
    return false;
  }


  /* const selectLoginState = (state) => state.Login;
  const LoginProperties = createSelector(
    selectLoginState,
    (login) => ({
      error: login.error
    })
  );

  const {
    error
  } = useSelector(LoginProperties); */



  return (
    <React.Fragment>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <CardBody className="pt-0">

                  <h3 className="text-center mt-5 mb-4">
                    <Link to="/" className="d-block auth-logo">
                      <img src={logoDark} alt="" height="30" className="auth-logo-dark" />
                      <img src={logoLight} alt="" height="30" className="auth-logo-light" />
                    </Link>
                  </h3>

                  <div className="p-3">
                    <h4 className="text-muted font-size-18 mb-1 text-center">Welcome Back !</h4>
                    <p className="text-muted text-center">Login to continue to WILLSMEET</p>
                    <Form
                      className="form-horizontal mt-4"
                      // onSubmit={(e) => {
                      //   e.preventDefault();
                      //   validation.handleSubmit();
                      //   return false;
                      // }}
                    >
                      {error ? <Alert color="danger">{error}</Alert> : null}
                      <div className="mb-3">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          name="email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                          invalid={
                            validation.touched.email && validation.errors.email ? true : false
                          }
                        />
                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                        ) : null}
                      </div>
                      <div className="mb-3">
                        <Label htmlFor="userpassword">Password</Label>
                        <Input
                          name="password"
                          value={validation.values.password || ""}
                          type="password"
                          placeholder="Enter Password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            validation.touched.password && validation.errors.password ? true : false
                          }
                        />
                        {validation.touched.password && validation.errors.password ? (
                          <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                        ) : null}
                      </div>
                      <Row className="mb-3 mt-4">
                        <div className="col-6">
                          <div className="form-check">
                            <input type="checkbox" className="form-check-input" id="customControlInline" />
                            <label className="form-check-label" htmlFor="customControlInline">Remember me
                            </label>
                          </div>
                        </div>
                        <div className="col-6 text-end">
                          <StyledButton
                            color={"primary"}
                            className={"w-md"}
                            onClick={onloginClick}
                            isLoading={isButtonLoading}
                          >
                            Login
                          </StyledButton>
                          {/* <button className="btn btn-primary w-md waves-effect waves-light" type="submit">Log In</button> */}
                        </div>
                      </Row>
                      <Row className="form-group mb-0">
                        <div className="col-12 mt-4">
                          <Link to="/forgot-password" className="text-muted"><i className="mdi mdi-lock"></i> Forgot your password?</Link>
                        </div>
                      </Row>
                    </Form>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

    </React.Fragment>
  )
}

export default withRouter(Login);
