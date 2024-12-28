import { Fragment } from "react/jsx-runtime";
import useToggleDialog from "../../../Hooks/useToggleDialog";
import CommonIcons from "../../CommonIcons";
import CommonStyles from "../../CommonStyles";
import { useCallback, useMemo } from "react";
import * as yup from "yup";
import { Box, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { FastField, Form, Formik } from "formik";
import CommonField from "../../CommonFields";
import { isEmpty } from "lodash";

import { toast } from "react-toastify";
import httpServices from "../../../Services/httpServices";
import { createBot } from "../../../Constants/api";
import { useGet } from "../../../Stores/useStore";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../Providers/AuthenticationProvider";
import { useTranslation } from "react-i18next";

interface ICreateBotDialog {
  toggle: () => void;
}

interface InitValues {
  name: string;
  description: string;
  avatar_file_input?: File[];
}

export const CreateBotDialog = (props: ICreateBotDialog) => {
  //translation
  const { t } = useTranslation("store");

  //! State
  const { toggle } = props;
  const params = useParams();
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { id } = params;
  const refetchListBot = useGet("REFETCH_LIST_BOT");
  const initialValues = useMemo(() => {
    return {
      name: "",
      description: "",
      avatar_file_input: undefined,
    };
  }, []);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      name: yup.string().required("Name is required field"),
    });
  }, []);

  //! Function

  const handleSubmit = useCallback(
    async (values: InitValues) => {
      if (!userId) return;
      const toastId = toast.info("Creating bot...", {
        isLoading: true,
        autoClose: false,
      });

      try {
        const formData = new FormData();

        formData.append("user_id", userId);
        formData.append("bot_name", values.name);
        if (values.description) {
          formData.append("bot_description", values.description);
        }

        if (values.avatar_file_input) {
          formData.append("avatar_file_input", values.avatar_file_input[0]);
        }

        const response = await httpServices.axios.post(createBot, formData);
        refetchListBot && (await refetchListBot());

        console.log("Create bot response: ", response);
        if (response.data.status_code === 200) {
          toast.update(toastId, {
            render: `Bot ${values.name} created successfully!`,
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
          if (userId && response.data.bot_id) {
            navigate(`/workspace/${userId}/bot/${response.data.bot_id}`);
          }
        } else {
          throw new Error(response.data.message);
        }

        toggle();
      } catch (error: any) {
        console.log("Create bot error: ", error);
        toast.update(toastId, {
          render: error?.message || "Create bot failed",
          type: "error",
          autoClose: 2000,
          isLoading: false,
        });
      }
    },
    [refetchListBot, id, userId, navigate]
  );

  //! Render
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      validateOnChange
      validateOnBlur
      validateOnMount
    >
      {({ isSubmitting, errors, values, setFieldValue }) => {
        return (
          <Form
            style={{
              display: "flex",
              gap: "16px",
              flexDirection: "column",
            }}
          >
            <Box>
              <DialogTitle>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  mb={3}
                >
                  <CommonStyles.Typography type="semiBold18">
                    {t("dialog.createBot.title")}
                  </CommonStyles.Typography>
                  <CommonStyles.Button isIcon onClick={toggle}>
                    <CommonIcons.Clear />
                  </CommonStyles.Button>
                </Box>
              </DialogTitle>

              <DialogContent>
                {/* <WorkSpaceSelect /> */}

                <FastField
                  name="name"
                  component={CommonField.InputField}
                  fullWidth
                  label={t("dialog.createBot.botNameLabel")}
                  required
                  placeholder={t("dialog.createBot.botNamePlaceholder")}
                  maxChar={50}
                />
                <FastField
                  name="description"
                  component={CommonField.InputField}
                  fullWidth
                  label={t("dialog.createBot.botDescLabel")}
                  placeholder={t("dialog.createBot.botDescPlaceholder")}
                  multiline
                  minRows={6}
                  maxChar={2000}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "16px",
                    marginTop: "16px",
                  }}
                >
                  {values.avatar_file_input?.[0] && (
                    <img
                      src={URL.createObjectURL(values.avatar_file_input[0])}
                      alt="avatar"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  )}
                  <CommonStyles.UploadFile
                    label={t("dialog.createBot.uploadImg")}
                    files={values.avatar_file_input}
                    dropzoneProps={{
                      onDrop: (acceptedFiles) => {
                        setFieldValue("avatar_file_input", acceptedFiles);
                      },
                    }}
                    handleDeleteFile={() => {
                      setFieldValue("avatar_file_input", undefined);
                    }}
                  />
                </Box>
              </DialogContent>

              <DialogActions>
                <Box
                  display="flex"
                  justifyContent={"end"}
                  gap="16px"
                  sx={{
                    button: {
                      fontWeight: "550",
                      padding: "6px 20px",
                    },
                  }}
                >
                  <CommonStyles.Button
                    variant="outlined"
                    onClick={toggle}
                    disabled={isSubmitting}
                    type="button"
                  >
                    {t("dialog.button.cancel")}
                  </CommonStyles.Button>
                  <CommonStyles.Button
                    variant="contained"
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={isSubmitting || !isEmpty(errors)}
                  >
                    {t("dialog.button.confirm")}
                  </CommonStyles.Button>
                </Box>
              </DialogActions>
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
};

function CreateBotButton() {

  //translation
  const { t } = useTranslation("store");

  //! State

  const { open, shouldRender, toggle } = useToggleDialog();

  //! Function

  //! Render
  return (
    <Fragment>
      {shouldRender && (
        <CommonStyles.Dialog
          open={open}
          toggle={toggle}
          maxWidth="sm"
          fullWidth
        >
          <CreateBotDialog toggle={toggle} />
        </CommonStyles.Dialog>
      )}
      <CommonStyles.Button
        fullWidth
        variant="contained"
        startIcon={<CommonIcons.Add />}
        onClick={toggle}
      >
        {t("sidebar.button.createBot")}
      </CommonStyles.Button>
    </Fragment>
  );
}

export default CreateBotButton;
