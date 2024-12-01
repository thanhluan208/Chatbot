import { NodeProps, useReactFlow } from "@xyflow/react";
import { useTheme } from "@mui/material";
import { Code, X } from "lucide-react";
import EditLabelNode from "@/Components/CommonStyles/EditLabelNode";
import CommonStyles from "@/Components/CommonStyles";
import { useParams } from "react-router-dom";
import cachedKeys from "@/Constants/cachedKeys";
import { useSave } from "@/Stores/useStore";
import DescriptionInput from "../../../DescriptionInput";
import VarOutList from "../../../misc/VarOutList";
import { CodeNodeData, Variable } from "../type";
import { toast } from "react-toastify";
import { useAuth } from "@/Providers/AuthenticationProvider";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import Editor from "./Editor";
import InputSection from "./InputSection";


interface CodeNodeDrawerProps {
    node?: NodeProps;
}

const CodeNodeDrawer = ({ node }: CodeNodeDrawerProps) => {
    const theme = useTheme();
    const { workflowId } = useParams();
    const save = useSave();
    const { userId } = useAuth();
    const { updateNode } = useReactFlow();
    const { handleUpdateNodeData, handleUpdateCodeNodeData } = useWorkflowMutate();

    if (!node) return null;
    const { data, id } = node;
    const nodeData = node?.data as unknown as CodeNodeData;
    const nodeDataVars = nodeData.variables as Variable[];

    const handleUpdate = (payload: Partial<CodeNodeData>) => {
        handleUpdateCodeNodeData(node?.id, payload);
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
                        variables={nodeDataVars}
                        handleUpdateNodeData={handleUpdateCodeNodeData}
                    />
                </div>

                <div>
                    <Editor
                        nodeId={id}
                        language={nodeData.code_language}
                        value={nodeData.code}
                        handleUpdateNodeData={handleUpdateCodeNodeData}
                    />
                </div>

                <div>
                    Output
                </div>

                <div className="px-3">
                    <VarOutList nodeData={nodeData} />
                </div>
            </div>
        </div>
    );
}

export default CodeNodeDrawer;