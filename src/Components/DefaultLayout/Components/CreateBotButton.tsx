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

interface ICreateBotDialog {
  toggle: () => void;
}

interface InitValues {
  name: string;
  description: string;
}

export const CreateBotDialog = (props: ICreateBotDialog) => {
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
      const toastId = toast.info("Creating bot...", {
        isLoading: true,
        autoClose: false,
      });

      try {
        const response = await httpServices.axios.post(createBot, {
          user_id: userId,
          bot_name: values.name,
          bot_description: values.description,
        });
        refetchListBot && (await refetchListBot());
        if (response.data.status_code === 200) {
          toast.update(toastId, {
            render: `Bot ${values.name} created successfully!`,
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
          if (id && response.data.bot_id) {
            navigate(`/workspace/${id}/bot/${response.data.bot_id}`);
          }
        } else {
          throw new Error(response.data.message);
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
                    Create Bot
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
                  label="Bot name"
                  required
                  placeholder="Give the bot a unique name"
                  maxChar={50}
                />
                <FastField
                  name="description"
                  component={CommonField.InputField}
                  fullWidth
                  label="Bot description"
                  placeholder="Introduce the bot's features. The description will be displayed to the bot's users"
                  multiline
                  minRows={6}
                  maxChar={2000}
                />

                {/* <Box>
                  <CommonStyles.Typography type="bold14" my={1}>
                    Profile picture
                    <span
                      style={{
                        color: theme.colors.custom.colorErrorTypo,
                        marginLeft: "4px",
                      }}
                    >
                      *
                    </span>
                  </CommonStyles.Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <Field
                      name="avatar"
                      component={CommonField.ButtonUploadField}
                    />
                    <Box
                      sx={{
                        width: "100%",
                        borderRadius: "12px",
                        background: "#f0f0f5",
                        height: "100px",
                        display: "flex",
                        alignItems: "center",
                        padding: "10px 20px",
                      }}
                    >
                      <CommonStyles.Button
                        disabled={isDisabledAiGenerate}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "column",
                          height: "80px",
                          width: "80px",
                          border: "solid 1px #ccc",
                          background: "#fff",
                          svg: {
                            width: "18px",
                            height: "18px",
                          },
                        }}
                      >
                        <CommonIcons.AiIcon />
                        <CommonStyles.Typography type="normal12">
                          Generate
                        </CommonStyles.Typography>
                      </CommonStyles.Button>
                    </Box>
                  </Box>
                </Box> */}
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

function CreateBotButton() {
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
        Create bot
      </CommonStyles.Button>
    </Fragment>
  );
}

export default CreateBotButton;
