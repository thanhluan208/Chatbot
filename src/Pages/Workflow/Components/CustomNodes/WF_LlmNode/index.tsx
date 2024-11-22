import React, { Fragment, useCallback, useMemo } from "react";
import { Handle, NodeProps, Position } from "@xyflow/react";
import { Box, useTheme } from "@mui/material";
import { Component } from "lucide-react";
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
import ModelConfiguration from "./ModelConfiguration";
import { Form, Formik } from "formik";
import { LlmNodeData } from "./type";
import { modelOptions } from "@/Constants/options";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import ModelStatsConfig from "./ModelStatsConfig";

const WF_StartNode = (props: NodeProps) => {
  //! State
  const { data, id } = props;
  const theme = useTheme();
  const { workflowId } = useParams();
  const save = useSave();

  const { handleUpdateNodeDataLLM } = useWorkflowMutate();

  const nodeData = data as unknown as LlmNodeData;

  const initialValues = useMemo(() => {
    const foundModel = modelOptions.find((elm) => {
      return elm.value === nodeData?.model?.name;
    });
    return {
      ...nodeData.model,
      nodeId: id,
      nodeData,
      model: foundModel ?? modelOptions[0],
      temperature: nodeData?.model?.completion_params?.temperature ?? 1.21,
      top_p: nodeData?.model?.completion_params?.top_p ?? 0.9,
      history_turn: nodeData?.model?.completion_params?.history_turn ?? 3,
      max_tokens: nodeData?.model?.completion_params?.max_tokens ?? 2048,
      frequency_penalty:
        nodeData?.model?.completion_params?.frequency_penalty ?? 0,
      presence_penalty:
        nodeData?.model?.completion_params?.presence_penalty ?? 0,
      memory_history_turn: nodeData?.memory?.history_turn ?? 3,
    };
  }, [nodeData]);

  //! Function

  const handleClickNode = () => {
    save(cachedKeys.NODE_EDITING, {
      type: NodeTypeWorkflow.LLM,
      id: id,
    });
  };

  const handleChangeModel = useCallback(
    (value: string) => {
      const modelFound = modelOptions.find((elm) => elm.value === value);
      if (!modelFound) return;
      const payload: Partial<LlmNodeData> = {
        model: {
          ...nodeData?.model,
          name: modelFound.value,
          completion_params: {
            temperature: Number(modelFound.temperature.default),
            top_p: Number(modelFound.top_p?.default),
            history_turn: Number(modelFound.history_turn?.default),
            max_tokens: Number(modelFound.max_tokens?.default),
            frequency_penalty: Number(modelFound.frequency_penalty?.default),
            presence_penalty: Number(modelFound.presence_penalty?.default),
          },
        },
      };

      handleUpdateNodeDataLLM(id, nodeData, payload);
    },
    [nodeData?.model]
  );

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
                  <Component className="w-3.5 h-3.5" color="#fff" />
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
            <Formik
              initialValues={initialValues}
              enableReinitialize
              onSubmit={() => {}}
            >
              {() => {
                return (
                  <Form className="px-3">
                    <div className="flex gap-2 items-center">
                      <ModelConfiguration afterOnChange={handleChangeModel} />
                      <ModelStatsConfig />
                    </div>
                  </Form>
                );
              }}
            </Formik>
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

export default React.memo(WF_StartNode);
