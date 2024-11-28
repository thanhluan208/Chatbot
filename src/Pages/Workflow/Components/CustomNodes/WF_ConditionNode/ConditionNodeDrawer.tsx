import CommonStyles from "@/Components/CommonStyles";
import EditLabelNode from "@/Components/CommonStyles/EditLabelNode";
import { useTheme } from "@mui/material";
import { NodeProps } from "@xyflow/react";
import { TrendingUpDown, X } from "lucide-react";
import { useParams } from "react-router-dom";
import cachedKeys from "@/Constants/cachedKeys";
import { useSave } from "@/Stores/useStore";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import DescriptionInput from "../../DescriptionInput";
import ListCase from "./components/ListCase";
import { ConditionNodeData } from "./type";

interface ConditionNodeDrawerProps {
  node?: NodeProps;
}
const ConditionNodeDrawer = ({ node }: ConditionNodeDrawerProps) => {
  const theme = useTheme();
  const { workflowId } = useParams();
  const save = useSave();
  const { handleUpdateNodeDataCondition } = useWorkflowMutate();
  if (!node) return null;

  const nodeData = node?.data as unknown as ConditionNodeData;

  const handleUpdate = (payload: Partial<ConditionNodeData>) => {
    handleUpdateNodeDataCondition(node?.id, payload);
  };

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
              <TrendingUpDown className="w-3.5 h-3.5" color="#fff" />
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
      </div>

      <div className="px-6">
        <DescriptionInput value={nodeData.desc} handleUpdate={handleUpdate} />

        <ListCase cases={nodeData?.cases} nodeId={node?.id} />
      </div>
    </div>
  );
};

export default ConditionNodeDrawer;
