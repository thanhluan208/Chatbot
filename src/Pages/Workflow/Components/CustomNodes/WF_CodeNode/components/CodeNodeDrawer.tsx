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
import { CodeNodeData } from "../type";
import { toast } from "react-toastify";
import { useAuth } from "@/Providers/AuthenticationProvider";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import Editor from "./Editor";


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

    const handleUpdate = (
        payload: Partial<CodeNodeData>,
        onSuccess?: () => void,
        onFailed?: () => void
      ) => {
        if (!workflowId || !userId) return;

        const updatePayload = {
            name: id,
            desc: nodeData.desc,
            position: nodeData.position,
            ...payload,
            variables: nodeData.variables,
            code_language: nodeData.code_language,
            code: nodeData.code,
            outputs: nodeData.outputs 
        };

        handleUpdateNodeData.mutate(
            {
                workflow_id: workflowId,
                user_id: userId,
                node_id: id,
                node_data: updatePayload,
            },
            {
                onSuccess: (response) => {
                if (response?.status_code !== 200) {
                    toast.error(response?.message);
                    onFailed && onFailed();
                }
                updateNode(id, {
                    data: {
                    ...data,
                    ...updatePayload,
                    },
                });
                onSuccess && onSuccess();
                },
                onError: () => {
                onFailed && onFailed();
                },
            }
        );  
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
                    Input
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