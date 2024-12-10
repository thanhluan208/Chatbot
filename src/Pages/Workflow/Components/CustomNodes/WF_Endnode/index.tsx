import CommonStyles from "@/Components/CommonStyles";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import EditLabelNode from "@/Components/CommonStyles/EditLabelNode";
import cachedKeys from "@/Constants/cachedKeys";
import { useSave } from "@/Stores/useStore";
import { NodeTypeWorkflow } from "@/Types/workflow";
import { Box, useTheme } from "@mui/material";
import { Handle, NodeProps, Position, useReactFlow } from "@xyflow/react";
import { isEmpty } from "lodash";
import { Goal } from "lucide-react";
import React, { Fragment } from "react";
import { createPortal } from "react-dom";
import { useParams } from "react-router-dom";
import GradientBorder from "../../GradientBorder";
import WF_EditDrawer from "../WF_EditDrawer";
import ListOutputVariable from "./ListOutputVariable";
import { NodeDataEnd } from "./type";

const WF_EndNode = (props: NodeProps) => {
  //! State
  const { id, selected } = props;
  const theme = useTheme();
  const { workflowId } = useParams();
  const save = useSave();
  const { updateNode } = useReactFlow();

  const nodeData = props.data as unknown as NodeDataEnd;

  //! Function

  const handleClickNode = () => {
    updateNode(id, {
      selected: true,
    });
    setTimeout(() => {
      save(cachedKeys.NODE_EDITING, {
        type: NodeTypeWorkflow.END,
        id: id,
      });
    }, 0);
  };

  //! Render
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
                    <Goal className="w-3.5 h-3.5" color="#fff" />
                  </Box>
                  <EditLabelNode nodeId={id} workflowId={workflowId} />
                </Box>
                {nodeData?.desc && (
                  <CommonStyles.Typography className="px-4 opacity-60 my-2">
                    {nodeData?.desc}
                  </CommonStyles.Typography>
                )}
              </div>
            }
          >
            {!isEmpty(nodeData?.outputs) && (
              <ListOutputVariable data={nodeData?.outputs} />
            )}
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

// eslint-disable-next-line react-refresh/only-export-components
export default React.memo(WF_EndNode);
