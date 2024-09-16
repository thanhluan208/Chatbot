import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import { useTheme } from "@mui/material";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
} from "@xyflow/react";

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
  animated
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const theme = useTheme()

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
      <circle r="10" fill="#4e40e5">
        <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
      </circle>
      {animated && <EdgeLabelRenderer>
        <CommonStyles.Button isIcon
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            borderRadius: '8px',
            background: theme.colors.custom.backgroundCard
          }}
          color="error"
          className="nodrag nopan"
        >
          <CommonIcons.Delete />
        </CommonStyles.Button>
      </EdgeLabelRenderer>}
    </>
  );
};

export default AnimatedSVGEdge;
