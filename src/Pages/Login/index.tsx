import { Box, useTheme } from "@mui/material";
import { FastField, Form, Formik } from "formik";
import * as yup from "yup";
import { useAuth } from "../../Providers/AuthenticationProvider";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import CommonStyles from "../../Components/CommonStyles";
import CommonField from "../../Components/CommonFields";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const Login = () => {
  //! State
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const { userId, signIn } = useAuth();
  const navigate = useNavigate();
  const initialValues = {
    email_or_username: "",
    password: "",
  };

  const validationSchema = yup.object().shape({
    email_or_username: yup.string().required("Email or username is required"),
    password: yup.string().required("Password is required"),
  });

  const theme = useTheme()

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
      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
              <div
                style={{
                  height: "750px",
                  maxWidth: "900px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <Viewer
                  fileUrl={'https://alphii-test-s3.s3.amazonaws.com/85a557f6-affc-44f9-9672-30a66d55fab4/e3890bad-4db4-4734-aacc-9ec52e8837f6/luat252018QH14.-pages-1.pdf?AWSAccessKeyId=AKIA3LET5RMWTV3ZYVEV&Signature=FJvH5qSOUDFyeOAokHvIX8Wxonw%3D&Expires=1727213599'}
                  plugins={[defaultLayoutPluginInstance]}
                />
              </div>
            </Worker>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={signIn}
      >
        {() => {
          return (
            <Form
              style={{
                background: theme.colors.custom.backgroundCard,
                border: "1px solid rgba(28, 31, 35, .08)",
                borderRadius: "12px",
                boxShadow:
                  "0 4px 14px 0 rgba(0, 0, 0, .1), 0 0 1px 0 rgba(0, 0, 0, .3)",
                padding: "40px 64px",
                width: "482px",
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
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  width:'100%',
                  marginTop:'20px'
                }}
              >
                <FastField
                  name="email_or_username"
                  component={CommonField.InputField}
                  fullWidth
                  label="Email or username"
                  required
                  placeholder="Enter your email or username"
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
                  Sign in
                </CommonStyles.Button>
                <CommonStyles.Typography
                  type="normal14"
                  mt={"16px"}
                  textAlign={"center"}
                >
                  Don't have an account? <Link to="/signup">Sign up</Link>
                </CommonStyles.Typography>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default Login;
