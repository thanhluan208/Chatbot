import React from "react";
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
import { useSave } from "@/Stores/useStore";
import { NodeTypes } from "../../AddNodes";

const MultiAgentStartNode = (props: NodeProps) => {
  //! State
  const theme = useTheme();
  
  const [isAdding, setIsAdding] = React.useState(false);
  const placeholderId = React.useRef<string | null>(null);
  const { setNodes, setEdges, updateNode, updateEdge } = useReactFlow();
  const save = useSave();

  //! Function
  const handleAddPlaceholder = () => {
    if (isAdding) return;
    setIsAdding(true);
    const newId = uuid();
    placeholderId.current = newId;
    const newNode = {
      id: newId,
      type: NodeTypes.multiAgentNode,
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

      return newEdges;
    });
  };

  const handleAddNode = () => {
    if (!placeholderId.current) return;
    updateNode(placeholderId.current, {
      data: {
        isPlaceholder: false,
      },
    });

    updateEdge(`${props.id}-${placeholderId.current}`, {
      data: {
        isPlaceholder: false,
      },
      animated: false,
    });

    placeholderId.current = null;
    setIsAdding(false);
  };

  //! Render
  return (
    <Box
      sx={{
        borderRadius: "8px",
        background: theme.palette.primary.main,
        border: "solid 2px transparent",
        minWidth: "200px",
        boxShadow: "0 0 8px 0 rgba(29,28,35,.06),0 0 2px 0 rgba(29,28,35,.18)",
        "&:hover": {
          boxShadow: "0 0 1px rgba(0,0,0,.3),0 4px 14px rgba(0,0,0,.1)",
        },
        padding: "12px",
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
      <CommonStyles.Typography type="bold14" textAlign="center" color="#fff">
        Start node
      </CommonStyles.Typography>
      <Handle
        type="source"
        position={Position.Right}
        id={`${props.id}-source`}
        isConnectable={true}
        className="handle"
        onMouseEnter={handleAddPlaceholder}
        onMouseLeave={handleRemovePlaceholder}
        onClick={handleAddNode}
      />
    </Box>
  );
};

export default React.memo(MultiAgentStartNode);
