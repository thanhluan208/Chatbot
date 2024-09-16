import FlowChart from "@/Pages/Workflow/Components/FlowChart";
import { useGet } from "@/Stores/useStore";
import { Edge, Node, ReactFlowProvider } from "@xyflow/react";
import { isArray } from "lodash";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import ChatDrawer from "./ChatDrawer";
import ConversationDrawer from "@/Pages/ChatBot/components/ConversationDrawer";
import { BotData } from "@/Hooks/Bot/useGetBotData";

const MultiAgent = () => {
  //! State
  const params = useParams();
  const botId = params.botId;
  const listNode = [
    {
      name: "customNode_multiAgentNode",
      label: "Multi Agent Node",
      description: "Create an agent",
    },
  ];

  const botData: BotData = useGet("BOT_DATA");

  const initNodes = useMemo(() => {
    const nodes: Node[] = [
      {
        id: "c372a3b5-85fa-4b7d-a1e5-1913df8d6721",
        type: "customNode_mutliAgentStartNode",
        position: {
          x: 1301,
          y: 175,
        },
        data: {
          label: "customNode_mutliAgentStartNode node",
        },
        measured: {
          width: 500,
          height: 367,
        },
        selected: true,
        dragging: false,
      },
    ];

    const agents = botData?.nodes;
    if (!agents) return nodes;
    Object.keys(agents).forEach((key) => {
      const agent = agents?.[key];
      if (agent.node_id === botData.flow_nodes.start_node) {
        nodes[0].id = agent?.node_id;
        return;
      }

      const agentInfo = JSON.parse(agent?.info);

      const agentNode = {
        id: agent?.node_id,
        type: "customNode_multiAgentNode",
        position: {
          x: agentInfo?.position?.x,
          y: agentInfo?.position?.y,
        },
        data: {
          label: `Agent ${agent?.node_id}`,
          isCurrentNode: agent?.node_id === botData?.flow_nodes?.current_node,
          ...agent?.metadata,
        },
        selected: false,
        dragging: false,
      };

      nodes.push(agentNode);
    });

    return nodes;
  }, [botData]);

  const initEdges = useMemo(() => {
    const botEdges = botData?.flow_nodes?.edges;

    if (!isArray(botEdges)) return [];

    return botEdges.map((ed) => {
      return {
        id: `xy-edge_${ed?.src_node}-${ed?.dest_node}`,
        deleteable: true,
        source: ed?.src_node,
        target: ed?.dest_node,
        sourceHandle: `${ed?.src_node}-source`,
        targetHandle: `${ed?.dest_node}-target`,
        type: "animatedSvg",
        markerEnd: {
          type: "arrowclosed",
          width: 20,
          height: 20,
          color: "#4e40e5",
        },
      };
    });
  }, [botData]);

  //! Function

  //! Render

  return (
    <ReactFlowProvider>
      {initNodes && (
        <FlowChart
          initNodes={initNodes}
          listNode={listNode}
          botId={botId ?? ""}
          isMultiAgent
          key={JSON.stringify(initNodes)}
          initEdges={initEdges as Edge[]}
        />
      )}
      <ConversationDrawer />
      <ChatDrawer />
    </ReactFlowProvider>
  );
};

export default MultiAgent;
