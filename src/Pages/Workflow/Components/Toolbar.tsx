import { Box, useTheme } from "@mui/material";
import AddNodes from "./AddNodes";
import ZoomControl from "./ZoomControl";
import dagre from "dagre";
import { Node, useReactFlow } from "@xyflow/react";
import CommonStyles from "@/Components/CommonStyles";
import Layout from "@/Components/CommonIcons/Layout";
import History from "./History";
import { useGet } from "@/Stores/useStore";
import FitView from "@/Components/CommonIcons/FitView";
import { useCallback, useEffect, useRef } from "react";
import { cloneDeep, isEmpty } from "lodash";
import { v4 as uuid } from "uuid";
import Shortcuts from "./Shortcuts";
import AnimationControl from "./AnimationControl";

// const direction = "TB"

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

export type HistoryRef = {
  handleChangeHistory: (value: number) => void;
};

const Toolbar = ({
  listNode,
}: {
  listNode: { name: string; label: string }[];
}) => {
  //! State
  const theme = useTheme();
  const { getNodes, getEdges, setEdges, setNodes, fitView, getZoom, zoomTo } =
    useReactFlow();
  const handleSaveHistory = useGet("SAVE_HISTORY");
  const handleAddNode = useGet("ADD_NODE");
  const mousePos = useRef<{
    clientX: number;
    clientY: number;
  } | null>(null);

  const historyRef = useRef<HistoryRef | null>(null);

  //! Function
  const getLayoutedElements = (direction?: string) => {
    const nodes = getNodes();
    const edges = getEdges();
    const isHorizontal = direction === "LR";
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, {
        width: node.measured?.width,
        height: node.measured?.height,
      });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const newNodes = nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      const newNode = {
        ...node,
        targetPosition: isHorizontal ? "left" : "top",
        sourcePosition: isHorizontal ? "right" : "bottom",
        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        position: {
          x: nodeWithPosition.x - 200,
          y: nodeWithPosition.y - 400,
        },
      };

      return newNode;
    });

    setEdges([...edges]);
    setNodes([...newNodes] as Node[]);
    fitView({
      nodes: newNodes,
      padding: 5,
    });

    handleSaveHistory(newNodes, edges);

    return { nodes: newNodes, edges };
  };

  const handleDeleteNode = useCallback(() => {
    const nodes = getNodes();
    if (nodes.every((item) => !item.selected)) return;
    setNodes((nodes) => {
      const newNodes = nodes.filter((elm) => !elm.selected);
      handleSaveHistory(newNodes, getEdges());

      return newNodes;
    });
  }, [handleSaveHistory, getEdges, getNodes]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      console.log(e);
      if (e.code.toLowerCase() === "backspace") {
        handleDeleteNode();
      } else if (e.code.toLowerCase() === "keyz" && (e.ctrlKey || e.metaKey)) {
        historyRef.current?.handleChangeHistory &&
          historyRef.current?.handleChangeHistory(1);
      } else if (e.code.toLowerCase() === "keyy" && (e.ctrlKey || e.metaKey)) {
        historyRef.current?.handleChangeHistory &&
          historyRef.current?.handleChangeHistory(-1);
      } else if (e.code.toLowerCase() === "equal" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        zoomTo(getZoom() + 0.1);
      } else if (e.code.toLowerCase() === "minus" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        zoomTo(getZoom() - 0.1);
      } else if (e.code.toLowerCase() === "keyc" && (e.ctrlKey || e.metaKey)) {
        setNodes((nodes) =>
          nodes.map((elm) => {
            if (elm.selected) {
              return {
                ...elm,
                data: {
                  ...elm.data,
                  readyToPaste: true,
                },
              };
            }

            return elm;
          })
        );
      } else if (e.code.toLowerCase() === "keyv" && (e.ctrlKey || e.metaKey)) {
        setNodes((nodes) => {
          const pasteNodes = cloneDeep(nodes)
            .filter((elm) => elm.data?.readyToPaste)
            .map((elm) => {
              const newId = uuid();
              return {
                ...elm,
                id: newId,
                position: {
                  x: elm.position.x + 200,
                  y: elm.position.y - 200,
                },
                data: {
                  ...elm.data,
                  label: `Agent ${newId}`,
                },
              };
            });

          if (isEmpty(pasteNodes)) return nodes;

          return nodes.concat(pasteNodes).map((node) => {
            return {
              ...node,
              selected: false,
              data: {
                ...node.data,
                readyToPaste: false,
              },
            };
          });
        });
      }
    },
    [handleDeleteNode, handleAddNode]
  );

  const handleTrackMouse = useCallback((e: MouseEvent) => {
    mousePos.current = {
      clientX: e.clientX,
      clientY: e.clientY,
    };
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousemove", handleTrackMouse);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousemove", handleTrackMouse);
    };
  }, [handleKeyDown]);

  //! Render
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: "20px",
        right: "250px",
        background: theme.colors.custom.backgroundCard,
        padding: "10px 20px",
        boxShadow: "0 5px 10px rgba(0,0,0,0.2)",
        borderRadius: "12px",
        alignItems: "center",
        display: "flex",
        "& .iconBtn": {
          borderRadius: "8px",
          padding: "12px",
          maxWidth: "unset",
          height: "fit-content",
          width: "fit-content",
          background: theme.colors.custom.backgroundCard,
          "&:hover": {
            background: theme.colors.custom.backgroundCardHover,
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: "4px",
          alignItems: "center",
        }}
      >
        <AddNodes listNode={listNode ?? []} />
        <ZoomControl />

        <Box
          sx={{
            height: "25px",
            width: "2px",
            borderRadius: "10px",
            background: theme.colors.custom.normalColorTypo,
            margin: "0 24px",
            opacity: 0.75,
          }}
        />

        <CommonStyles.Button
          isIcon
          onClick={() => getLayoutedElements("LR")}
          tooltip="Rearrange flow"
          className="iconBtn"
        >
          <Layout />
        </CommonStyles.Button>
        <CommonStyles.Button
          isIcon
          onClick={() => fitView()}
          tooltip="Fit view"
          className="iconBtn"
        >
          <FitView />
        </CommonStyles.Button>
      </Box>
      <AnimationControl />

      <Box
        sx={{
          height: "25px",
          width: "2px",
          borderRadius: "10px",
          background: theme.colors.custom.normalColorTypo,
          margin: "0 24px",
          opacity: 0.75,
        }}
      />

      <History innerRef={historyRef} />

      <Box
        sx={{
          height: "25px",
          width: "2px",
          borderRadius: "10px",
          background: theme.colors.custom.normalColorTypo,
          margin: "0 24px",
          opacity: 0.75,
        }}
      />

      <Shortcuts />
    </Box>
  );
};

export default Toolbar;
