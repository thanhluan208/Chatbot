import React, { useEffect, useMemo, useRef } from "react";
import {
  Handle,
  MarkerType,
  NodeProps,
  Position,
  useReactFlow,
} from "@xyflow/react";
import { Box, useTheme } from "@mui/material";
import { v4 as uuid } from "uuid";
import CommonStyles from "@/Components/CommonStyles";
import CollapseArea from "@/Components/CommonStyles/CollapseArea";
import { AllQueryKeys, useGet, useSave } from "@/Stores/useStore";
import reactFlowService from "@/Services/reactFlowService";
import { useParams } from "react-router-dom";
import { useAuth } from "@/Providers/AuthenticationProvider";
import { toast } from "react-toastify";

import "./index.css";
import WrapperNodeLabel from "./components/WrapperNodeLabel";
import NodeForm from "./components/NodeForm";

const MultiAgentNode = (props: NodeProps) => {
  //! State
  const { data } = props;
  const shouldRemove = useGet(`${props.id}_remove` as AllQueryKeys);
  const { setNodes, setEdges, updateNode, updateEdge, getNode } =
    useReactFlow();
  const [isAdding, setIsAdding] = React.useState(false);

  const placeholderId = useRef<string | null>(uuid());

  const save = useSave();
  const theme = useTheme();

  const params = useParams();
  const botId = params?.botId;

  const { userId } = useAuth();

  const classname = useMemo(() => {
    if (data?.currentNode && data?.startNode) return "chatting-start";
    else if (data?.currentNode && !data?.startNode) return "agent-chatting";
    else if (data?.startNode) return "start-node";
    else return "agent-node";
  }, [data?.currentNode, data?.startNode]);

  //! Function
  const handleAddPlaceholder = () => {
    if (isAdding) return;
    setIsAdding(true);
    const newId = uuid();
    placeholderId.current = newId;
    const newNode = {
      id: newId,
      type: props.type,
      position: {
        x:
          props.positionAbsoluteX +
          (props?.width ?? 500) +
          Math.floor(Math.random() * 200 + 300),
        y: props.positionAbsoluteY + Math.floor(Math.random() * 1000 - 500),
      },
      data: {
        isPlaceholder: true,
      },
    };

    setNodes((nodes) => nodes.concat(newNode));
    setEdges((edges) =>
      edges.concat({
        id: `${props.id}-${newId}`,
        source: props.id,
        target: newId,
        animated: true,
        type: "animatedSvg",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: "#4e40e5",
        },
        data: {
          isPlaceholder: true,
        },
        deletable: true,
      })
    );
  };

  const handleRemovePlaceholder = () => {
    if (!placeholderId.current) return;
    save(`${placeholderId.current}_remove`, true);
    setIsAdding(false);
    setEdges((edges) => {
      const newEdges = edges.filter((edge) => {
        return !edge.data?.isPlaceholder;
      });

      console.log("newEdges", newEdges);
      return newEdges;
    });
  };

  const handleAddNode = () => {
    if (!placeholderId.current || !userId) return;
    const newNode = getNode(placeholderId.current);

    if (!newNode) return;

    const onSuccess = (id: string) => {
      updateNode(newNode.id, {
        id: id,
        data: {
          label: `Agent ${id}`,
        },
      });
      updateEdge(`${props.id}-${newNode.id}`, {
        data: {
          isPlaceholder: false,
        },
        target: id,
        animated: false,
      });
    };

    const onFailed = () => {
      save(`${newNode.id}_remove`, false);
      setEdges((edges) =>
        edges.filter((edge) => edge.id !== `${props.id}-${newNode.id}`)
      );
      toast.error("Failed to create agent");
    };

    reactFlowService.createFlow(
      botId as string,
      userId,
      onSuccess,
      onFailed,
      JSON.stringify({
        position: newNode?.position,
      }),
      props.id
    );

    placeholderId.current = null;
    setIsAdding(false);
  };

  useEffect(() => {
    const node = document.getElementById(props.id);
    if (node && shouldRemove) {
      node.style.opacity = "0";
    }

    setTimeout(() => {
      if (node && shouldRemove) {
        setNodes((nodes) => nodes.filter((n) => n.id !== props.id));
      }
    }, 500);
  }, [shouldRemove, props.id]);

  useEffect(() => {
    if (props.selected) {
      setEdges((edges) => {
        return edges.map((edge) => {
          if (edge.source === props.id || edge.target === props.id) {
            return {
              ...edge,
              animated: true,
            };
          }
          return {
            ...edge,
            animated: false,
          };
        });
      });
    } else {
      setEdges((edge) =>
        edge.map((item) => ({
          ...item,
          animated: false,
        }))
      );
    }
  }, [props?.selected, props?.id]);

  //! Render
  return (
    <Box
      id={props.id}
      sx={{
        opacity: props.data?.isPlaceholder ? 0.5 : 1,
        display: "flex",
        borderRadius: "8px",
        padding: "2px",
        transition: "all 0.5s ease",
        position: "relative",
        "& .handle": {
          "&::before": {
            content: '"+"',
            color: theme.colors.custom.backgroundCard,
            fontWeight: "bold",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            opacity: 0,
            transition: "all 0.3s ease",
          },
          "&:hover": {
            "&::before": {
              opacity: 1,
            },
          },
        },
      }}
    >
      {(!!data?.currentNode || !!data?.startNode) && (
        <Box
          sx={{
            position: "absolute",
            top: "-50px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {!!data?.currentNode && (
            <Box
              sx={{
                background: `${theme.palette.success.main}`,
                borderRadius: "12px",
                padding: "4px 12px",
              }}
            >
              <CommonStyles.Typography type="semiBold16" color="#fff">
                Chatting...
              </CommonStyles.Typography>
            </Box>
          )}
          {!!data?.startNode && (
            <Box
              sx={{
                background: `${theme.palette.secondary.main}`,
                borderRadius: "12px",
                padding: "4px 12px",
              }}
            >
              <CommonStyles.Typography type="semiBold16" color="#fff">
                Start node
              </CommonStyles.Typography>
            </Box>
          )}
        </Box>
      )}
      <Box
        sx={{
          borderRadius: "8px",
          position: "relative",
          padding: "2px",
          minWidth:
            props?.data?.currentNode && props?.selected ? "800px" : "500px",
          transition: "width 0.5s ease, height 0.5s ease",
          overflow: "hidden",
          display: "flex",
          boxShadow:
            "0 0 8px 0 rgba(29,28,35,.06),0 0 2px 0 rgba(29,28,35,.18)",
          "&:hover": {
            boxShadow: "0 0 1px rgba(0,0,0,.3),0 4px 14px rgba(0,0,0,.1)",
          },
          borderColor: theme.colors.custom.borderColor,
        }}
        className={classname}
        onClick={() => {
          const updates: any = {
            selected: true,
            readyToPaste: true,
          };
          updateNode(props?.id, {
            ...props.data,
            ...updates,
          });
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            position: "relative",
            background: theme.colors.custom.backgroundCard,
            borderRadius: "8px",
          }}
        >
          <CollapseArea
            nodeId={props.id}
            dataKey="wrapperNode"
            initOpen={!!props?.data?.currentNode}
            key={props?.data?.currentNode as any}
            label={
              <WrapperNodeLabel
                data={props.data}
                nodeId={props.id}
                positionAbsoluteX={props.positionAbsoluteX}
                positionAbsoluteY={props.positionAbsoluteY}
              />
            }
            sxContainer={{
              marginTop: "0",
              "& .collapse-header": {
                marginBottom: "0",
              },
            }}
          >
            <NodeForm data={props.data} nodeId={props.id} />
          </CollapseArea>
        </Box>
      </Box>
      <Handle
        type="source"
        position={Position.Right}
        id={`${props?.id}-source`}
        isConnectable={true}
        className="handle"
        onMouseEnter={handleAddPlaceholder}
        onMouseLeave={handleRemovePlaceholder}
        onClick={handleAddNode}
        style={{
          right: "3px",
        }}
      />
      {!data?.startNode && (
        <Handle
          type="target"
          position={Position.Left}
          id={`${props?.id}-target`}
          isConnectable={true}
          className="handle"
        />
      )}
    </Box>
  );
};

export default React.memo(MultiAgentNode);
