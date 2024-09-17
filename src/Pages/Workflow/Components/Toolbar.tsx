import { Box, Tooltip, useTheme } from "@mui/material";
import AddNodes from "./AddNodes";
import ZoomControl from "./ZoomControl";
import dagre from "dagre";
import { Node, useReactFlow } from "@xyflow/react";
import CommonStyles from "@/Components/CommonStyles";
import Layout from "@/Components/CommonIcons/Layout";

// const direction = "TB"

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const Toolbar = ({
  listNode,
}: {
  listNode: { name: string; label: string }[];
}) => {
  //! State
  const theme = useTheme();
  const { getNodes, getEdges, setEdges, setNodes } = useReactFlow();

  //! Function
  const getLayoutedElements = (direction?: string) => {
    const nodes = getNodes();
    const edges = getEdges();
    const isHorizontal = direction === "LR";
    dagreGraph.setGraph({ rankdir: direction });

    console.log("nodes", nodes)

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

    return { nodes: newNodes, edges };
  };

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
        display: "flex",
        gap: "12px",
        alignItems: "center",
      }}
    >
      <AddNodes listNode={listNode ?? []} />
      <ZoomControl />
      <Tooltip title="Rearrange flow">
        <div>
          <CommonStyles.Button isIcon onClick={() => getLayoutedElements("LR")}>
            <Layout />
          </CommonStyles.Button>
        </div>
      </Tooltip>
    </Box>
  );
};

export default Toolbar;
