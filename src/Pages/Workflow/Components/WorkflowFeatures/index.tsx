import CommonStyles from "@/Components/CommonStyles";
import cachedKeys from "@/Constants/cachedKeys";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import { useAuth } from "@/Providers/AuthenticationProvider";
import { useSave } from "@/Stores/useStore";
import { NodeTypeWorkflow } from "@/Types/workflow";
import { CircularProgress, useTheme } from "@mui/material";
import { Play } from "lucide-react";
import { Fragment, memo, useState } from "react";
import { createPortal } from "react-dom";
import { useParams } from "react-router-dom";
import WF_EditDrawer from "../CustomNodes/WF_EditDrawer";

interface WorkflowFeatureProps {
  conversationId: string;
}

const WorkflowFeature = ({ conversationId }: WorkflowFeatureProps) => {
  const [loading, setLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const theme = useTheme();
  const save = useSave();
  const { handleCheckWorkflowValid } = useWorkflowMutate();
  const { userId } = useAuth();
  const { workflowId } = useParams<{ workflowId: string }>();

  if (!userId || !workflowId) return null;

  const handleRunWorkflow = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading) return;
    e.preventDefault();
    setLoading(true);
    const response = await handleCheckWorkflowValid.mutateAsync({
      user_id: userId,
      workflow_id: workflowId,
    });

    const isValid = response?.status_code === 200;

    if (!isValid) {
      setLoading(false);
      return;
    } else {
      setOpenDrawer(true);
      setTimeout(() => {
        save(cachedKeys.NODE_EDITING, {
          type: NodeTypeWorkflow.RUNTIME_WORKFLOW,
          id: conversationId,
        });
      }, 0);
    }

    setLoading(false);
  };

  return (
    <Fragment>
      {openDrawer &&
        createPortal(
          <WF_EditDrawer conversationId={conversationId} />,
          document.body
        )}

      <div
        className="fixed px-1 py-0.5 top-3 right-3 rounded-lg"
        style={{
          background: theme.colors.custom.backgroundCard,
          border: `1px solid ${theme.colors.custom.borderColor}`,
        }}
      >
        <CommonStyles.Button
          className="items-center gap-2"
          onClick={handleRunWorkflow}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={16} />
          ) : (
            <Play size={16} className="translate-y-[1px]" />
          )}
          <CommonStyles.Typography type="semiBold16">
            {loading ? "Running..." : "Run"}
          </CommonStyles.Typography>
        </CommonStyles.Button>
      </div>
    </Fragment>
  );
};

export default memo(WorkflowFeature);
