import CommonIcons from "@/Components/CommonIcons";
import { useAuth } from "@/Providers/AuthenticationProvider";
import reactFlowService from "@/Services/reactFlowService";
import { useGet } from "@/Stores/useStore";
import { useTheme } from "@mui/material";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSimpleBezierPath,
  useReactFlow,
} from "@xyflow/react";
import { useCallback } from "react";
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
  const { setEdges } = useReactFlow();
  const botId = useParams()?.botId;
  const { userId } = useAuth();
  const theme = useTheme();
  const disabledCircle = useGet("DISABLE_CIRCLE");

  //! Function
  const handleRemoveEdge = useCallback(
    (e: any) => {
      e.stopPropagation();
      setEdges((edges) => {
        const newEdges = edges.filter((edge) => edge.id !== id);

        if (botId && userId) {
          reactFlowService.updateEdge(false, botId, source, target);

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
            onClick={handleRemoveEdge}
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
