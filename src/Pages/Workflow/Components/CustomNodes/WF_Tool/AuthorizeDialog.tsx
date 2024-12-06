import { useCallback, useMemo } from "react";

import { Box } from "@mui/material";
import { FastField, Form, Formik } from "formik";
import * as yup from "yup";

import CommonField from "@/Components/CommonFields";
import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import { toast } from "react-toastify";
import { CredentialsForProvider } from "../../Toolbar/type";
import { cloneDeep } from "lodash";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import useAuthorizeTool from "@/Hooks/workflow/useAuthorizeTool";
import { useAuth } from "@/Providers/AuthenticationProvider";

interface IAddTeamDialog {
  toggle: () => void;
  credential: CredentialsForProvider;
  provider: string;
  toolName: string;
}

interface InitValues {
  [key: string]: string;
}

const AuthorizeDialog = (props: IAddTeamDialog) => {
  //! State
  const { toggle, credential, provider, toolName } = props;
  const { userId } = useAuth();
  const { handleAuthorizeTool } = useAuthorizeTool();
  const initialValues = useMemo(() => {
    const init: InitValues = {};

    Object.keys(cloneDeep(credential)).forEach((key) => {
      init[key] = "";
    });

    return init;
  }, [credential]);

  const validationSchema = useMemo(() => {
    const schemaShape: yup.ObjectShape = {};

    Object.entries(cloneDeep(credential)).forEach(([key, value]) => {
      const shapeValue = yup.string();

      if (value.required) {
        shapeValue.required(`${key} is required field`);
      }

      schemaShape[key] = shapeValue;
    });

    return yup.object().shape(schemaShape);
  }, [credential]);

  //! Function

  const handleSubmit = useCallback(
    async (values: InitValues) => {
      if (!userId) return;
      const toastId = toast.info("Authorizing...", {
        autoClose: false,
        isLoading: true,
      });

      await handleAuthorizeTool.mutateAsync({
        user_id: userId,
        credentials: values,
        tool_name: toolName,
        tool_provider: provider,
      });

      toast.update(toastId, {
        type: "success",
        render: "Team created successfully",
        isLoading: false,
        autoClose: 2000,
      });

      toggle();
    },
    [toggle, userId, provider, toolName, handleAuthorizeTool]
  );

  //! Render
  return (
    <Box>
      <div className="flex justify-between items-center p-3">
        <CommonStyles.Typography type="semiBold18">
          Authorize
        </CommonStyles.Typography>
        <CommonStyles.Button isIcon onClick={toggle}>
          <CommonIcons.Clear />
        </CommonStyles.Button>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => {
          return (
            <Form className="flex gap-4 flex-col p-3">
              {Object.entries(cloneDeep(credential)).map(([key, value]) => {
                return (
                  <div className="flex flex-col gap-1">
                    <FastField
                      key={key}
                      name={key}
                      component={CommonField.InputField}
                      fullWidth
                      label={value.label.en_US}
                      required={value.required}
                      placeholder={value.placeholder.en_US}
                      maxChar={50}
                      type={value.type === "secret-input" ? "password" : "text"}
                    />

                    {value.help.en_US && (
                      <Link
                        to={value.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2"
                      >
                        <CommonStyles.Typography className="opacity-50 hover:underline hover:text-blue-400">
                          {value.help.en_US}
                        </CommonStyles.Typography>

                        <ExternalLink size={14} />
                      </Link>
                    )}
                  </div>
                );
              })}

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
                  disabled={isSubmitting}
                >
                  Confirm
                </CommonStyles.Button>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default AuthorizeDialog;
