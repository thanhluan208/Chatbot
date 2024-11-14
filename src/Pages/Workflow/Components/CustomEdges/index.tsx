import CommonIcons from "@/Components/CommonIcons";
import queryKey from "@/Constants/queryKey";
import useWorkflowMutate from "@/Hooks/workflow/useWorkflowMutate";
import { useAuth } from "@/Providers/AuthenticationProvider";
import reactFlowService from "@/Services/reactFlowService";
import { useGet } from "@/Stores/useStore";
import { useTheme } from "@mui/material";
import {
  addEdge,
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSimpleBezierPath,
  useReactFlow,
} from "@xyflow/react";
import { useCallback, useEffect } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";

const AnimatedSVGEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  data,
  animated,
  source,
  target,
  ...props
}: EdgeProps) => {
  //! State
  const [edgePath, labelX, labelY] = getSimpleBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const botId = useParams()?.botId;
  const { userId } = useAuth();
  const {workflowId} = useParams();
  const theme = useTheme();
  const disabledCircle = useGet("DISABLE_CIRCLE");

  const { setEdges, getNode, updateNode, getEdge } = useReactFlow();
  const { handleRemoveEdge } = useWorkflowMutate();
  const queryClient = useQueryClient()

  useEffect(() => {
    const sourceNode = getNode(source);
    const targetNode = getNode(target);

    const parentsNodeTarget = (targetNode?.data?.parentNodes as string[]) || [];
    const parentsNodeSource = (sourceNode?.data?.parentNodes as string[]) || [];

    const newParentNodes: string[] = [];

    parentsNodeSource.forEach((nodeId) => {
      if (!newParentNodes.includes(nodeId)) {
        newParentNodes.push(nodeId);
      }
    });

    parentsNodeTarget.forEach((nodeId) => {
      if (!newParentNodes.includes(nodeId)) {
        newParentNodes.push(nodeId);
      }
    });

    updateNode(target, {
      data: {
        ...targetNode?.data,
        parentNodes: [...newParentNodes, source],
      },
    });
  }, [source, target, getNode, updateNode]);

  //! Function
  const onRemoveEdge = useCallback(
    (e: any) => {
      e.stopPropagation();
      const thisEdge = getEdge(id);

      const onFailed = () => {
        setEdges((eds) => {
          return thisEdge ? addEdge(thisEdge, eds) : eds;
        });
      };

      setEdges((edges) => {
        const newEdges = edges.filter((edge) => edge.id !== id);

        if (botId && userId) {
          reactFlowService.updateEdge(false, botId, source, target, onFailed);

          return newEdges;
        }

        if (workflowId && userId) {
          handleRemoveEdge.mutate(
            {
              user_id: userId,
              workflow_id: workflowId,
              edge_id: `${thisEdge?.source}-source-${thisEdge?.target}-target`,
            },
            {
              onSuccess: (response) => {
                if (response.status_code !== 200) {
                  onFailed();
                }
                console.log("remove edge success");
                queryClient.invalidateQueries({
                  queryKey: [queryKey.WORKFLOW_VAR_SELECTOR],
                });
              },
              onError: () => {
                onFailed();
              },
            }
          );

          return newEdges;
        }

        return edges;
      });
    },
    [botId, userId, setEdges, id, source, target]
  );

  //! Render
  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          opacity: data?.isPlaceholder ? 0.5 : 1,
          strokeWidth: 2,
          stroke: "#4e40e5",
        }}
      />
      {(animated || props.selected) && (
        <EdgeLabelRenderer>
          <button
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
              background: theme.colors.custom.backgroundSecondary,
            }}
            className="nodrag nopan"
            onClick={onRemoveEdge}
          >
            <CommonIcons.Delete />
          </button>
        </EdgeLabelRenderer>
      )}
      {(!disabledCircle || props.selected) && (
        <circle r="10" fill="#4e40e5">
          <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}
    </>
  );
};

export default AnimatedSVGEdge;
