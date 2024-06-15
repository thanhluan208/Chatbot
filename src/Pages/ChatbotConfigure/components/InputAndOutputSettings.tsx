import { Box } from "@mui/material";
import CommonStyles from "../../../Components/CommonStyles";
import SlideAndNumField from "./GenerateDiversity/components/SlideAndNumField";
import Hint from "./GenerateDiversity/components/Hint";
import { FastField } from "formik";
import CommonField from "../../../Components/CommonFields";
import { outputFormatOptions } from "../../../Constants/options";

const HintDialogRound = () => {
  return (
    <CommonStyles.Typography>
      Select how many rounds of dialog you want the model to remember.
    </CommonStyles.Typography>
  );
};
const HintReponseMaxLength = () => {
  return (
    <CommonStyles.Typography>
      You can specify the maximum length of the tokens output through this
      value. Typically, 100 tokens are approximately equal to 150 Chinese
      characters.
    </CommonStyles.Typography>
  );
};

const HintOutputFormat = () => {
  return (
    <div>
      <div>
        <strong>Output Format</strong>:
      </div>
      <ul>
        <li>
          <CommonStyles.Typography>
            <strong>Text</strong>: Replies in plain text format
          </CommonStyles.Typography>
        </li>
        <li>
          <CommonStyles.Typography>
            <strong>Markdown</strong>: Uses Markdown format for replies
          </CommonStyles.Typography>
        </li>
        <li>
          <CommonStyles.Typography>
            <strong>JSON</strong>: Uses JSON format for replies
          </CommonStyles.Typography>
        </li>
      </ul>
    </div>
  );
};

const DialogRoundMarks = [
  {
    value: 1,
    label: "1",
  },
  {
    value: 100,
    label: "100",
  },
];

const ResponseLengthMarks = [
  {
    value: 1,
    label: "1",
  },
  {
    value: 8192,
    label: "8192",
  },
];

const InputAndOutputSettings = () => {
  //! State

  //! Function

  //! Render
  return (
    <Box>
      <CommonStyles.Typography type="semiBold16" mt={"16px"} mb="-18px">
        Input and output settings
      </CommonStyles.Typography>

      <Box>
        <SlideAndNumField
          title="Dialog round"
          hintContent={<HintDialogRound />}
          marks={DialogRoundMarks}
          min={1}
          max={100}
          name="dialogRound"
        />
        <SlideAndNumField
          title="Response max length"
          hintContent={<HintReponseMaxLength />}
          marks={ResponseLengthMarks}
          min={1}
          max={8192}
          name="responseLength"
        />

        <Box
          display="flex"
          justifyContent={"space-between"}
          alignItems={"center"}
          mt={"16px"}
        >
          <Box display="flex" alignItems={"center"}>
            <CommonStyles.Typography type="normal12">
              Output format
            </CommonStyles.Typography>
            <Hint content={<HintOutputFormat />} />
          </Box>
          <Box
            sx={{
              width: "280px",
            }}
          >
            <FastField
              name="outputFormat"
              component={CommonField.MuiSelectField}
              options={outputFormatOptions}
              fullWidth
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default InputAndOutputSettings;
