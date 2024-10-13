import { Box } from "@mui/material";
import logo from "@/assets/logo.png";
import { useCallback, useRef, useState } from "react";
import reactFlowService from "@/Services/reactFlowService";
import { useParams } from "react-router-dom";
import { useReactFlow } from "@xyflow/react";
import CommonStyles from "@/Components/CommonStyles";
import CommonIcons from "@/Components/CommonIcons";
import ChatWithBotButton from "./ChatWithBotButton";
import DeleteAgentButton from "./DeleteAgentButton";

interface WrapperNodeLabelProps {
  nodeId: string;
  positionAbsoluteX: number;
  positionAbsoluteY: number;
  data: {
    [key: string]: unknown;
  };
}

const WrapperNodeLabel = (props: WrapperNodeLabelProps) => {
  //! State
  const [isRenaming, setIsRenaming] = useState(false);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const params = useParams();
  const { updateNode } = useReactFlow();

  const botId = params?.botId;

  //! Function
  const handleRename = useCallback(() => {
    if (!botId) return;
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

    updateNode(props?.nodeId, {
      data: {
        ...props.data,
        label: nameRef?.current?.value,
      },
    });
    setIsRenaming(false);
  }, [updateNode, props?.nodeId, props?.data]);

  //! Render
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <img
          src={logo}
          alt="logo"
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
          }}
        />
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
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <ChatWithBotButton
          nodeId={props.nodeId}
          botId={botId || ''}
          data={props.data}
          isCurrentNode={!!props.data?.currentNode}
          positionAbsoluteX={props.positionAbsoluteX}
          positionAbsoluteY={props.positionAbsoluteY}
        />

        <DeleteAgentButton id={props.nodeId} />
      </Box>
    </Box>
  );
};

export default WrapperNodeLabel;
