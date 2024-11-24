import React, { Fragment, useCallback, useMemo } from "react";
import { Handle, NodeProps, Position, useReactFlow } from "@xyflow/react";
import { Box, useTheme } from "@mui/material";
import { Book, Plus, Trash } from "lucide-react";
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
import { KnowledgeNodeData } from "./type";
import VarOutList from "../../misc/VarOutList";
import { KnowledgeFilter } from "@/Pages/ChatbotConfigure/components/Configure/Knowledge/KnowledgeListDialog";
import useGetListFolderKnowledge from "@/Hooks/Knowledges/useGetListFolderKnowledge";
import AddKnowledgeButton from "./AddKnowledgeButton";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import { capitalize } from "lodash";
import { useTranslation } from "react-i18next";

const WF_Knowledge = (props: NodeProps) => {
  //! State
  const { id, selected } = props;
  const theme = useTheme();
  const { workflowId } = useParams();
  const save = useSave();
  const { t } = useTranslation("node");
  const { updateNode } = useReactFlow();
  const { handleUpdateNodeDataKnowledge } = useWorkflowMutate();

  const nodeData = props.data as unknown as KnowledgeNodeData;
  const filters = useMemo(() => {
    return {
      visual_option: KnowledgeFilter.Owned,
      search_input: "",
    };
  }, []);

  const { data: listKnowledgeFolders } = useGetListFolderKnowledge(filters);

  const addedFolders = useMemo(() => {
    if (!listKnowledgeFolders || !nodeData?.knowledge_storage_ids) return [];

    return listKnowledgeFolders.filter((folder) =>
      nodeData?.knowledge_storage_ids?.includes(folder.id)
    );
  }, [listKnowledgeFolders, nodeData?.knowledge_storage_ids]);

  //! Function

  const handleClickNode = () => {
    updateNode(id, {
      selected: true,
    });
    setTimeout(() => {
      save(cachedKeys.NODE_EDITING, {
        type: NodeTypeWorkflow.KNOWLEDGE_RETRIEVAL,
        id: id,
      });
    }, 0);
  };

  const handleRemoveFolder = useCallback(
    (folderId: string) => {
      const newFolders = nodeData?.knowledge_storage_ids.filter(
        (item) => item !== folderId
      );

      handleUpdateNodeDataKnowledge(id, {
        knowledge_storage_ids: newFolders,
      });
    },
    [nodeData?.knowledge_storage_ids, handleUpdateNodeDataKnowledge, id]
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
                    <Book className="w-3.5 h-3.5" color="#fff" />
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
            <div className="mb-3 flex flex-col gap-2 px-3">
              <div className="flex items-center justify-between">
                <CommonStyles.Typography type="semiBold16">
                  {capitalize(t("WF_Knowledge.knowledge"))}
                </CommonStyles.Typography>

                <AddKnowledgeButton
                  knowledges={nodeData?.knowledge_storage_ids}
                  nodeId={id}
                  customButton={(setOpen) => (
                    <CommonStyles.Button
                      isIcon
                      onClickCapture={(e) => {
                        e.stopPropagation();
                        setOpen(true);
                      }}
                    >
                      <Plus size={16} />
                    </CommonStyles.Button>
                  )}
                />
              </div>

              {addedFolders?.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded-lg"
                    style={{
                      background: theme.colors.custom.background,
                      border: `1px solid ${theme.colors.custom.borderColor}`,
                    }}
                  >
                    <div className="flex gap-3 items-center">
                      <img
                        src={item.avatar}
                        alt={item.title}
                        className="w-6 h-6 rounded-lg"
                      />
                      <div>
                        <CommonStyles.Typography
                          type="semiBold16"
                          className="truncate max-w-[300px]"
                        >
                          {item.title}
                        </CommonStyles.Typography>
                        <CommonStyles.Typography className="opacity-50">
                          {item.description}
                        </CommonStyles.Typography>
                      </div>
                    </div>
                    <CommonStyles.Button
                      isIcon
                      color="error"
                      hasBorder={false}
                      onClick={(e) => {
                        e.stopPropagation();
                        !!item.id && handleRemoveFolder(item.id);
                      }}
                    >
                      <Trash size={16} />
                    </CommonStyles.Button>
                  </div>
                );
              })}
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
      {selected && createPortal(<WF_EditDrawer node={props} />, document.body)}
    </Fragment>
  );
};

export default React.memo(WF_Knowledge);
