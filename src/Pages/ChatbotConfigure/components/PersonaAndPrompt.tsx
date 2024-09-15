import { Box,  } from "@mui/material";
import { Fragment } from "react/jsx-runtime";
import CommonStyles from "../../../Components/CommonStyles";
import { FastField, Form, Formik } from "formik";
import CommonField from "../../../Components/CommonFields";
import { toast } from "react-toastify";
import httpServices from "@/Services/httpServices";
import { updatePrompt } from "@/Constants/api";
import { useParams } from "react-router-dom";
import { useAuth } from "@/Providers/AuthenticationProvider";
import { useMemo } from "react";
import { useGet } from "@/Stores/useStore";

const PersonaAndPrompt = ({ systemPrompt }: { systemPrompt: string }) => {
  //! State
  const params = useParams();
  const botId = params?.botId;
  const { userId } = useAuth();
  const refetchBotData = useGet("REFETCH_BOT_DATA");

  

  console.log("botId", systemPrompt);

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
      const response = await httpServices.post(updatePrompt, {
        bot_id: botId,
        user_id: userId,
        system_prompt: values.personaAndPrompt,
      });

      console.log("response", response);
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

      <Formik enableReinitialize initialValues={inititalValues} onSubmit={handleSubmit}>
        {({ isSubmitting }) => {
          return (
            <Form>
              <Box
                sx={{
                  padding: "20px 16px 0 16px",
                  fieldset: {
                    border: "none",
                  },
                  textarea: {
                    padding: `0 !important`,
                  },
                }}
              >
                <FastField
                  name="personaAndPrompt"
                  component={CommonField.InputField}
                  fullWidth
                  multiline
                  placeholder="Design the bot's persona, features and workflows using natural language."
                  rows={20}
                />

                <CommonStyles.Button
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting}
                  isLoading={isSubmitting}
                >
                  Save
                </CommonStyles.Button>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </Fragment>
  );
};

export default PersonaAndPrompt;
