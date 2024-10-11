import { Box, useTheme } from "@mui/material";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import { useAuth } from "../../Providers/AuthenticationProvider";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import CommonStyles from "../../Components/CommonStyles";
import CommonField from "../../Components/CommonFields";
import { useTranslation } from "react-i18next";

const SignUp = () => {
  // Translation
  const { t } = useTranslation("store");

  //! State
  const { userId, signUp } = useAuth();
  const theme = useTheme()
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
                 background: theme.colors.custom.backgroundCard,
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
                {t("signup.title")}
              </CommonStyles.Typography>
              <CommonStyles.Typography type="normal16" textAlign={"center"}>
                {t("signup.smallTitle")}
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
                  <Field
                    name="user_name"
                    component={CommonField.InputField}
                    fullWidth
                    label={t("signup.usernameLabel")}
                    required
                    placeholder={t("signup.usernamePlaceholder")}
                  />

                  <Field
                    name="password"
                    component={CommonField.InputField}
                    fullWidth
                    label={t("signup.pwLabel")}
                    required
                    placeholder={t("signup.pwPlaceholder")}
                    type="password"
                  />
                </Box>

                <Field
                  name="email"
                  component={CommonField.InputField}
                  fullWidth
                  label="Email"
                  placeholder={t("signup.emailPlaceholder")}
                />

                <Field
                  name="address"
                  component={CommonField.InputField}
                  fullWidth
                  label={t("signup.addressLabel")}
                  placeholder={t("signup.addressPlaceholder")}
                />

                <Field
                  name="phone_num"
                  component={CommonField.InputField}
                  fullWidth
                  label={t("signup.phoneLabel")}
                  placeholder={t("signup.phonePlaceholder")}
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
                  {t("signup.btnSubmit")}
                </CommonStyles.Button>
                <CommonStyles.Typography
                  type="normal14"
                  mt={"16px"}
                  textAlign={"center"}
                >
                  {t("signup.naviText")} <Link to="/login">{t("signup.signInLink")}</Link>
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
