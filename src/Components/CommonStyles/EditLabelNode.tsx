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
  positionAbsoluteX: number;
  positionAbsoluteY: number;
  data: {
    [key: string]: unknown;
  };
  handleUpdateName?: (name: string) => Promise<void>;
}

const EditLabelNode = (props: EditLabelNodeProps) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const params = useParams();
  const { updateNode } = useReactFlow();
  const { userId } = useAuth();
  const { handleUpdateNodeData } = useWorkflowMutate();

  const botId = params?.botId;

  const handleRename = useCallback(async () => {
    const onSuccess = () => {
      updateNode(props?.nodeId, {
        id: props?.workflowId ? nameRef?.current?.value : props?.nodeId,
        data: {
          ...props.data,
          label: nameRef?.current?.value,
        },
      });
      setIsRenaming(false);
    };

    if (botId) {
      const info = {
        position: {
          x: props.positionAbsoluteX,
          y: props.positionAbsoluteY,
        },
        data: {
          ...props.data,
          label: nameRef?.current?.value,
        },
      };

      reactFlowService
        .updateFlow(botId, props.nodeId, JSON.stringify(info))
        .catch((err) => {
          console.log("err", err);
        });

      onSuccess();
    }

    if (props.workflowId && userId) {
      const payload = {
        user_id: userId,
        workflow_id: props.workflowId,
        node_id: props.nodeId,
        node_data: {
          name: nameRef?.current?.value,
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
        onSuccess();
      } else {
        toast.error(response?.message);
      }
    }
  }, [updateNode, props?.nodeId, props?.data, props.workflowId]);

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
          initValue={props?.data?.label as string}
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
          {(props?.data?.label as string) ?? `Agent ${props.nodeId}`}
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
              if (props.handleUpdateName) {
                await props.handleUpdateName(nameRef?.current?.value as string);
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
