import { Box, Collapse } from "@mui/material";
import { FastField, FieldArray, Formik } from "formik";
import { useMemo, useState } from "react";
import CommonStyles from "../../../../../Components/CommonStyles";
import CommonIcons from "../../../../../Components/CommonIcons";
import { v4 as uuid } from "uuid";
import CommonField from "../../../../../Components/CommonFields";

const InputArea = () => {
  //! State
  const [open, setOpen] = useState(true);
  const initialValues = useMemo(() => {
    return {
      inputs: [
        {
          id: uuid(),
          variableName: "",
          variableType: "",
          description: "",
          isRequired: false,
        },
      ],
    };
  }, []);

  //! Function

  //! Render
  return (
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      {({ values }) => {
        return (
          <FieldArray
            name="inputs"
            render={({ push }) => {
              return (
                <Box
                  sx={{
                    padding: "8px",
                    background: "#f9f9f9",
                    marginTop: "20px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: "8px",
                      cursor: "pointer",
                      alignItems: "center",
                    }}
                  >
                    <CommonStyles.Button
                      isIcon
                      onClick={() => setOpen((prev) => !prev)}
                    >
                      <CommonIcons.ExpandMore
                        sx={{
                          transform: !open ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                        }}
                      />
                    </CommonStyles.Button>
                    <CommonStyles.Typography type="bold14">
                      Inputs
                    </CommonStyles.Typography>
                  </Box>
                  <Collapse in={open}>
                    <Box
                      sx={{
                        display: "grid",
                        padding: "10px 20px 0",
                        gridTemplateColumns: "3fr 2.5fr 5.5fr 1fr .5fr",
                        alignItems: "center",
                        columnGap: "8px",
                      }}
                    >
                      <CommonStyles.Typography
                        type="normal12"
                        color={"#bbbbbb"}
                      >
                        Variable name
                      </CommonStyles.Typography>
                      <CommonStyles.Typography
                        type="normal12"
                        color={"#bbbbbb"}
                      >
                        Variable type
                      </CommonStyles.Typography>
                      <CommonStyles.Typography
                        type="normal12"
                        color={"#bbbbbb"}
                      >
                        Description
                      </CommonStyles.Typography>
                      <CommonStyles.Typography
                        type="normal12"
                        color={"#bbbbbb"}
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        Required
                      </CommonStyles.Typography>
                    </Box>
                    {values.inputs.map((input, index) => {
                      return (
                        <Box
                          key={input.id}
                          sx={{
                            display: "grid",
                            padding: "10px 20px",
                            gridTemplateColumns: "3fr 2.5fr 5.5fr 1fr .5fr",
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
                            component={CommonField.InputField}
                            placeholder="Enter variable name"
                          />
                          <FastField
                            name={`inputs.${index}.description`}
                            component={CommonField.InputField}
                            placeholder="Please descripe the purpose of this variable"
                            fullWidth
                          />
                          <FastField
                            name={`inputs.${index}.required`}
                            component={CommonField.CheckBoxField}
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
                          isRequired: false,
                        });
                      }}
                    >
                      Add
                    </CommonStyles.Button>
                  </Collapse>
                </Box>
              );
            }}
          />
        );
      }}
    </Formik>
  );
};

export default InputArea;
