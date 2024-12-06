import toolConfig from "@/assets/tool.yaml";
import CommonStyles from "@/Components/CommonStyles";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import cachedKeys from "@/Constants/cachedKeys";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import { useSave } from "@/Stores/useStore";
import { NodeTypeWorkflow } from "@/Types/workflow";
import { Box } from "@mui/material";
import { Handle, NodeProps, Position, useReactFlow } from "@xyflow/react";
import React, { Fragment } from "react";
import { createPortal } from "react-dom";
import GradientBorder from "../../GradientBorder";
import VarOutList from "../../misc/VarOutList";
import WF_EditDrawer from "../WF_EditDrawer";
import { NodeDataTool } from "./type";
import { Skeleton } from "@/Components/ui/skeleton";

const WF_Tool = (props: NodeProps) => {
  //! State
  const { id, selected } = props;
  const save = useSave();
  const { updateNode } = useReactFlow();
  const {} = useWorkflowMutate();

  const nodeData = props.data as unknown as NodeDataTool;

  //! Function

  const handleClickNode = () => {
    updateNode(id, {
      selected: true,
    });
    setTimeout(() => {
      save(cachedKeys.NODE_EDITING, {
        type: NodeTypeWorkflow.TOOL,
        id: id,
      });
    }, 0);
  };

  //! Render
  if (nodeData?.isProcessing) {
    return (
      <GradientBorder {...props}>
        <div className="px-4 py-2">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 min-w-12 min-h-12 rounded-full" />
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[80%]" />
            </div>
          </div>
          <Skeleton className="h-[125px] w-full rounded-xl mt-2" />
        </div>
      </GradientBorder>
    );
  }

  return (
    <Fragment>
      <div onClick={handleClickNode}>
        <GradientBorder {...props}>
          <CollapseArea
            sxContainer={{ marginTop: 0 }}
            label={
              <div className="flex flex-col gap-2">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <img
                    src={toolConfig[nodeData?.provider_id]?.identity?.icon}
                    alt="icon"
                    className="rounded-lg w-6 h-6"
                  />
                  <CommonStyles.Typography
                    type="semiBold16"
                    sx={{
                      maxWidth: "200px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {nodeData?.tool_name}
                  </CommonStyles.Typography>
                </Box>
                {nodeData?.desc && (
                  <CommonStyles.Typography className="px-4 opacity-60 my-2">
                    {nodeData?.desc}
                  </CommonStyles.Typography>
                )}
              </div>
            }
          >
            <VarOutList nodeData={nodeData} />
          </CollapseArea>
        </GradientBorder>

        <Handle
          type="target"
          position={Position.Left}
          id={`${props?.id}-target`}
          isConnectable={true}
          className="handle"
          style={{
            left: "3px",
          }}
        />
      </div>
      {selected && createPortal(<WF_EditDrawer node={props} />, document.body)}
    </Fragment>
  );
};

export default React.memo(WF_Tool);
