import { useCallback, useMemo } from "react";
import { FastField, Form, Formik } from "formik";
import { Box, DialogActions, DialogContent, DialogTitle, useTheme } from "@mui/material";
import CommonStyles from "../../../../Components/CommonStyles";
import CommonIcons from "../../../../Components/CommonIcons";
import CommonField from "../../../../Components/CommonFields";
import { isEmpty } from "lodash";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useGet } from "../../../../Stores/useStore";
import cachedKeys from "../../../../Constants/cachedKeys";
import httpServices from "../../../../Services/httpServices";
import { uploadFile } from "../../../../Constants/api";

interface IUploadLocalDialog {
  toggle: () => void;
}

interface UploadValue {
  description: string;
  file_input?: File[];
}

const UploadLocalDialog = (props: IUploadLocalDialog) => {
  //! State
  const { toggle } = props;
  const theme = useTheme()
  const params = useParams();
  const userId = params.id;
  const knowledgeId = params.knowledgeId;

  const refectListFile = useGet(cachedKeys.REFETCH_KNOWLEDGE_FILES);

  const initialValues = useMemo<UploadValue>(() => {
    return {
      description: "",
      file_input: undefined,
    };
  }, []);

  //! Function

  const handleSubmit = useCallback(
    async (values: UploadValue) => {
      if (!values.file_input?.[0]) return;

      const toastId = toast.loading("Uploading knowledge...", {
        isLoading: true,
        autoClose: false,
      });

      try {
        const formdata = new FormData();
        formdata.append("user_id", userId as string);
        formdata.append("knowledge_storage_id", knowledgeId as string);
        formdata.append("description_input", values.description);
        formdata.append("file_input", values.file_input[0]);
        formdata.append("metadata_input", JSON.stringify({}));

         await httpServices.axios.post(uploadFile, formdata);

        refectListFile && (await refectListFile());

        toast.update(toastId, {
          render: "Upload knowledge successfully",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

        toggle()
      } catch (error) {
        console.log("Error upload knowledge file:", error);
        toast.update(toastId, {
          render: "Upload knowledge failed",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
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
                    Upload knowledge from local
                  </CommonStyles.Typography>
                  <CommonStyles.Button isIcon onClick={toggle}>
                    <CommonIcons.Clear />
                  </CommonStyles.Button>
                </Box>
              </DialogTitle>

              <DialogContent>
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
                <CommonStyles.UploadFile
                  label="Upload document"
                  files={values.file_input}
                  dropzoneProps={{
                    onDrop: (acceptedFiles) => {
                      console.log("acceptedFiles", acceptedFiles);
                      setFieldValue("file_input", acceptedFiles);
                    },
                  }}
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
                    sx={{
                      color: "#fff",
                    }}
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

export default UploadLocalDialog;
