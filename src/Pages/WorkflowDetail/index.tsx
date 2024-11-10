import { Box } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useSave } from "@/Stores/useStore";
import cachedKeys from "@/Constants/cachedKeys";
import { useParams } from "react-router-dom";
import useGetWorkflowDetail from "@/Hooks/workflow/useGetWorkFlowDetail";
import { NodeTypeWorkflow } from "@/Types/workflow";
import {  Node, ReactFlowProvider } from "@xyflow/react";
import FlowChart from "../Workflow/Components/FlowChart";

const listNode = [
  {
    name: `customNode_WF_${NodeTypeWorkflow.START}`,
    label: "Start Node",
    description: "Create an agent",
    hidden: true,
  },
  {
    name: `customNode_WF_${NodeTypeWorkflow.LLM}`,
    label: "LLM",
    description: "Llm Node",
  },
  {
    name: `customNode_WF_${NodeTypeWorkflow.IF_ELSE}`,
    label: "IF/ELSE",
    description: "If else node",
  },
  {
    name: `customNode_WF_${NodeTypeWorkflow.CODE}`,
    label: "Code",
    description: "Code node",
  },
  {
    name: `customNode_WF_${NodeTypeWorkflow.LONG_TERM_MEMORY}`,
    label: "LTM",
    description: "Long-term memory node",
  },
];

const WorkflowDetail = () => {
  //! State
  const save = useSave();
  const params = useParams();

  const { data, isLoading } = useGetWorkflowDetail(params.workflowId as string);
  const nodes = data?.workflow_data?.graph?.nodes;

  const parsedNode = useMemo(() => {
    const arr: Node[] = [];

    if (!nodes) return;

    Object.keys(nodes).forEach((key) => {
      const node = nodes[key as keyof typeof nodes];
      const type = `customNode_WF_${node.data.type}`;

      if (!listNode.find((item) => item.name === type)) return;
      arr.push({
        id: node.id,
        position: JSON.parse(node.data.position),
        data: {
          ...node?.data,
          label: node?.id,
          variable_out: node?.variables_out,
          startNode: key === NodeTypeWorkflow.START,
        },
        selectable: key !== NodeTypeWorkflow.START,
        selected: false,
        dragging: false,
        type: `customNode_WF_${node.data.type}`,
      });
    });

    return arr;
  }, [nodes]);

  const initEdges = useMemo(() => {
    return Object.values(data?.workflow_data?.graph?.edges || {}).map(
      (edge) => {
        return {
          ...edge,
        };
      }
    );
  }, [data?.workflow_data?.graph?.edges]);

  //! Function

  useEffect(() => {
    save(cachedKeys.LOADING_APP, isLoading);
  }, [isLoading]);

  //! Render
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
      }}
    >
      {parsedNode && (
        <ReactFlowProvider>
          <FlowChart
            initNodes={parsedNode || []}
            listNode={listNode}
            workflowId={params.workflowId}
            initEdges={initEdges || []}
          />
        </ReactFlowProvider>
      )}
    </Box>
  );
};

export default WorkflowDetail;
