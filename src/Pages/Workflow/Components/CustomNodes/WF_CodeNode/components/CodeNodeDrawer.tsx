import { useTheme } from "@mui/material";
import { Code, X } from "lucide-react";
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
import { useMemo } from "react";
import { modelOptions } from "@/Constants/options";

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
                        <div>
                            <CollapseArea
                            nodeId={id}
                            initOpen={true}
                            label="Input"
                            >
                                
                            </CollapseArea>
                        </div>
                        {/* code */}
                        <div>
                            <CollapseArea
                            nodeId={id}
                            initOpen={true}
                            label="Code"
                            >
                                
                            </CollapseArea>
                        </div>
                        {/* output */}
                        <div>
                            <CollapseArea
                            nodeId={id}
                            initOpen={true}
                            label="Output"
                            >
                                
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