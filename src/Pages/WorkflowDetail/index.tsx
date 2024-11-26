import { Box } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useSave } from "@/Stores/useStore";
import cachedKeys from "@/Constants/cachedKeys";
import { useParams } from "react-router-dom";
import useGetWorkflowDetail from "@/Hooks/workflow/useGetWorkFlowDetail";
import { NodeTypeWorkflow } from "@/Types/workflow";
import { Edge, Node, ReactFlowProvider } from "@xyflow/react";
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
  {
    name: `customNode_WF_${NodeTypeWorkflow.VARIABLE_AGGREGATOR}`,
    label: "Variable Aggregator",
    description: "Aggregate multi-branch",
  },
  {
    name: `customNode_WF_${NodeTypeWorkflow.KNOWLEDGE_RETRIEVAL}`,
    label: "Knowledge Retrieval",
    description: "Knowledge retrieval node ",
  },
  {
    name: `customNode_WF_${NodeTypeWorkflow.PARAMETER_EXTRACTOR}`,
    label: "Parameter Extractor",
    description: "Parameter extractor node",
  },
  {
    name: `customNode_WF_${NodeTypeWorkflow.QUESTION_CLASSIFIER}`,
    label: "Question Classifier",
    description: "Question classifier node",
  },
  {
    name: `customNode_WF_${NodeTypeWorkflow.VARIABLE}`,
    label: "Variable",
    description: "Variable node",
  },
  {
    name: `customNode_WF_${NodeTypeWorkflow.ANSWER}`,
    label: "Answer",
    description: "Answer node",
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

  const initEdges: Edge[] = useMemo(() => {
    return Object.values(data?.workflow_data?.graph?.edges || {}).map(
      (edge) => {
        return {
          ...edge,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge?.sourceHandle || `${edge.source}-source`,
          targetHandle: `${edge.target}-target`,
          markerEnd: {
            type: "arrowclosed",
            width: 20,
            height: 20,
            color: "#4e40e5",
          },
          deletable: true,
          type: "animatedSvg",
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
        minWidth: "1100px",
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
