import React, { Fragment, useMemo } from "react";
import { Handle, NodeProps, Position } from "@xyflow/react";
import { Box, useTheme } from "@mui/material";
import { Code } from "lucide-react";
import EditLabelNode from "@/Components/CommonStyles/EditLabelNode";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import GradientBorder from "../../GradientBorder";
import WF_EditDrawer from "../WF_EditDrawer";
import { createPortal } from "react-dom";
import { useSave } from "@/Stores/useStore";
import cachedKeys from "@/Constants/cachedKeys";
import { NodeTypeWorkflow } from "@/Types/workflow";
import Editor from "./components/Editor";
import VarOutList from "../../misc/VarOutList";
import { NodeDataCode } from "./type";

const WF_CodeNode = (props: NodeProps) => {
  //! State
  const theme = useTheme();
  const save = useSave();
  const { data, id,  } = props;

  const handleid = useMemo(() => {
    // return uuid();
  }, []);

  const nodeData = props.data as unknown as NodeDataCode;

  //! Function
  const handleClickNode = () => {
    save(cachedKeys.NODE_EDITING, {
      type: NodeTypeWorkflow.CODE,
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
                <Code className="w-3.5 h-3.5" color="#fff" />
              </Box>
              <EditLabelNode nodeId={props.id} />
            </Box>
          }
        >
          <div className="px-2">
            <Editor />
          </div>

          <VarOutList nodeData={nodeData} />
        </CollapseArea>
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

export default React.memo(WF_CodeNode);
