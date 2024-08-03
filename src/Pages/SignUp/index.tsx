import { Box } from "@mui/material";
import { FastField, Form, Formik } from "formik";
import * as yup from "yup";
import { useAuth } from "../../Providers/AuthenticationProvider";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import CommonStyles from "../../Components/CommonStyles";
import CommonField from "../../Components/CommonFields";

const SignUp = () => {
  //! State
  const { userId, signUp } = useAuth();
  const navigate = useNavigate();
  const initialValues = {
    user_name: "",
    password: "",
    email: "",
    address: "",
    phone_num: "",
  };

  const validationSchema = yup.object().shape({
    user_name: yup.string().required("Email or username is required"),
    password: yup.string().required("Password is required"),
  });

  //! Function

  //! Effect
  useEffect(() => {
    if (userId) {
      navigate("/");
    }
  }, [userId]);

  //! Render
  return (
    <Box
      sx={{
        background: "linear-gradient(173deg,#ecf4ff -.79%,#d3e1ff 94.5%)",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={signUp}
      >
        {() => {
          return (
            <Form
              style={{
                background: " #fff",
                border: "1px solid rgba(28, 31, 35, .08)",
                borderRadius: "12px",
                boxShadow:
                  "0 4px 14px 0 rgba(0, 0, 0, .1), 0 0 1px 0 rgba(0, 0, 0, .3)",
                padding: "40px 64px",
                width: "50vw",
                maxWidth: "600px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
              }}
            >
              <CommonStyles.Typography type="bold32">
                Welcome to Alphii
              </CommonStyles.Typography>
              <CommonStyles.Typography type="normal16" textAlign={"center"}>
                Sign in to access your dashboard, chatbots, and more...
              </CommonStyles.Typography>

              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  marginTop: "20px",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "20px",
                  }}
                >
                  <FastField
                    name="user_name"
                    component={CommonField.InputField}
                    fullWidth
                    label="Username"
                    required
                    placeholder="Enter your Username"
                  />

                  <FastField
                    name="password"
                    component={CommonField.InputField}
                    fullWidth
                    label="Password"
                    required
                    placeholder="Enter your password"
                    type="password"
                  />
                </Box>

                <FastField
                  name="email"
                  component={CommonField.InputField}
                  fullWidth
                  label="Email"
                  placeholder="Enter your Email"
                />

                <FastField
                  name="address"
                  component={CommonField.InputField}
                  fullWidth
                  label="Address"
                  placeholder="Enter your Address"
                />

                <FastField
                  name="phone_num"
                  component={CommonField.InputField}
                  fullWidth
                  label="Phone Number"
                  placeholder="Enter your Phone Number"
                  type="number"
                />

                <CommonStyles.Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: "20px",
                    padding: "12px 0",
                    fontWeight: "550",
                    height: "40px",
                  }}
                >
                  Sign up
                </CommonStyles.Button>
                <CommonStyles.Typography
                  type="normal14"
                  mt={"16px"}
                  textAlign={"center"}
                >
                  Already have an account? <Link to="/login">Sign in</Link>
                </CommonStyles.Typography>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default SignUp;
