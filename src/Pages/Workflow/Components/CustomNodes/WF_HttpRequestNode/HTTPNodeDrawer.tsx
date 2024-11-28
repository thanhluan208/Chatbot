import CommonStyles from "@/Components/CommonStyles";
import EditLabelNode from "@/Components/CommonStyles/EditLabelNode";
import { useTheme } from "@mui/material";
import { NodeProps } from "@xyflow/react";
import { RadioTower, X } from "lucide-react";
import { useParams } from "react-router-dom";
import cachedKeys from "@/Constants/cachedKeys";
import { useSave } from "@/Stores/useStore";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import DescriptionInput from "../../DescriptionInput";
import VarOutList from "../../misc/VarOutList";
import { NodeDataHTTPRequest } from "./type";
import RequestConfig from "./RequestConfig";
import Authorization from "./Authorization";
import KeyAndValueList from "./KeyAndValueList";
import BodyConfig from "./BodyConfig";
import TimeoutConfig from "./TimeoutConfig";

interface AnswerNodeDrawerProps {
  node?: NodeProps;
}
const HTTPNodeDrawer = ({ node }: AnswerNodeDrawerProps) => {
  const theme = useTheme();
  const { workflowId } = useParams();
  const save = useSave();
  const {} = useWorkflowMutate();

  const { handleUpdateNodeDataAnswer } = useWorkflowMutate();

  if (!node) return null;

  const nodeData = node?.data as unknown as NodeDataHTTPRequest;

  const handleUpdate = (payload: Partial<NodeDataHTTPRequest>) => {
    handleUpdateNodeDataAnswer(node?.id, payload);
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
              <RadioTower className="w-3.5 h-3.5" color="#fff" />
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

      <div className="px-6 py-3">
        <RequestConfig nodeId={node?.id} />
      </div>
      <hr className="my-2 mx-4 opacity-20" />

      <div className="px-3">
        <Authorization nodeId={node?.id} />
      </div>

      <hr className="my-2 mx-4 opacity-20" />

      <div className="px-3">
        <KeyAndValueList nodeId={node?.id} mutateObjectKey="headers" />
      </div>

      <hr className="my-2 mx-4 opacity-20" />

      <div className="px-3">
        <KeyAndValueList nodeId={node?.id} mutateObjectKey="params" />
      </div>

      <hr className="my-2 mx-4 opacity-20" />

      <div className="px-3">
        <BodyConfig nodeId={node?.id} />
      </div>

      <hr className="my-2 mx-4 opacity-20" />

      <div className="px-3">
        <TimeoutConfig nodeId={node?.id} />
      </div>

      <hr className="my-2 mx-4 opacity-20" />

      <div className="px-3">
        <VarOutList nodeData={nodeData} />
      </div>
    </div>
  );
};

export default HTTPNodeDrawer;
