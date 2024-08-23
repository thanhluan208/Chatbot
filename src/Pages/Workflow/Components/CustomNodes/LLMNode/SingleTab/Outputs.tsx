import { FastField, FieldArray, useFormikContext } from "formik";
import CollapseArea from "../../CollapseArea";
import { Fragment } from "react/jsx-runtime";
import { Box } from "@mui/material";
import CommonStyles from "../../../../../../Components/CommonStyles";
import { isArray } from "lodash";
import CommonField from "../../../../../../Components/CommonFields";
import CommonIcons from "../../../../../../Components/CommonIcons";
import { v4 as uuid } from "uuid";
import { memo } from "react";
import { VariableTypeOptions } from "./Inputs";
import { LLMSingleTabInitialValue } from "../SingleTab";


const Outputs = () => {
  //! State
  const { values } = useFormikContext<LLMSingleTabInitialValue>();

  //! Function

  //! Render
  return (
    <CollapseArea label="Onputs">
      <FieldArray
        name="outputs"
        render={({ push }) => {
          return (
            <Fragment>
              <Box
                sx={{
                  display: "grid",
                  padding: "10px 20px 0",
                  gridTemplateColumns: "25% 20% 45% 10%",
                  alignItems: "center",
                  columnGap: "8px",
                }}
              >
                <CommonStyles.Typography type="normal12" color={"#bbbbbb"}>
                  Variable name
                </CommonStyles.Typography>
                <CommonStyles.Typography type="normal12" color={"#bbbbbb"}>
                  Variable type
                </CommonStyles.Typography>
                <CommonStyles.Typography type="normal12" color={"#bbbbbb"}>
                  Description
                </CommonStyles.Typography>
              </Box>
              {isArray(values.outputs) &&
                values.outputs.map((output, index: number) => {
                  return (
                    <Box
                      key={output.id}
                      sx={{
                        display: "grid",
                        padding: "10px 20px",
                        gridTemplateColumns: "25% 20% 45% 10%",
                        alignItems: "center",
                        columnGap: "8px",
                      }}
                    >
                      <FastField
                        name={`outputs.${index}.variableName`}
                        component={CommonField.InputField}
                        placeholder="Enter variable name"
                        fullWidth
                      />
                      <FastField
                        name={`outputs.${index}.variableType`}
                        component={CommonField.MuiSelectField}
                        placeholder="Enter variable name"
                        options={VariableTypeOptions}
                        className="nodrag"
                        fullWidth
                      />
                      <FastField
                        name={`outputs.${index}.description`}
                        component={CommonField.InputField}
                        placeholder="Please descripe the purpose of this variable"
                        fullWidth
                      />
                      <CommonStyles.Button isIcon color="error">
                        <CommonIcons.Delete />
                      </CommonStyles.Button>
                    </Box>
                  );
                })}
              <CommonStyles.Button
                sx={{
                  marginLeft: "20px",
                }}
                variant="outlined"
                startIcon={<CommonIcons.Add />}
                onClick={() => {
                  push({
                    id: uuid(),
                    variableName: "",
                    variableType: "",
                    description: "",
                  });
                }}
              >
                Add
              </CommonStyles.Button>
            </Fragment>
          );
        }}
      />
    </CollapseArea>
  );
};

export default memo(Outputs);
