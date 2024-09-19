import { useCallback, useMemo } from "react";
import { FastField, Form, Formik } from "formik";
import { Box, DialogActions, DialogContent, DialogTitle, useTheme } from "@mui/material";
import CommonStyles from "../../../../Components/CommonStyles";
import CommonIcons from "../../../../Components/CommonIcons";
import CommonField from "../../../../Components/CommonFields";
import { isEmpty } from "lodash";
import { useParams } from "react-router-dom";
import { useGet } from "../../../../Stores/useStore";
import cachedKeys from "../../../../Constants/cachedKeys";
import * as yup from "yup";
import { toast } from "react-toastify";
import httpServices from "../../../../Services/httpServices";
import { uploadUrl } from "../../../../Constants/api";

interface IFileURLDocumentDialog {
  toggle: () => void;
}

interface UploadValue {
  description_input: string;
  url_input: string;
}

const FileURLDocumentDialog = (props: IFileURLDocumentDialog) => {
  //! State
  const { toggle } = props;
  const theme = useTheme()
  const params = useParams();
  const userId = params.id;
  const knowledgeId = params.knowledgeId;

  const refectListFile = useGet(cachedKeys.REFETCH_KNOWLEDGE_FILES);

  const initialValues = useMemo<UploadValue>(() => {
    return {
      description_input: "",
      url_input: "",
    };
  }, []);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      url_input: yup.string().required("Url input is required"),
    });
  }, []);

  //! Function

  const handleSubmit = useCallback(
    async (values: UploadValue) => {
      const toastId = toast.loading("Uploading knowledge...", {
        isLoading: true,
        autoClose: false,
      });

      try {
        const payload = {
          user_id: userId,
          knowledge_storage_id: knowledgeId,
          description_input: values.description_input,
          url_input: values.url_input,
        };

        await httpServices.axios.post(uploadUrl, payload);

        refectListFile && (await refectListFile());

        toast.update(toastId, {
          render: "Upload knowledge successfully",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

        toggle();
      } catch (error) {
        toast.update(toastId, {
          render: "Upload knowledge failed",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });

        console.log("Error upload knowledge file:", error);
      }
    },
    [userId, knowledgeId, refectListFile]
  );

  //! Render
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validateOnChange
      validateOnBlur
      validateOnMount
      validationSchema={validationSchema}
    >
      {({ isSubmitting, errors }) => {
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
                    Upload knowledge using url
                  </CommonStyles.Typography>
                  <CommonStyles.Button isIcon onClick={toggle}>
                    <CommonIcons.Clear />
                  </CommonStyles.Button>
                </Box>
              </DialogTitle>

              <DialogContent>
                <FastField
                  name="url_input"
                  component={CommonField.InputField}
                  fullWidth
                  label="Url"
                  placeholder="Enter file's url"
                  required
                />
                <FastField
                  name="description"
                  component={CommonField.InputField}
                  fullWidth
                  label="Description"
                  placeholder="Enter folder knowledge description"
                  multiline
                  minRows={6}
                  maxChar={2000}
                />
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
                    variant="contained"
                    sx={{
                      background: theme.colors.custom.backgroundCard,
                      "&:hover": {
                        background: theme.colors.custom.backgroundCardHover,
                      },
                      color:'unset'
                    }}
                    onClick={toggle}
                    disabled={isSubmitting}
                    type="button"
                  >
                    <CommonStyles.Typography>Cancel</CommonStyles.Typography>
                  </CommonStyles.Button>
                  <CommonStyles.Button
                    variant="contained"
                   
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={isSubmitting || !isEmpty(errors)}
                  >
                    Confirm
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

export default FileURLDocumentDialog;
