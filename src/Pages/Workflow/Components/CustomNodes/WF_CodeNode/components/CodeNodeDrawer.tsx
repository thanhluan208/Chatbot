import { NodeProps } from "@xyflow/react";
import { useTheme } from "@mui/material";
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


interface CodeNodeDrawerProps {
    node?: NodeProps;
}

const CodeNodeDrawer = ({ node }: CodeNodeDrawerProps) => {
    const theme = useTheme();
    const { workflowId } = useParams();
    const save = useSave();
    const { userId } = useAuth();
    const { handleUpdateCodeNodeData } = useWorkflowMutate();

    if (!node) return null;
    const { id } = node;
    const nodeData = node?.data as unknown as CodeNodeData;

    const handleUpdate = (payload: Partial<CodeNodeData>) => {
        handleUpdateCodeNodeData(node?.id, payload);
    };

    function handleCodeLanguageChange(event: React.ChangeEvent<HTMLSelectElement>){
        handleUpdate({
            code_language: event.target.value
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

                <div>
                    <select 
                    value={nodeData.code_language}
                    onChange={handleCodeLanguageChange}>
                        {Object.values(CodeLanguage).map((language) => (
                            <option key={language} value={language}>
                                {language}
                            </option>
                        ))}
                    </select>

                    <Editor
                        nodeId={id}
                        language={nodeData.code_language}
                        value={nodeData.code}
                        handleUpdateNodeData={handleUpdateCodeNodeData}
                    />
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