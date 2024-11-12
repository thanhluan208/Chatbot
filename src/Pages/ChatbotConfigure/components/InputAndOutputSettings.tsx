import { Box } from "@mui/material";
import CommonStyles from "../../../Components/CommonStyles";
import SlideAndNumField from "./GenerateDiversity/components/SlideAndNumField";
import {  useFormikContext } from "formik";
import { initialValueEngine } from "./EngineButton";

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

// const HintOutputFormat = () => {
//   return (
//     <div>
//       <div>
//         <strong>Output Format</strong>:
//       </div>
//       <ul>
//         <li>
//           <CommonStyles.Typography>
//             <strong>Text</strong>: Replies in plain text format
//           </CommonStyles.Typography>
//         </li>
//         <li>
//           <CommonStyles.Typography>
//             <strong>Markdown</strong>: Uses Markdown format for replies
//           </CommonStyles.Typography>
//         </li>
//         <li>
//           <CommonStyles.Typography>
//             <strong>JSON</strong>: Uses JSON format for replies
//           </CommonStyles.Typography>
//         </li>
//       </ul>
//     </div>
//   );
// };


const InputAndOutputSettings = () => {
  //! State
  const { values } = useFormikContext<initialValueEngine>();
  const { model } = values || {};
  //! Function
  //! Render
  return (
    <Box onClick={(e) => e.stopPropagation()}>
      <CommonStyles.Typography type="semiBold16" mt={"16px"} >
        Input and output settings
      </CommonStyles.Typography>

      <Box sx={{
        paddingBottom:"20px"
      }}>
        <SlideAndNumField
          title="Dialog round"
          hintContent={<HintDialogRound />}
          min={model ? model.history_turn.min : 1}
          max={model ? model.history_turn.max : 100}
          step={1}  
          name="history_turn"
        />
        <SlideAndNumField
          title="Response max length"
          hintContent={<HintReponseMaxLength />}
          min={model ? model.max_tokens.min : 1}
          max={model ? model.max_tokens.max : 8192}
          name="max_tokens"
          step={1}
        />
      </Box>
    </Box>
  );
};

export default InputAndOutputSettings;
