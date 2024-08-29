import { Fragment } from "react/jsx-runtime";

import { useCallback, useMemo } from "react";
import * as yup from "yup";
import { FastField, Form, Formik } from "formik";
import { Box, DialogActions, DialogContent, DialogTitle } from "@mui/material";

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
  data?: InitValues
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
}

export const KnowledgeActionDialog = (props: IKnowledgeActionDialog) => {
  //! State
  const { toggle, data } = props;
  const { userId } = useAuth();

  const refetchListFolder = useGet("REFETCH_FOLDER_KNOWLEDGE");
  const isEdit = useMemo(() => {
    return !!data
  },[])

  const initialValues = useMemo(() => {
    return {
      type: KnowledgeTypes.Document,
      name: "",
      description: "",
      ...data
    };
  }, []);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      name: yup.string().required("Name is required field"),
    });
  }, []);

  //! Function

  const handleSubmit = useCallback(async (values: InitValues) => {
    const toastId = toast.loading("Creating knowledge...", {
      isLoading: true,
      autoClose: false,
    });

    try {
      const response = await httpServices.axios.post(createFolderKnowledge, {
        user_id: userId,
        knowledge_storage_name_input: values.name,
        knowledge_storage_description_input: values.description,
      });

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
      {({ isSubmitting, errors, dirty }) => {
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
                      background: "#fff",
                      color: "#000",
                      "&:hover": {
                        background: "#fff",
                      },
                    }}
                    onClick={toggle}
                    disabled={isSubmitting}
                    type="button"
                  >
                    Cancel
                  </CommonStyles.Button>
                  <CommonStyles.Button
                    variant="contained"
                    sx={{
                      color: "#fff",
                    }}
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
