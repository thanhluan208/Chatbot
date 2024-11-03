import React, { Fragment, useMemo } from "react";
import { Handle, NodeProps, Position, useReactFlow } from "@xyflow/react";
import { Box, useTheme } from "@mui/material";
import { v4 as uuid } from "uuid";
import { House } from "lucide-react";
import EditLabelNode from "@/Components/CommonStyles/EditLabelNode";
import InputArea from "./components/InputArea";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import GradientBorder from "../../GradientBorder";
import { NodeData, Variable } from "@/Types/workflow";
import { useAuth } from "@/Providers/AuthenticationProvider";
import { useParams } from "react-router-dom";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import { toast } from "react-toastify";

const WF_StartNode = (props: NodeProps) => {
  //! State
  const theme = useTheme();
  const data = props?.data as unknown as NodeData;
  const { userId } = useAuth();
  const { workflowId } = useParams();
  const { updateNode } = useReactFlow();

  const { handleUpdateNodeData } = useWorkflowMutate();

  const handleid = useMemo(() => {
    return uuid();
  }, []);

  const handleRename = async (name: string) => {
    const payload = {
      user_id: userId,
      workflow_id: workflowId,
      node_id: props.id,
      node_data: {
        name: name,
        desc: "",
        position: JSON.stringify({
          x: props.positionAbsoluteX,
          y: props.positionAbsoluteY,
        }),
        variables: props?.data.variables,
      },
    };

    const response = await handleUpdateNodeData.mutateAsync(payload);
    if (response?.status_code === 200) {
      updateNode(props.id, {
        data: {
          ...props?.data,
          label: name,
        },
      });
    } else {
      toast.error(response?.message);
    }
  };

  //! Function

  //! Render
  return (
    <Fragment>
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
                <House className="w-3.5 h-3.5" color="#fff" />
              </Box>
              <EditLabelNode
                data={props.data}
                nodeId={props.id}
                positionAbsoluteX={props.positionAbsoluteX}
                positionAbsoluteY={props.positionAbsoluteY}
                handleUpdateName={handleRename}
              />
            </Box>
          }
        >
          <InputArea
            nodeId={props.id}
            variables={data?.variables as Variable[]}
          />
        </CollapseArea>
      </GradientBorder>
      <Handle
        type="source"
        position={Position.Right}
        id={handleid}
        isConnectable={true}
        className="handle"
        style={{
          right: "3px",
        }}
      />
    </Fragment>
  );
};

export default React.memo(WF_StartNode);
