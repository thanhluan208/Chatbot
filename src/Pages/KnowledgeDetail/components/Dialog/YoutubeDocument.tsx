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
import { uploadYoutube } from "../../../../Constants/api";

interface IYoutubeDocument {
  toggle: () => void;
}

interface UploadValue {
  description_input: string;
  youtube_url_input: string;
}

const YoutubeDocument = (props: IYoutubeDocument) => {
  //! State
  const { toggle } = props;
  const theme = useTheme()
  const params = useParams();
  const userId = params.id;
  const knowledgeId = params.knowledgeId;

  const refectListFile = useGet(cachedKeys.REFETCH_KNOWLEDGE_DETAILS);

  const initialValues = useMemo<UploadValue>(() => {
    return {
      description_input: "",
      youtube_url_input: "",
    };
  }, []);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      youtube_url_input: yup.string().required("Youtube url is required"),
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
          youtube_url_input: values.youtube_url_input,
        };

        await httpServices.axios.post(uploadYoutube, payload);

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
                    Upload knowledge using youtube url
                  </CommonStyles.Typography>
                  <CommonStyles.Button isIcon onClick={toggle}>
                    <CommonIcons.Clear />
                  </CommonStyles.Button>
                </Box>
              </DialogTitle>

              <DialogContent>
                <FastField
                  name="youtube_url_input"
                  component={CommonField.InputField}
                  fullWidth
                  label="Youtube url"
                  placeholder="Enter youtube url"
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

export default YoutubeDocument;
