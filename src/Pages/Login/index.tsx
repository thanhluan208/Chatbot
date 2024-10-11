import { Box, useTheme } from "@mui/material";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import { useAuth } from "../../Providers/AuthenticationProvider";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import CommonStyles from "../../Components/CommonStyles";
import CommonField from "../../Components/CommonFields";
import { useTranslation } from "react-i18next";

const Login = () => {
  //Translation
  const { t } = useTranslation("store");
  
  //! State
  const { userId, signIn } = useAuth();

  const navigate = useNavigate();
  const initialValues = {
    email_or_username: "",
    password: "",
  };

  const validationSchema = yup.object().shape({
    email_or_username: yup.string().required(t("login.emailWarning")),
    password: yup.string().required(t("login.pwWarning")),
  });

  const theme = useTheme();

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
                {t("login.title")}
              </CommonStyles.Typography>
              <CommonStyles.Typography type="normal16" textAlign={"center"}>
                {t("login.smallTitle")}
              </CommonStyles.Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  width: "100%",
                  marginTop: "20px",
                }}
              >
                <Field
                  name="email_or_username"
                  component={CommonField.InputField}
                  fullWidth
                  label={t("login.emailLabel")}
                  required
                  placeholder={t("login.emailPlaceholder")}
                />
                <Field
                  name="password"
                  component={CommonField.InputField}
                  fullWidth
                  label={t("login.pwLabel")}
                  required
                  placeholder={t("login.pwPlaceholder")}
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
                  {t("login.btnSubmit")}
                </CommonStyles.Button>
                <CommonStyles.Typography
                  type="normal14"
                  mt={"16px"}
                  textAlign={"center"}
                >
                  {t("login.naviText")} <Link to="/signup">{t("login.signUpLink")}</Link>
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
