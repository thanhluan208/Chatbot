import React, { Fragment } from "react";
import { Handle, NodeProps, Position, useReactFlow } from "@xyflow/react";
import { Box, Tooltip, useTheme } from "@mui/material";
import { Pickaxe } from "lucide-react";
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
import FormModel from "../../misc/FormModel";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import { useTranslation } from "react-i18next";
import { isEmpty } from "lodash";
import { NodeDataParamExtractor } from "./type";

const WF_ParamExtractor = (props: NodeProps) => {
  //! State
  const { id, selected } = props;
  const theme = useTheme();
  const { t } = useTranslation("node");
  const { workflowId } = useParams();
  const save = useSave();
  const { updateNode } = useReactFlow();
  const { handleUpdateNodeDataParamExtractor } = useWorkflowMutate();

  const nodeData = props.data as unknown as NodeDataParamExtractor;

  //! Function

  const handleClickNode = () => {
    updateNode(id, {
      selected: true,
    });
    setTimeout(() => {
      save(cachedKeys.NODE_EDITING, {
        type: NodeTypeWorkflow.PARAMETER_EXTRACTOR,
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
                    <Pickaxe className="w-3.5 h-3.5" color="#fff" />
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
            <FormModel
              handleUpdateNodeData={handleUpdateNodeDataParamExtractor}
              model={nodeData?.model}
              nodeId={id}
            />

            {!isEmpty(nodeData?.outputs) && (
              <div className="px-4 my-3 flex flex-col gap-3">
                <CommonStyles.Typography type="semiBold16">
                  {t("common.variable_out")}
                </CommonStyles.Typography>

                <div className="flex gap-2 max-w-[500px] flex-wrap px-3">
                  {Object.entries(nodeData?.outputs).map(([key, value]) => {
                    return (
                      <Tooltip title={value.desc} placement="top-start">
                        <div
                          key={key}
                          className="rounded-lg flex items-center overflow-hidden w-fit pr-3 gap-2"
                          style={{
                            border: `1px solid ${theme.colors.custom.borderColor}`,
                          }}
                        >
                          <div
                            className="px-3 py-3"
                            style={{
                              background: theme.colors.custom.background,
                            }}
                          >
                            <CommonStyles.Typography type="semiBold16">
                              {value.type}
                            </CommonStyles.Typography>
                          </div>
                          <CommonStyles.Typography type="semiBold16">
                            {key}
                          </CommonStyles.Typography>
                        </div>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            )}
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
      {selected && createPortal(<WF_EditDrawer node={props} />, document.body)}
    </Fragment>
  );
};

export default React.memo(WF_ParamExtractor);
