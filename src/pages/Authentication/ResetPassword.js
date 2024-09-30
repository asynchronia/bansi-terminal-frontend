import withRouter from '../../components/Common/withRouter';
import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, Card, CardBody, Form, FormFeedback, Input, Label, Row } from 'reactstrap';
import { default as logoDark, default as logoLight } from "../../assets/images/logo-dark.png";
import StyledButton from '../../components/Common/StyledButton';
import { useFormik } from "formik";
import * as Yup from "yup";

const ResetPassword = (props) => {
    document.title = "Reset Password | WILLSMEET";

    const [error, setError] = React.useState(null);

    const validation = useFormik({
        // enableReinitialize : use this  flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            password: Yup.string().required("Please Enter Your Password"),
            /* The oneOf method uses ref to reference the 'password' field value,
               checking if confirmPassword is the same as password. If password 
               value is not yet defined, the null part allows confirmPassword to be empty. */
            confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required("Please Confirm Your Password"),
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
                <h4 className="text-muted font-size-18 mb-1 text-center">Reset Password</h4>
                <Form
                  className="form-horizontal mt-4"
                >
                  {error ? <Alert color="danger">{error}</Alert> : null}
                    <div className="mb-3">
                        <Label htmlFor="password">Password</Label>
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
                    <div className="mb-3">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                        name="confirmPassword"
                        value={validation.values.confirmPassword || ""}
                        type="password"
                        placeholder="Confirm Password"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        invalid={
                            validation.touched.confirmPassword && validation.errors.confirmPassword ? true : false
                        }
                        />
                        {validation.touched.confirmPassword && validation.errors.confirmPassword ? (
                        <FormFeedback type="invalid">{validation.errors.confirmPassword}</FormFeedback>
                        ) : null}
                    </div>
                    <Row className="mb-3 mt-4">
                        <div className="text-end">
                        <StyledButton
                            color={"primary"}
                            style={{width: '100%'}}
                            onClick={onSubmitClick}
                        >
                            Reset Password
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

export default withRouter(ResetPassword);