import { Box, useTheme } from "@mui/material";
import { Code, FilePenLine, X } from "lucide-react";
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
import InputSection from "./InputSection";
import OutputSection from "./OutputSection";

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
                          "key1": ["hello", "world"]
                      };`
      };

      const output: CodeNodeOutput[] = [
          {
              varName: "key0",
              varDataType: OutputDataType.STRING
          },
          {
              varName: "key1",
              varDataType: OutputDataType.ARRAY_STRING
          }
      ];

      return {
          input: nodeData?.input ?? input,
          code: nodeData?.code ?? code,
          output: nodeData?.output ?? output
      };
    }, [nodeData]);

    const [nodeDataInput, setNodeDataInput] = useState(nodeData?.input || initialValues.input);
    const [nodeDataCode, setNodeDataCode] = useState(nodeData?.code || initialValues.code);
    const [nodeDataOutput, setNodeDataOutput] = useState(nodeData?.output || initialValues.output);

    const handleAddInput = () => {
      setNodeDataInput(prevInput => [...prevInput, {paramName: "", paramType: ParamType.INPUT,}]);
   };

    const handleInputChange = (index: number, value: CodeNodeInput) => {
      setNodeDataInput(prevInput => 
        prevInput.map((input, i) => 
            i === index ? value : input
        )
      );
    }

    const handleDeleteInput = (index: number) => {
      setNodeDataInput(prevInput => prevInput.filter((_, i) => i !== index));
    }

    const handleAddOutput = () => {
      setNodeDataOutput(prevOutput => [...prevOutput, {varName: "", varDataType: OutputDataType.STRING}]);
   };

    const handleDeleteOutput = (index: number) => {

    }

    const handleDataTypeChange = (value: string, index: number) => {
      const updatedDataOutput = [...nodeDataOutput];
      updatedDataOutput[index].varDataType = value;
      setNodeDataOutput(updatedDataOutput);
    };

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
                        <InputSection
                          inputs={nodeDataInput}
                          handleAddInput={handleAddInput}
                          handleDeleteInput={handleDeleteInput}
                          handleInputChange={handleInputChange}
                        />
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
                        <OutputSection
                          outputs={nodeDataOutput}
                        />
                    </Form>
                );}}
            </Formik>
          </div>
        </div>
      );
}

export default CodeNodeDrawer;