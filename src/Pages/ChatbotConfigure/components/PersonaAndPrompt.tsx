import { Box } from "@mui/material";
import { Fragment } from "react/jsx-runtime";
import CommonStyles from "../../../Components/CommonStyles";
import { Field, Form, Formik } from "formik";
import CommonField from "../../../Components/CommonFields";
import { toast } from "react-toastify";
import httpServices from "@/Services/httpServices";
import { updatePrompt,  } from "@/Constants/api";
import { useParams } from "react-router-dom";
import { useAuth } from "@/Providers/AuthenticationProvider";
import { useCallback, useMemo, useRef } from "react";
import { useGet } from "@/Stores/useStore";

const PersonaAndPrompt = ({ systemPrompt }: { systemPrompt: string }) => {
  //! State
  const params = useParams();
  const botId = params?.botId;
  const { userId } = useAuth();
  const refetchBotData = useGet("REFETCH_BOT_DATA");
  const timeoutRef = useRef<any>(null)

  const inititalValues = useMemo(() => {
    return {
      personaAndPrompt: systemPrompt ?? "",
    };
  }, [systemPrompt]);

  //! Function
  const handleSubmit = async (values: { personaAndPrompt: string }) => {
    if (!botId) return;
    const toastId = toast.loading("Saving persona and prompt...", {
      isLoading: true,
      autoClose: false,
    });

    try {
      await httpServices.post(updatePrompt, {
        bot_id: botId,
        user_id: userId,
        system_prompt: values.personaAndPrompt,
      });

      refetchBotData && (await refetchBotData());

      toast.update(toastId, {
        isLoading: false,
        render: "Saved persona and prompt",
        type: "success",
        autoClose: 3000,
      });
    } catch (error) {
      console.log("error", error);
      toast.update(toastId, {
        isLoading: false,
        render: "Failed to save persona and prompt",
        type: "error",
        autoClose: 3000,
      });
    }
  };

  const afterOnChangePrompt = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        httpServices
          .post(updatePrompt, {
            bot_id: botId,
            user_id: userId,
            system_prompt: event.target.value,
          })
          .catch((err) => {
            console.log("err", err);
            toast.error("Failed to update system prompt");
          });
      }, 500);
    },
    [botId, userId]
  );

  //! Render
  return (
    <Fragment>
      <Box
        px="10px"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <CommonStyles.Typography type="bold14">
          Persona & Prompt
        </CommonStyles.Typography>
        {/* <CommonStyles.Button startIcon={<CommonIcons.AutoAwesome />}>
          <Tooltip title="Auto-optimize your prompt" placement="top-start">
            <div>Optimize</div>
          </Tooltip>
        </CommonStyles.Button> */}
      </Box>

      <Formik
        enableReinitialize
        initialValues={inititalValues}
        onSubmit={handleSubmit}
      >
        {() => {
          return (
            <Form>
              <Box
                sx={{
                  padding: "20px 0",
                  fieldset: {
                    border: "none",
                  },
                  textarea: {
                    padding: `12 16px!important`,
                  },
                }}
              >
                <Field
                  id="personaAndPrompt"
                  name="personaAndPrompt"
                  component={CommonField.InputField}
                  fullWidth
                  multiline
                  placeholder="Design the bot's persona, features and workflows using natural language."
                  rows={20}
                  autoFocus
                  sx={{
                    div: {
                      background: "transparent",
                    },
                  }}
                  afterOnChange={afterOnChangePrompt}
                />

              </Box>
            </Form>
          );
        }}
      </Formik>
    </Fragment>
  );
};

export default PersonaAndPrompt;
