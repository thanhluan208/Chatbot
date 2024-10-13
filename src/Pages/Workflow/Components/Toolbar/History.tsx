import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import { useGet } from "@/Stores/useStore";
import { Box } from "@mui/material";
import { useReactFlow } from "@xyflow/react";
import { memo, useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { HistoryFlow } from "../FlowChart";
import { HistoryRef } from "../Toolbar";

const History = ({
  innerRef,
}: {
  innerRef: React.MutableRefObject<HistoryRef | null>;
}) => {
  //! State
  const [currentIndex, setCurrentIndex] = useState(0);
  const history: HistoryFlow = useGet("HISTORY") ?? [];
  const { setNodes, setEdges } = useReactFlow();

  //! Function
  const handleChangeHistory = (value: number) => {
    setCurrentIndex((prev) => {
      if (isEmpty(history)) return prev;

      const newValue = prev + value;

      const { edges: newEdges, nodes: newNodes } =
        history?.[history.length - newValue - 1];

      setNodes(newNodes);
      setEdges(newEdges);
      return newValue;
    });
  };

  useEffect(() => {
    innerRef.current = {
      handleChangeHistory,
    };
  }, [handleChangeHistory]);

  //! Render
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <CommonStyles.Button
        isIcon
        tooltip="Undo"
        onClick={() => {
          handleChangeHistory(1);
        }}
        className="iconBtn"
        disabled={history?.length - 1 - currentIndex < 1}
      >
        <CommonIcons.Undo />
      </CommonStyles.Button>
      <CommonStyles.Button
        isIcon
        tooltip="Redo"
        onClick={() => {
          handleChangeHistory(-1);
        }}
        className="iconBtn"
        disabled={currentIndex === 0 || history?.length === 0}
      >
        <CommonIcons.Redo />
      </CommonStyles.Button>
    </Box>
  );
};

export default memo(History);
