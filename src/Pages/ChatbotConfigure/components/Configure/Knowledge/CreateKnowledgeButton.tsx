import { Fragment } from "react/jsx-runtime";

import { useCallback, useMemo } from "react";
import * as yup from "yup";
import { FastField, Form, Formik } from "formik";
import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  useTheme,
} from "@mui/material";

import { isEmpty } from "lodash";
import { toast } from "react-toastify";
import CommonStyles from "../../../../../Components/CommonStyles";
import CommonIcons from "../../../../../Components/CommonIcons";
import CommonField from "../../../../../Components/CommonFields";
import useToggleDialog from "../../../../../Hooks/useToggleDialog";
import httpServices from "../../../../../Services/httpServices";
import { createFolderKnowledge } from "../../../../../Constants/api";
import { useGet } from "../../../../../Stores/useStore";
import { useAuth } from "../../../../../Providers/AuthenticationProvider";

interface IKnowledgeActionDialog {
  toggle: () => void;
  data?: InitValues;
}

export enum KnowledgeTypes {
  Document = "document",
  Table = "table",
  Image = "image",
}

interface InitValues {
  type: KnowledgeTypes;
  name: string;
  description: string;
  avatar_file_input?: File[];
}

export const KnowledgeActionDialog = (props: IKnowledgeActionDialog) => {
  //! State
  const { toggle, data } = props;
  const { userId } = useAuth();
  const theme = useTheme();

  const refetchListFolder = useGet("REFETCH_FOLDER_KNOWLEDGE");
  const isEdit = useMemo(() => {
    return !!data;
  }, []);

  const initialValues = useMemo(() => {
    return {
      type: KnowledgeTypes.Document,
      name: "",
      description: "",
      avatar_file_input: undefined,
      ...data,
    };
  }, []);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      name: yup.string().required("Name is required field"),
    });
  }, []);

  //! Function

  const handleSubmit = useCallback(async (values: InitValues) => {
    if (!userId) return;
    const toastId = toast.loading("Creating knowledge...", {
      isLoading: true,
      autoClose: false,
    });

    try {
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("knowledge_storage_name", values.name);
      if (values.description) {
        formData.append("knowledge_storage_description", values.description);
      }
      if (values.avatar_file_input?.[0]) {
        formData.append("avatar", values.avatar_file_input[0]);
      }

      const response = await httpServices.axios.post(
        createFolderKnowledge,
        formData
      );

      await refetchListFolder();

      if (response.data.status_code === 200) {
        toast.update(toastId, {
          render: (
            <p>
              Create folder knowledge <b>{values.name}</b> successfully!
            </p>
          ),
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        toggle();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      toast.update(toastId, {
        render: (
          <p>
            Create folder knowledge failed. <br /> Reason: {error?.message}
          </p>
        ),
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  }, []);

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
      {({ isSubmitting, errors, dirty, values, setFieldValue }) => {
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
                    {isEdit ? "Edit knowledge" : "Create knowledge"}
                  </CommonStyles.Typography>
                  <CommonStyles.Button isIcon onClick={toggle}>
                    <CommonIcons.Clear />
                  </CommonStyles.Button>
                </Box>
              </DialogTitle>

              <DialogContent>
                <FastField
                  name="name"
                  component={CommonField.InputField}
                  fullWidth
                  label="Name"
                  required
                  placeholder="Enter folder knowledge name"
                  maxChar={100}
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
                    label="Upload Image"
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
                    variant="contained"
                    sx={{
                      background: theme.colors.custom.backgroundCard,
                      "&:hover": {
                        background: theme.colors.custom.backgroundCardHover,
                      },
                      color: "unset",
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
                    disabled={isSubmitting || !isEmpty(errors) || !dirty}
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

const CreateKnowledgeButton = () => {
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
          <KnowledgeActionDialog toggle={toggle} />
        </CommonStyles.Dialog>
      )}
      <CommonStyles.Button
        variant="contained"
        onClick={toggle}
        sx={{
          textWrap: "nowrap",
        }}
      >
        Create knowledge
      </CommonStyles.Button>
    </Fragment>
  );
};

export default CreateKnowledgeButton;
