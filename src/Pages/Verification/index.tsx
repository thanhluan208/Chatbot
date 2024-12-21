import { Box, useTheme } from "@mui/material";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import { useAuth } from "../../Providers/AuthenticationProvider";
import { Link, useNavigate } from "react-router-dom";
import { Fragment, useEffect, useRef, useState } from "react";
import CommonStyles from "../../Components/CommonStyles";
import CommonField from "../../Components/CommonFields";
import { useTranslation } from "react-i18next";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/Components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { ShieldCheck } from "lucide-react";
import useMutateAuthen from "@/Hooks/User/useMutateAuthen";
import { toast } from "react-toastify";
import { ListRoutes } from "@/Constants/routes";

const Verification = () => {
  // Translation
  const { t } = useTranslation("store");

  //! State
  const [openVerify, setOpenVerify] = useState(false);

  const email = useRef("");
  const otpInput = useRef("");

  const { handleSubmitOTP, handleVerifyEmail } = useMutateAuthen();
  const { userId } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const initialValues = {
    email: "",
  };

  const validationSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
  });

  //! Function
  const handleSubmit = async (values: any) => {
    const response = await handleVerifyEmail.mutateAsync(values.email)

    if(response.data.status_code === 400) {
        toast.error("Fail to send OTP. Please try again later")
    }

    email.current = values.email;
    setOpenVerify(true);
  };

  const handleChangeInputOTP = async (newValue: string) => {
    if (handleSubmitOTP.isLoading || newValue === otpInput.current) return;
    if (newValue.length === 6) {
      otpInput.current = newValue;
      const toastID = toast.loading("Verifying OTP...", {
        autoClose: false,
        isLoading: true,
      });
      const response = await handleSubmitOTP.mutateAsync({
        email: email.current,
        otp: newValue,
      });
      if (response.data.status_code === 200) {
        toast.update(toastID, {
          type: "success",
          render: response?.data?.message || "Verify successfully",
          isLoading: false,
          autoClose: 2000,
        });
        navigate(ListRoutes.login);
      } else {
        toast.update(toastID, {
          type: "error",
          render: response?.data?.message || "Verify failed",
          isLoading: false,
          autoClose: 2000,
        });
      }
    }
  };

  //! Effect
  useEffect(() => {
    if (userId) {
      navigate("/");
    }
  }, [userId]);

  //! Render
  return (
    <Fragment>
      {openVerify && (
        <CommonStyles.Dialog
          open={openVerify}
          toggle={() => setOpenVerify(!openVerify)}
          maxWidth="xs"
          fullWidth
          sx={{
            "& .MuiDialog-container": {
              background: "rgba(0, 0, 0, 0.8)",
            },
          }}
        >
          <div
            className="w-full px-6 py-3 flex flex-col items-center rounded-lg"
            style={{
              background: theme.colors.custom.backgroundCard,
              border: `1px solid ${theme.colors.custom.borderColor}`,
            }}
          >
            <div
              className="w-16 h-16 flex items-center justify-center rounded-full"
              style={{
                background: theme.palette.primary.main,
              }}
            >
              <ShieldCheck size={40} />
            </div>

            <CommonStyles.Typography type="semiBold24">
              {t("signup.verifyTitle")}
            </CommonStyles.Typography>
            <CommonStyles.Typography
              type="normal16"
              mt="10px"
              className="opacity-50 text-center"
            >
              {t("signup.verifyDesc")}
            </CommonStyles.Typography>

            <div className="mt-3">
              <InputOTP
                maxLength={6}
                onChange={handleChangeInputOTP}
                pattern={REGEXP_ONLY_DIGITS}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
        </CommonStyles.Dialog>
      )}
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
          onSubmit={handleSubmit}
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
                  Verification
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
                  <Field
                    name="email"
                    component={CommonField.InputField}
                    fullWidth
                    label="Email"
                    required
                    placeholder={t("signup.emailPlaceholder")}
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
                    {t("signup.naviText")}{" "}
                    <Link to="/login">{t("signup.signInLink")}</Link>
                  </CommonStyles.Typography>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </Fragment>
  );
};

export default Verification;
