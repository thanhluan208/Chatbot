import Layout from "@/Components/CommonIcons/Layout";
import CommonStyles from "@/Components/CommonStyles";
import { detectDiff } from "@/Helpers";
import reactFlowService from "@/Services/reactFlowService";
import { CircularProgress } from "@mui/material";
import { Node, useReactFlow } from "@xyflow/react";
import dagre from "dagre";
import { isEmpty } from "lodash";
import { useState } from "react";
import { useParams } from "react-router-dom";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const ReArrangeFlow = () => {
  //! State
  const [loading, setLoading] = useState(false);
  const { getNodes, getEdges, setNodes, setEdges, fitView } = useReactFlow();
  const { botId } = useParams();

  //! Function
  const getLayoutedElements = (direction?: string) => {
    if (loading || !botId) return;
    setLoading(true);
    try {
      const nodes = getNodes();
      const edges = getEdges();
      const isHorizontal = direction === "LR";
      dagreGraph.setGraph({ rankdir: direction, ranksep: 300, nodesep: 300 });

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
          position: {
            x: nodeWithPosition.x - 200,
            y: nodeWithPosition.y - 400,
          },
        };

        return newNode;
      });

      const diff = detectDiff(nodes, newNodes as Node[]);

      if (!diff) {
        setLoading(false);
        return;
      }
      const failedNode: Node[] = [];
      const promise: Promise<any>[] = [];

      for (const node of newNodes) {
        const info = {
          position: node.position,
          data: node.data,
          measured: node.measured,
        };
        promise.push(
          reactFlowService.updateFlow(botId, node.id, JSON.stringify(info))
        );
      }

      Promise.allSettled(promise).then((result) => {
        result.forEach((res, index) => {
          if (res.status === "rejected") {
            console.log("rejected", res);
            failedNode.push(newNodes[index] as Node);
          }
        });

        !isEmpty(failedNode) &&
          setNodes((prevNodes) => {
            return prevNodes.map((node) => {
              if (failedNode.some((elm) => elm.id === node.id)) {
                return nodes.find((elm) => elm.id === node.id) as Node;
              } else {
                return node;
              }
            });
          });

        setLoading(false);
      });

      setEdges([...edges]);
      setNodes([...newNodes] as Node[]);
      fitView({
        nodes: newNodes,
        padding: 1,
      });

      return { nodes: newNodes, edges };
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  //! Render
  return (
    <CommonStyles.Button
      isIcon
      onClick={() => getLayoutedElements("LR")}
      tooltip="Rearrange flow"
      className="iconBtn"
      disabled={loading}
      isLoading={loading}
    >
      {loading ? <CircularProgress size={16} /> : <Layout />}
    </CommonStyles.Button>
  );
};

export default ReArrangeFlow;
