import FlowChart from "@/Pages/Workflow/Components/FlowChart";
import { ReactFlowProvider } from "@xyflow/react";
import { useParams } from "react-router-dom";

const initNode = [
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
  {
    id: "b7e48d14-235b-4238-bdac-cd54ae7796e2",
    type: "customNode_multiAgentNode",
    position: {
      x: -320,
      y: 241,
    },
    data: {
      label: "customNode_multiAgentNode node",
    },
    measured: {
      width: 1002,
      height: 275,
    },
    selected: false,
    dragging: false,
  },
];
const MultiAgent = () => {
  //! State
  const params = useParams();
  const botId = params.botId;
  const listNode = [
    {
      name: "customNode_multiAgentNode",
      label: "Multi Agent Node",
    },
  ];

  //! Function

  //! Render
  return (
    <ReactFlowProvider>
      <FlowChart initNodes={initNode} listNode={listNode} botId={botId ?? ""} />
    </ReactFlowProvider>
  );
};

export default MultiAgent;
