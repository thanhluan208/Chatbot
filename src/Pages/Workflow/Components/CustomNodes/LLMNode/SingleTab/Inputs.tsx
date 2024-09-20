import { Box } from "@mui/material";
import { Fragment, memo } from "react";
import CommonIcons from "../../../../../../Components/CommonIcons";
import CommonStyles from "../../../../../../Components/CommonStyles";
import CollapseArea from "../../../../../../Components/CommonStyles/CollapseArea";
import { FastField, FieldArray, useFormikContext } from "formik";
import CommonField from "../../../../../../Components/CommonFields";
import { v4 as uuid } from "uuid";
import { isArray } from "lodash";
import { LLMSingleTabInitialValue } from "../SingleTab";

export const VariableTypeOptions = [
  {
    value: "string",
    label: "String",
  },
  {
    value: "reference",
    label: "Reference",
  },
];

const Inputs = () => {
  //! State
  const { values } = useFormikContext<LLMSingleTabInitialValue>();
  //! Function

  //! Render
  return (
    <CollapseArea label="Inputs">
      <FieldArray
        name="inputs"
        render={({ push }) => {
          return (
            <Fragment>
              <Box
                sx={{
                  display: "grid",
                  padding: "10px 20px 0",
                  gridTemplateColumns: "25% 20% 40% 10%",
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
              {isArray(values.inputs) &&
                values.inputs.map((input, index: number) => {
                  return (
                    <Box
                      key={input.id}
                      sx={{
                        display: "grid",
                        padding: "10px 20px",
                        gridTemplateColumns: "25% 20% 45% 10%",
                        alignItems: "center",
                        columnGap: "8px",
                      }}
                    >
                      <FastField
                        name={`inputs.${index}.variableName`}
                        component={CommonField.InputField}
                        placeholder="Enter variable name"
                        fullWidth
                      />
                      <FastField
                        name={`inputs.${index}.variableType`}
                        component={CommonField.MuiSelectField}
                        placeholder="Enter variable name"
                        options={VariableTypeOptions}
                        className="nodrag"
                        fullWidth
                      />
                      <FastField
                        name={`inputs.${index}.description`}
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

export default memo(Inputs);
