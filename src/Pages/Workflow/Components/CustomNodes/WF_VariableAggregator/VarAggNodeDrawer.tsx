import CommonStyles from "@/Components/CommonStyles";
import EditLabelNode from "@/Components/CommonStyles/EditLabelNode";
import { Switch, useTheme } from "@mui/material";
import { NodeProps } from "@xyflow/react";
import { Component, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import cachedKeys from "@/Constants/cachedKeys";
import { useSave } from "@/Stores/useStore";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import { NodeDataVarAgg } from "./type";
import DescriptionInput from "../../DescriptionInput";
import ListAssignVars from "./ListAssignVars";
import ListGroup from "./ListGroup";
import VarOutList from "../../misc/VarOutList";

interface VarAggNodeDrawerProps {
  node?: NodeProps;
}
const VarAggNodeDrawer = ({ node }: VarAggNodeDrawerProps) => {
  const theme = useTheme();
  const { workflowId } = useParams();
  const save = useSave();
  const { t } = useTranslation("node");
  const {} = useWorkflowMutate();

  const { handleUpdateNodeDataVarAgg } = useWorkflowMutate();

  if (!node) return null;

  const nodeData = node?.data as unknown as NodeDataVarAgg;

  const handleUpdate = (payload: Partial<NodeDataVarAgg>) => {
    handleUpdateNodeDataVarAgg(node?.id, payload);
  };

  const handleChangeGroupEnable = (_: any, checked: boolean) => {
    handleUpdateNodeDataVarAgg(node.id, {
      advanced_settings: {
        group_enabled: checked,
      },
    } as any);
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
              <Component className="w-3.5 h-3.5" color="#fff" />
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

      <div className="px-6 my-3">
        <div className="flex items-center space-x-2 mt-4">
          <label htmlFor="group_enable">
            <CommonStyles.Typography type="semiBold16">
              {t("WF_VarAgg.aggregation_group").toUpperCase()}
            </CommonStyles.Typography>
          </label>
          <Switch
            id="group_enable"
            sx={{ transform: "translateY(3px)" }}
            onChange={handleChangeGroupEnable}
            checked={nodeData?.advanced_settings?.group_enabled}
          />
        </div>
        <div>
          {nodeData?.advanced_settings?.group_enabled ? (
            <ListGroup
              nodeId={node?.id}
              groups={nodeData?.advanced_settings?.groups}
            />
          ) : (
            <ListAssignVars
              output_type={nodeData?.output_type}
              variables={nodeData?.variables}
              nodeId={node?.id}
            />
          )}
        </div>
      </div>
      <div className="px-3">
        <VarOutList nodeData={nodeData} />
      </div>
    </div>
  );
};

export default VarAggNodeDrawer;
