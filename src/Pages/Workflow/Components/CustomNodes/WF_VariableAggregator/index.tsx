import React, { Fragment, useMemo } from "react";
import { Handle, NodeProps, Position } from "@xyflow/react";
import { Box, useTheme } from "@mui/material";
import { Variable } from "lucide-react";
import EditLabelNode from "@/Components/CommonStyles/EditLabelNode";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import GradientBorder from "../../GradientBorder";
import { useParams } from "react-router-dom";
import { useSave } from "@/Stores/useStore";
import cachedKeys from "@/Constants/cachedKeys";
import { NodeTypeWorkflow } from "@/Types/workflow";
import WF_EditDrawer from "../WF_EditDrawer";
import { createPortal } from "react-dom";
import CommonStyles from "@/Components/CommonStyles";
import { NodeDataVarAgg } from "./type";
import NodeGroupItem from "./NodeGroupItem";

const WF_VariableAggregator = (props: NodeProps) => {
  //! State
  const { id } = props;
  const theme = useTheme();
  const { workflowId } = useParams();
  const save = useSave();

  const nodeData = props?.data as unknown as NodeDataVarAgg;

  const groupData = useMemo(() => {
    if (nodeData?.advanced_settings?.group_enabled) {
      return nodeData?.advanced_settings?.groups;
    } else {
      return [
        {
          group_name: "",
          output_type: nodeData?.output_type,
          variables: nodeData?.variables,
        },
      ];
    }
  }, [nodeData?.advanced_settings, nodeData?.output_type, nodeData?.variables]);

  //! Function

  const handleClickNode = () => {
    save(cachedKeys.NODE_EDITING, {
      type: NodeTypeWorkflow.VARIABLE_AGGREGATOR,
      id: id,
    });
  };

  //! Render
  return (
    <Fragment>
      <div onClick={handleClickNode}>
        <GradientBorder {...props}>
          <CollapseArea
            sxContainer={{ marginTop: 0 }}
            label={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Box
                  sx={{
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    background: theme.palette.primary.main,
                  }}
                >
                  <Variable className="w-3.5 h-3.5" color="#fff" />
                </Box>
                <EditLabelNode nodeId={id} workflowId={workflowId} />
              </Box>
            }
          >
            <NodeGroupItem data={groupData} />
          </CollapseArea>

          <div className="my-2 px-3 py-1 max-w-[500px]">
            <CommonStyles.Typography>
              {nodeData?.desc as string}
            </CommonStyles.Typography>
          </div>
        </GradientBorder>

        <Handle
          type="source"
          position={Position.Right}
          id={`${props?.id}-source`}
          isConnectable={true}
          className="handle"
          style={{
            right: "3px",
          }}
        />
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
      {createPortal(<WF_EditDrawer node={props} />, document.body)}
    </Fragment>
  );
};

export default React.memo(WF_VariableAggregator);
