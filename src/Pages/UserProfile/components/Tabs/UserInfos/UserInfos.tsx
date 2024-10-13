import CommonField from "@/Components/CommonFields";
import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import { updateUser } from "@/Constants/api";
import { UserData } from "@/Hooks/User/useGetUserData";
import { useAuth } from "@/Providers/AuthenticationProvider";
import httpServices from "@/Services/httpServices";
import { Box, useTheme } from "@mui/material";
import { FastField, Form, Formik, useFormikContext } from "formik";
import { Fragment, useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useTranslation } from "react-i18next";

const InfoItem = ({
  name,
  label,
  icon,
  isEdit,
}: {
  name: string;
  label: string;
  icon: any;
  isEdit?: boolean;
}) => {
  const { values } = useFormikContext<any>();
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        gap: "24px",
        alignItems: "center",
        padding: "8px 24px",
        borderRadius: "12px",
        background: theme.colors.custom.backgroundCard,
        svg: {
          width: "20px",
          height: "20px",
        },
        transition: "all 0.3s",
        "&:hover": {
          boxShadow: theme.colors.custom.boxShadow,
        },
      }}
    >
      <Box
        sx={{
          padding: "8px",
          borderRadius: "50%",
          background: theme.colors.custom.backgroundSecondary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center ",
        }}
      >
        {icon}
      </Box>
      <Box>
        <CommonStyles.Typography type="semiBold16">
          {label}
        </CommonStyles.Typography>
        {!isEdit ? (
          <CommonStyles.Typography>
            {values[name] || "--"}
          </CommonStyles.Typography>
        ) : (
          <FastField
            name={name}
            component={CommonField.InputField}
            variant="standard"
            type={name === "phone" ? "number" : "text"}
            sx={{
              div: {
                background: "transparent",
              },
            }}
          />
        )}
      </Box>
    </Box>
  );
};

interface InitValues {
  user_name: string;
  email: string;
  phone: string;
  address: string;
}

const UserInfos = ({ userData }: { userData: UserData }) => {
  //Translation
  const { t } = useTranslation("store");

  //! State
  const { userId } = useAuth();
  const [isEdit, setIsEdit] = useState(false);
  const { userId: id } = useParams();

  const isOwner = id === userId;

  const initialValues: InitValues = useMemo(() => {
    return {
      user_name: userData?.user_name || "",
      email: userData?.email || "",
      phone: userData?.phone_num || "",
      address: userData?.address || "",
    };
  }, [userData]);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      user_name: yup.string().required("Username is required"),
    });
  }, []);

  //! Function
  const handleSubmit = useCallback(async (values: InitValues) => {
    const toastId = toast.loading("Saving user information...");

    try {
      await httpServices.post(updateUser, {
        user_id: userId,
        edit_user_data: values,
      });

      toast.update(toastId, {
        render: "Save user information successfully",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error) {
      toast.update(toastId, {
        render: "Save user information failed",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  }, []);

  //! Render

  return (
    <Box>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ resetForm }) => {
          return (
            <Form>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "49% 49%",
                  gap: "2%",
                  rowGap: "24px",
                }}
              >
                <InfoItem
                  isEdit={isEdit}
                  name="user_name"
                  label={t("personal.userInfos.form.usernameLabel")}
                  icon={<CommonIcons.Person />}
                />
                <InfoItem
                  isEdit={isEdit}
                  name="email"
                  label="Email"
                  icon={<CommonIcons.Email />}
                />
                <InfoItem
                  isEdit={isEdit}
                  name="phone"
                  label={t("personal.userInfos.form.phoneLabel")}
                  icon={<CommonIcons.Phone />}
                />
                <InfoItem
                  isEdit={isEdit}
                  name="address"
                  label={t("personal.userInfos.form.addressLabel")}
                  icon={<CommonIcons.Home />}
                />
              </Box>
              {isOwner && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "12px",
                    marginTop: "20px",
                  }}
                >
                  {isEdit ? (
                    <Fragment>
                      <CommonStyles.Button
                        variant="outlined"
                        onClick={() => {
                          setIsEdit(false);
                          resetForm();
                        }}
                      >
                        {t("personal.userInfos.button.cancel")}
                      </CommonStyles.Button>
                      <CommonStyles.Button
                        variant="contained"
                        startIcon={<CommonIcons.Save />}
                        type="submit"
                      >
                        {t("personal.userInfos.button.save")}
                      </CommonStyles.Button>
                    </Fragment>
                  ) : (
                    <CommonStyles.Button
                      variant="contained"
                      startIcon={<CommonIcons.Edit />}
                      onClick={() => setIsEdit(true)}
                    >
                      {t("personal.userInfos.button.edit")}
                    </CommonStyles.Button>
                  )}
                </Box>
              )}
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default UserInfos;
