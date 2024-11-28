import React, { Fragment, useMemo } from "react";
import { Handle, NodeProps, Position, useReactFlow } from "@xyflow/react";
import { Box, useTheme } from "@mui/material";
import { Code } from "lucide-react";
import EditLabelNode from "@/Components/CommonStyles/EditLabelNode";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import GradientBorder from "../../GradientBorder";
import Editor from "./components/Editor";
import VarOutList from "../../misc/VarOutList";
import { CodeNodeData } from "./type";
import { createPortal } from "react-dom";
import WF_EditDrawer from "../WF_EditDrawer";
import { useParams } from "react-router-dom";
import { useSave } from "@/Stores/useStore";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import cachedKeys from "@/Constants/cachedKeys";
import { NodeTypeWorkflow } from "@/Types/workflow";

const WF_CodeNode = (props: NodeProps) => {
  //! State
  const { data, id, selected } = props;
  const theme = useTheme();
  const { workflowId } = useParams();
  const save = useSave();
  const { updateNode } = useReactFlow();

  const { handleUpdateCodeNodeData } = useWorkflowMutate();

  const nodeData = props.data as unknown as CodeNodeData;

  //! Function
  const handleClickNode = () => {
    updateNode(id, {
      selected: true,
    });
    setTimeout(() => {
      save(cachedKeys.NODE_EDITING, {
        type: NodeTypeWorkflow.CODE,
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
                  <Code className="w-3.5 h-3.5" color="#fff" />
                </Box>
                <EditLabelNode nodeId={props.id} workflowId={workflowId} />
              </Box>
            }
          >
            {/* <div className="px-2">
              <Editor />
            </div> */}

            <VarOutList nodeData={nodeData} />
          </CollapseArea>
        </GradientBorder>
      </div>
      
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
      {selected && createPortal(<WF_EditDrawer node={props} />, document.body)}
    </Fragment>
  );
};

export default React.memo(WF_CodeNode);
