import { Box, Tooltip } from "@mui/material";
import { Fragment } from "react/jsx-runtime";
import CommonStyles from "../../../Components/CommonStyles";
import CommonIcons from "../../../Components/CommonIcons";
import { FastField, Formik } from "formik";
import CommonField from "../../../Components/CommonFields";

const PersonaAndPrompt = () => {
  //! State

  //! Function

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
        <CommonStyles.Button startIcon={<CommonIcons.AutoAwesome />}>
          <Tooltip title="Auto-optimize your prompt" placement="top-start">
            <div>Optimize</div>
          </Tooltip>
        </CommonStyles.Button>
      </Box>

      <Formik initialValues={{ personaAndPrompt: "" }} onSubmit={() => {}}>
        {() => {
          return (
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
            </Box>
          );
        }}
      </Formik>
    </Fragment>
  );
};

export default PersonaAndPrompt;
