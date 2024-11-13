import reactFlowService from "@/Services/reactFlowService";
import { useReactFlow } from "@xyflow/react";
import { useCallback, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import CommonStyles from ".";
import { Box } from "@mui/material";
import CommonIcons from "../CommonIcons";
import { useAuth } from "@/Providers/AuthenticationProvider";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import { toast } from "react-toastify";

interface EditLabelNodeProps {
  nodeId: string;
  workflowId?: string;

  handleUpdateName?: (name: string) => Promise<void>;
}

const EditLabelNode = ({
  nodeId,
  handleUpdateName,
  workflowId,
}: EditLabelNodeProps) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const params = useParams();
  const { updateNode, getNode } = useReactFlow();
  const { userId } = useAuth();
  const { handleUpdateNodeData } = useWorkflowMutate();

  const botId = params?.botId;
  const node = getNode(nodeId);
  const { data, position } = node || {};

  const handleRename = useCallback(async () => {
    const onSuccess = () => {
      updateNode(nodeId, {
        id: workflowId ? nameRef?.current?.value : nodeId,
        data: {
          ...data,
          label: nameRef?.current?.value,
        },
      });
      setIsRenaming(false);
    };

    if (botId) {
      const info = {
        position: {
          x: position?.x,
          y: position?.y,
        },
        data: {
          ...data,
          label: nameRef?.current?.value,
        },
      };

      reactFlowService
        .updateFlow(botId, nodeId, JSON.stringify(info))
        .catch((err) => {
          console.log("err", err);
        });

      onSuccess();
    }

    if (workflowId && userId) {
      const payload = {
        user_id: userId,
        workflow_id: workflowId,
        node_id: nodeId,
        node_data: {
          name: nameRef?.current?.value,
        },
      };

      const response = await handleUpdateNodeData.mutateAsync(payload);
      if (response?.status_code === 200) {
        onSuccess();
      } else {
        toast.error(response?.message);
      }
    }
  }, [updateNode, nodeId, data, workflowId, position]);

  return (
    <Box
      sx={{
        display: "flex",
        gap: "4px",
        alignItems: "center",
      }}
    >
      {isRenaming ? (
        <CommonStyles.Input
          ref={nameRef}
          initValue={data?.label as string}
          sxContainer={{
            "& .MuiInputBase-root": {
              height: "23.56px",
            },
          }}
        />
      ) : (
        <CommonStyles.Typography
          type="semiBold16"
          sx={{
            maxWidth: "200px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {(data?.label as string) ?? `Agent ${nodeId}`}
        </CommonStyles.Typography>
      )}
      {isRenaming ? (
        <Box
          sx={{
            display: "flex",
          }}
        >
          <CommonStyles.Button
            isIcon
            hasBorder={false}
            tooltip="Cancel"
            isRound={false}
            sx={{
              svg: {
                width: "16px",
                height: "16px",
              },
            }}
            onClick={(e) => {
              e.stopPropagation();
              setIsRenaming(false);
            }}
          >
            <CommonIcons.Close />
          </CommonStyles.Button>
          <CommonStyles.Button
            isIcon
            hasBorder={false}
            tooltip="Save"
            isRound={false}
            sx={{
              svg: {
                width: "16px",
                height: "16px",
              },
            }}
            onClick={async (e) => {
              e.stopPropagation();
              if (handleUpdateName) {
                await handleUpdateName(nameRef?.current?.value as string);
                setIsRenaming(false);
              }
              handleRename();
            }}
          >
            <CommonIcons.Save />
          </CommonStyles.Button>
        </Box>
      ) : (
        <CommonStyles.Button
          isIcon
          tooltip="Rename"
          hasBorder={false}
          isRound={false}
          sx={{
            svg: {
              width: "16px",
              height: "16px",
            },
          }}
          onClick={(e) => {
            e.stopPropagation();
            setIsRenaming(true);
            setTimeout(() => {
              nameRef.current?.focus();
            }, 1);
          }}
        >
          <CommonIcons.Edit />
        </CommonStyles.Button>
      )}
    </Box>
  );
};

export default EditLabelNode;
