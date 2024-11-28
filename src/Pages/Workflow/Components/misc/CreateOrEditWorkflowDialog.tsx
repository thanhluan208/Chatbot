import { useCallback, useMemo } from "react";
import * as yup from "yup";
import { Box, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { FastField, Form, Formik } from "formik";
import { isEmpty } from "lodash";

import { toast } from "react-toastify";
import { useGet } from "../../../../Stores/useStore";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../../Providers/AuthenticationProvider";
import { useTranslation } from "react-i18next";
import CommonStyles from "@/Components/CommonStyles";
import CommonIcons from "@/Components/CommonIcons";
import CommonField from "@/Components/CommonFields";
import { createWorkflowPayload } from "@/Types/workflow";
import useCreateWorkflow from "@/Hooks/workflow/useCreateWorkflow";

interface ICreateOrEditWorkflowDialog {
  toggle: () => void;
  initData?: createWorkflowPayload;
}

export const CreateOrEditWorkflowDialog = (
  props: ICreateOrEditWorkflowDialog
) => {
  //translation
  const { t } = useTranslation("node");

  //! State
  const { toggle, initData } = props;
  const params = useParams();
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { id } = params;
  const refetchListBot = useGet("REFETCH_LIST_BOT");

  const isEdit = !!initData;
  const initialValues = useMemo<createWorkflowPayload>(() => {
    return {
      user_id: userId as string,
      workflow_name: "",
      workflow_description: "",
      avatar_file_input: undefined,
    };
  }, [userId]);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      workflow_name: yup.string().required("Workflow is required field"),
    });
  }, []);

  const { handleCreateWorkflow } = useCreateWorkflow();
  const { mutateAsync: createWorkflow } = handleCreateWorkflow;

  //! Function

  const handleSubmit = useCallback(
    async (values: createWorkflowPayload) => {
      if (!userId) return;

      const loadingMsg = !isEdit
        ? t("WF_mutate_dialog.create.creating")
        : t("WF_mutate_dialog.edit.editing");
      const toastId = toast.info(loadingMsg, {
        isLoading: true,
        autoClose: false,
      });

      try {
        const formData = new FormData();

        formData.append("user_id", userId);
        formData.append("workflow_name", values.workflow_name);
        if (values.workflow_description) {
          formData.append("workflow_description", values.workflow_description);
        }

        if (values.avatar_file_input) {
          formData.append("avatar_file_input", values.avatar_file_input);
        }

        if (!isEdit) {
            const {data} = await createWorkflow(formData);
            if(data?.status_code === 200) {
                toast.update(toastId, {
                    render: data?.message || t('WF_mutate_dialog.create.created'),
                    type: "success",
                    autoClose: 2000,
                    isLoading: false,
                });
                // navigate(`/workflow/${data?.workflow_id}`);
                toggle();
            }
        }
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
    [refetchListBot, id, userId, navigate, isEdit, createWorkflow]
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
                    {t("WF_mutate_dialog.create.title")}
                  </CommonStyles.Typography>
                  <CommonStyles.Button isIcon onClick={toggle}>
                    <CommonIcons.Clear />
                  </CommonStyles.Button>
                </Box>
              </DialogTitle>

              <DialogContent>
                <FastField
                  name="workflow_name"
                  component={CommonField.InputField}
                  fullWidth
                  label={t("WF_mutate_dialog.create.workflow_name")}
                  required
                  placeholder={t("WF_mutate_dialog.create.workflow_name")}
                  maxChar={50}
                />
                <FastField
                  name="workflow_description"
                  component={CommonField.InputField}
                  fullWidth
                  label={t("WF_mutate_dialog.create.description")}
                  placeholder={t("WF_mutate_dialog.create.description")}
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
                  {values.avatar_file_input && (
                    <img
                      src={URL.createObjectURL(
                        values.avatar_file_input as File
                      )}
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
                    label={t("WF_mutate_dialog.create.avatar")}
                    files={
                      values.avatar_file_input
                        ? [values.avatar_file_input as File]
                        : []
                    }
                    dropzoneProps={{
                      onDrop: (acceptedFiles) => {
                        setFieldValue("avatar_file_input", acceptedFiles[0]);
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
                    {t("WF_mutate_dialog.create.cancel")}
                  </CommonStyles.Button>
                  <CommonStyles.Button
                    variant="contained"
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={isSubmitting || !isEmpty(errors)}
                  >
                    {t("WF_mutate_dialog.create.save")}
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

export default CreateOrEditWorkflowDialog;
