import { Box, useTheme } from "@mui/material";
import { Code, FilePenLine, Plus, X } from "lucide-react";
import EditLabelNode from "@/Components/CommonStyles/EditLabelNode";
import CommonStyles from "@/Components/CommonStyles";
import DescriptionInput from "../../../DescriptionInput";
import { NodeProps } from "@xyflow/react";
import { useParams } from "react-router-dom";
import { useSave } from "@/Stores/useStore";
import cachedKeys from "@/Constants/cachedKeys";
import { Form, Formik } from "formik";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import { CodeNodeCode, CodeNodeData, CodeNodeInput, CodeNodeLanguage, CodeNodeOutput, OutputDataType, ParamType } from "../type";
import { useMemo, useState } from "react";
import Hint from "@/Pages/ChatbotConfigure/components/GenerateDiversity/components/Hint";
import Editor from "./Editor";
import InputRow from "./InputRow";

interface CodeNodeDrawerProps {
    node?: NodeProps;
}

const CodeNodeDrawer = ({ node }: CodeNodeDrawerProps) => {
    const theme = useTheme();
    const { workflowId } = useParams();
    const save = useSave();

    if (!node) return null;

    const { data, id } = node;
    const nodeData = node?.data as unknown as CodeNodeData;

    const initialValues = useMemo(() => {
        const input: CodeNodeInput[] = [
            {
                paramName: "input",
                paramType: ParamType.INPUT,
            }
        ];
        const code : CodeNodeCode= {
            language: CodeNodeLanguage.JS,
            code: `async function main({ params }: Args): Promise<Output> {
                        const ret = {
                            "key0": params.input + params.input,
                            "key1": ["hello", "world"],
                            "key2": {
                                "key21": "hi"
                            },
                        };`
        };

        const outputX: CodeNodeOutput = 
            {
                varName: "key21",
                varDataType: OutputDataType.STRING
            }
        ;

        const output: CodeNodeOutput[] = [
            {
                varName: "key0",
                varDataType: OutputDataType.STRING
            },
            {
                varName: "key1",
                varDataType: OutputDataType.ARRAY_STRING
            },
            {
                varName: "key2",
                varDataType: outputX
            }
        ];

        return {
            input: nodeData?.input ?? input,
            code: nodeData?.code ?? code,
            output: nodeData?.output ?? output
        };
    }, [nodeData]);

    const handleAddInput = () => {
      console.log("handle add input")
    }

    const handleUpdate = () => {
        console.log("handle update")
    }

    return (
        <div
          className="py-4"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="flex flex-col  sticky top-0 px-6 py-4 z-50 backdrop-blur-3xl">
            <div className="flex justify-between">
              <div className="flex items-center gap-2 ">
                <div
                  className="w-6 h-6 flex items-center justify-center rounded-md"
                  style={{
                    background: theme.palette.primary.main,
                  }}
                >
                  <Code className="w-3.5 h-3.5" color="#fff" />
                </div>
                <EditLabelNode nodeId={node.id} workflowId={workflowId} />
              </div>
    
              <CommonStyles.Button
                isIcon
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                }}
                onClick={() => {
                    save(cachedKeys.NODE_EDITING, null);
                }}
              >
                <X size={24} />
              </CommonStyles.Button>
            </div>
            <DescriptionInput value={nodeData.desc} handleUpdate={handleUpdate} />
          </div>

          <div className="px-6">
            <Formik
            initialValues={initialValues}
            enableReinitialize
            onSubmit={() => {}}
            >
                {() => 
                {return(
                    <Form>  
                        {/* input */}
                        <div style={{background: "#2e2d380a", borderRadius: "8px", marginBottom: "12px"}}>
                            <CollapseArea
                            nodeId={id}
                            initOpen={true}
                            label={
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: "8px",
                                  alignItems: "center",
                                }}
                              >
                                <CommonStyles.Typography type="semiBold14">
                                  Input
                                </CommonStyles.Typography>
                                <Hint content="Enter the variable that needs to be added to the code, the code can directly reference the variable added here" />
                              </Box>
                            }
                            >
                                <div className="flex items-center ml-4"
                                style={{fontSize: "12px", color: "#1c1d2359"}}>
                                  <div className="w-40">Parameter name</div>
                                  <div className="w-40 pl-2">Parameter value</div>
                                </div>

                                {initialValues.input.map((input)=>(
                                  <InputRow
                                  paramName={input.paramName}
                                  paramType={input.paramType}
                                  value={input.value}
                                />
                                ))}

                                <CommonStyles.Button
                                  variant="contained"
                                  sx={{
                                    marginTop: "1rem",
                                    marginLeft: "1rem",
                                    marginBottom: "0.5rem",
                                    width: "6rem",
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();

                                    handleAddInput();
                                  }}
                                >
                                  <Plus size={24} />
                                  Add
                                </CommonStyles.Button>
                            </CollapseArea>
                        </div>
                        {/* code */}
                        <div style={{background: "#2e2d380a", borderRadius: "8px", marginBottom: "12px"}}>
                            <CollapseArea
                            nodeId={id}
                            initOpen={true}
                            label={
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: "8px",
                                  alignItems: "center",
                                }}
                              >
                                <div className="flex justify-between items-center w-full pr-4">
                                  <div className="flex items-center">
                                    <CommonStyles.Typography type="semiBold14">
                                      Code
                                    </CommonStyles.Typography>
                                    <Hint content="Write the structure of a function referring to the code example, where you can directly use the variables in the input parameters, and output the processing result by returning an object. This feature does not support writing multiple functions. Even if there is only one output value, make sure to return it as an object" />
                                  </div>

                                  <div>
                                    <CommonStyles.Button variant="contained">
                                      <FilePenLine className="pr-2"/>
                                      Edit in IDE
                                    </CommonStyles.Button>
                                  </div>
                                </div>
                              </Box>
                            }
                            >
                                <Editor></Editor>
                            </CollapseArea>
                        </div>
                        {/* output */}
                        <div style={{background: "#2e2d380a", borderRadius: "8px"}}>
                            <CollapseArea
                            nodeId={id}
                            initOpen={true}
                            label={
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: "8px",
                                  alignItems: "center",
                                }}
                              >
                                <CommonStyles.Typography type="semiBold14">
                                  Output
                                </CommonStyles.Typography>
                                <Hint content="The variables output after the code runs must ensure that the variable names and variable types defined here are completely consistent with those in the code's return" />
                              </Box>
                            }
                            >
                                <div className="flex items-center ml-4"
                                style={{fontSize: "12px", color: "#1c1d2359"}}>
                                  <div style={{flex: "1 1"}}>Variable name</div>
                                  <div className="w-40">Variable type</div>
                                </div>

                                <CommonStyles.Button
                                  variant="contained"
                                  sx={{
                                    marginTop: "1rem",
                                    marginLeft: "1rem",
                                    marginBottom: "0.5rem",
                                    width: "6rem",
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();

                                    // handleAddPrompt();
                                  }}
                                >
                                  <Plus size={24} />
                                  Add
                                </CommonStyles.Button>
                            </CollapseArea>
                        </div>
                    </Form>
                );}}
            </Formik>
          </div>
        </div>
      );
}

export default CodeNodeDrawer;