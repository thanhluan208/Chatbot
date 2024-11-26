import React, { Fragment } from "react";
import { Handle, NodeProps, Position, useReactFlow } from "@xyflow/react";
import GradientBorder from "../../GradientBorder";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import { Form, Formik } from "formik";
import { Box, useTheme } from "@mui/material";
import EditLabelNode from "@/Components/CommonStyles/EditLabelNode";
import { MessageSquareQuote } from "lucide-react";
import CommonStyles from "@/Components/CommonStyles";
import Hint from "@/Pages/ChatbotConfigure/components/GenerateDiversity/components/Hint";
import WindowSizeControl from "./components/WindowSizeControl";
import { useParams } from "react-router-dom";
import { useAuth } from "@/Providers/AuthenticationProvider";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import { toast } from "react-toastify";
import VarOutList from "../../misc/VarOutList";
import { NodeDataLongTermMemory } from "./type";

const WF_LtmNode = (props: NodeProps) => {
  //! State
  const { id } = props;
  const theme = useTheme();
  const { userId } = useAuth();
  const { workflowId } = useParams();
  const { updateNode } = useReactFlow();

  const { handleUpdateNodeData } = useWorkflowMutate();

  const nodeData = props?.data as unknown as NodeDataLongTermMemory;

  const handleUpdateHistoryTurn = async (history_turn: number) => {
    const payload = {
      user_id: userId,
      workflow_id: workflowId,
      node_id: props.id,
      node_data: {
        desc: "",
        position: JSON.stringify({
          x: props.positionAbsoluteX,
          y: props.positionAbsoluteY,
        }),
        history_turn: history_turn,
      },
    };

    doRequest(payload);
  };

  const doRequest = async (payload: any) => {
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

  //!Render
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
                <MessageSquareQuote className="w-3.5 h-3.5" color="#fff" />
              </Box>
              <EditLabelNode nodeId={id} workflowId={workflowId} />
            </Box>
          }
        >
          <Formik initialValues={{}} onSubmit={() => {}}>
            {() => {
              return (
                <Form>
                  {/* description */}

                  <CollapseArea
                    nodeId="{id}"
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          gap: "8px",
                          alignItems: "center",
                        }}
                      >
                        <CommonStyles.Typography type="semiBold14">
                          Memory
                        </CommonStyles.Typography>
                        <Hint content="Chat memory settings" />
                      </Box>
                    }
                  >
                    <WindowSizeControl
                      min={0}
                      max={100}
                      handleUpdate={handleUpdateHistoryTurn}
                    ></WindowSizeControl>
                  </CollapseArea>

                  <VarOutList nodeData={nodeData} />
                </Form>
              );
            }}
          </Formik>
        </CollapseArea>
      </GradientBorder>

      <Handle
        type="target"
        position={Position.Left}
        id={`${id}-target`}
        isConnectable={true}
        className="handle"
        style={{
          left: "3px",
        }}
      />

      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-source`}
        isConnectable={true}
        className="handle"
        style={{
          right: "3px",
        }}
      />
    </Fragment>
  );
};

export default React.memo(WF_LtmNode);
