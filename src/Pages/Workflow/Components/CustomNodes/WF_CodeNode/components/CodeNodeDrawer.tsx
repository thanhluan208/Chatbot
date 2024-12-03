import { NodeProps } from "@xyflow/react";
import { Box, useTheme } from "@mui/material";
import { Code, X } from "lucide-react";
import EditLabelNode from "@/Components/CommonStyles/EditLabelNode";
import CommonStyles from "@/Components/CommonStyles";
import { useParams } from "react-router-dom";
import cachedKeys from "@/Constants/cachedKeys";
import { useSave } from "@/Stores/useStore";
import DescriptionInput from "../../../DescriptionInput";
import VarOutList from "../../../misc/VarOutList";
import { CodeLanguage, CodeNodeData, Variable } from "../type";
import { useAuth } from "@/Providers/AuthenticationProvider";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import Editor from "./Editor";
import InputSection from "./InputSection";
import OutputSection from "./OutputSection";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import Hint from "@/Pages/ChatbotConfigure/components/GenerateDiversity/components/Hint";
import { useMemo } from "react";


interface CodeNodeDrawerProps {
    node?: NodeProps;
}

const demo = [
    {value: "d1", label: "d1", group: "D"},
    {value: "d2", label: "d2"},
    {value: "d3", label: "d3"},
    {value: "c1", label: "c1", group: "C"},
    {value: "c2", label: "c2"},
    {value: "c3", label: "c3"},
];

const CodeNodeDrawer = ({ node }: CodeNodeDrawerProps) => {
    const theme = useTheme();
    const { workflowId } = useParams();
    const save = useSave();
    const { userId } = useAuth();
    const { handleUpdateCodeNodeData } = useWorkflowMutate();

    const codeLanguageOptions = useMemo(() => {
        return Object.entries(CodeLanguage).map(([key, value]) => {
            return {
                value: value,
                label: key,
            };
        });
    }, []);

    if (!node) return null;
    const { id } = node;
    const nodeData = node?.data as unknown as CodeNodeData;

    const handleUpdate = (payload: Partial<CodeNodeData>) => {
        handleUpdateCodeNodeData(node?.id, payload);
    };

    function handleCodeLanguageChange(value: string) {
        if (value === nodeData.code_language) return;

        handleUpdate({
            code_language: value
        });
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

            <div className="px-3">
                <div>
                    <InputSection
                        nodeId={id}
                        variables={nodeData.variables}
                        handleUpdateNodeData={handleUpdateCodeNodeData}
                    />
                </div>

                <div style={{ background: "#2e2d380a", borderRadius: "8px", marginBottom: "12px" }}>
                    <CollapseArea
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
                                    Code
                                </CommonStyles.Typography>
                                <Hint content="Write the structure of a function referring to the code example, where you can directly use the variables in the input parameters, and output the processing result by returning an object. This feature does not support writing multiple functions. Even if there is only one output value, make sure to return it as an object" />
                            </Box>
                        }
                    >

                        <CommonStyles.Select
                            handleChange={handleCodeLanguageChange}
                            value={nodeData.code_language}
                            options={codeLanguageOptions}
                            sx={{
                                marginLeft: "0.5rem",
                                marginBottom: "0.3rem",
                                width: "8rem",
                                fontSize: "15px"
                            }}
                        />

                        <Editor
                            nodeId={id}
                            language={nodeData.code_language}
                            value={nodeData.code}
                            handleUpdateNodeData={handleUpdateCodeNodeData}
                        />
                    </CollapseArea>
                </div>

                <div>
                    <OutputSection
                        nodeId={id}
                        outputs={nodeData.outputs}
                        handleUpdateNodeData={handleUpdateCodeNodeData}
                    />
                </div>

                <div className="px-3">
                    <VarOutList nodeData={nodeData} />
                </div>
            </div>
        </div>
    );
}

export default CodeNodeDrawer;