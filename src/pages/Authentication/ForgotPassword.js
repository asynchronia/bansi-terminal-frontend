import withRouter from '../../components/Common/withRouter';
import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, Card, CardBody, Form, FormFeedback, Input, Label, Row } from 'reactstrap';
import { default as logoDark, default as logoLight } from "../../assets/images/logo-dark.png";
import StyledButton from '../../components/Common/StyledButton';
import { useFormik } from "formik";
import * as Yup from "yup";

const ForgotPassword = (props) => {
    document.title = "Forgot Password | WILLSMEET";

    const [error, setError] = React.useState(null);

    const validation = useFormik({
        // enableReinitialize : use this  flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
        email: '',
        },
        validationSchema: Yup.object({
        email: Yup.string().required("Please Enter Your Email"),
        }),
        onSubmit: async (values) => {
            console("Reset Password Email sent to your email")
        }
    });

  const onSubmitClick = (e) => {
    e.preventDefault();
    validation.handleSubmit();
    return false;
  }


    return (
        <div className='d-flex justify-content-center align-items-center vh-100'>
          <Card className='m-0' style={{ width: 450 }}>
            <CardBody>
              <h3 className="text-center my-3">
                <Link to="/" className="d-block auth-logo">
                  <img src={logoDark} alt="" height="30" className="auth-logo-dark" />
                  <img src={logoLight} alt="" height="30" className="auth-logo-light" />
                </Link>
              </h3>
    
              <div className="p-3">
                <h4 className="text-muted font-size-18 mb-1 text-center">Forgot Password</h4>
                <Form
                  className="form-horizontal mt-4"
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
                  <Row className="mb-3 mt-4">
                    <div className="text-end">
                      <StyledButton
                        color={"primary"}
                        style={{width: '100%'}}
                        onClick={onSubmitClick}
                      >
                        Forgot Password
                      </StyledButton>
                    </div>
                  </Row>
                </Form>
              </div>
            </CardBody>
          </Card>
        </div>
      )

}

export default withRouter(ForgotPassword);