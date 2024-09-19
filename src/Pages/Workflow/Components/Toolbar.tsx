import { Box, useTheme } from "@mui/material";
import AddNodes from "./Toolbar/AddNodes";
import ZoomControl from "./Toolbar/ZoomControl";
import {  useReactFlow } from "@xyflow/react";
import CommonStyles from "@/Components/CommonStyles";
import { useGet } from "@/Stores/useStore";
import FitView from "@/Components/CommonIcons/FitView";
import { useCallback, useEffect, useRef } from "react";
import { cloneDeep, isEmpty } from "lodash";
import { v4 as uuid } from "uuid";
import Shortcuts from "./Toolbar/Shortcuts";
import AnimationControl from "./Toolbar/AnimationControl";
import History from "./Toolbar/History";
import ReArrangeFlow from "./Toolbar/ReArrangeFlow";

// const direction = "TB"



export type HistoryRef = {
  handleChangeHistory: (value: number) => void;
};

const Toolbar = ({
  listNode,
}: {
  listNode: { name: string; label: string }[];
}) => {
  //! State
  const theme = useTheme();
  const {   setNodes, fitView, getZoom, zoomTo } =
    useReactFlow();
  const handleAddNode = useGet("ADD_NODE");
  const isEditing = useGet("IS_EDITING");
  const mousePos = useRef<{
    clientX: number;
    clientY: number;
  } | null>(null);

  const historyRef = useRef<HistoryRef | null>(null);


  //! Function

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isEditing) return;
      console.log(e);

      if (e.code.toLowerCase() === "keyz" && (e.ctrlKey || e.metaKey)) {
        historyRef.current?.handleChangeHistory &&
          historyRef.current?.handleChangeHistory(1);
      } else if (e.code.toLowerCase() === "keyy" && (e.ctrlKey || e.metaKey)) {
        historyRef.current?.handleChangeHistory &&
          historyRef.current?.handleChangeHistory(-1);
      } else if (e.code.toLowerCase() === "equal" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        zoomTo(getZoom() + 0.1);
      } else if (e.code.toLowerCase() === "minus" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        zoomTo(getZoom() - 0.1);
      } else if (e.code.toLowerCase() === "keyc" && (e.ctrlKey || e.metaKey)) {
        setNodes((nodes) =>
          nodes.map((elm) => {
            if (elm.selected) {
              return {
                ...elm,
                data: {
                  ...elm.data,
                  readyToPaste: true,
                },
              };
            }

            return elm;
          })
        );
      } else if (e.code.toLowerCase() === "keyv" && (e.ctrlKey || e.metaKey)) {
        setNodes((nodes) => {
          const pasteNodes = cloneDeep(nodes)
            .filter((elm) => elm.data?.readyToPaste)
            .map((elm) => {
              const newId = uuid();
              return {
                ...elm,
                id: newId,
                position: {
                  x: elm.position.x + 200,
                  y: elm.position.y - 200,
                },
                data: {
                  ...elm.data,
                  label: `Agent ${newId}`,
                },
              };
            });

          if (isEmpty(pasteNodes)) return nodes;

          return nodes.concat(pasteNodes).map((node) => {
            return {
              ...node,
              selected: false,
              data: {
                ...node.data,
                readyToPaste: false,
              },
            };
          });
        });
      }
    },
    [ handleAddNode, isEditing]
  );

  const handleTrackMouse = useCallback((e: MouseEvent) => {
    mousePos.current = {
      clientX: e.clientX,
      clientY: e.clientY,
    };
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousemove", handleTrackMouse);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousemove", handleTrackMouse);
    };
  }, [handleKeyDown]);

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
        alignItems: "center",
        display: "flex",
        "& .iconBtn": {
          borderRadius: "8px",
          padding: "12px",
          maxWidth: "unset",
          height: "fit-content",
          width: "fit-content",
          background: theme.colors.custom.backgroundCard,
          "&:hover": {
            background: theme.colors.custom.backgroundCardHover,
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: "4px",
          alignItems: "center",
        }}
      >
        <AddNodes listNode={listNode ?? []} />
        <ZoomControl />

        <Box
          sx={{
            height: "25px",
            width: "2px",
            borderRadius: "10px",
            background: theme.colors.custom.normalColorTypo,
            margin: "0 24px",
            opacity: 0.75,
          }}
        />

        <ReArrangeFlow />
        
        <CommonStyles.Button
          isIcon
          onClick={() => fitView()}
          tooltip="Fit view"
          className="iconBtn"
        >
          <FitView />
        </CommonStyles.Button>
      </Box>
      <AnimationControl />

      <Box
        sx={{
          height: "25px",
          width: "2px",
          borderRadius: "10px",
          background: theme.colors.custom.normalColorTypo,
          margin: "0 24px",
          opacity: 0.75,
        }}
      />

      <History innerRef={historyRef} />

      <Box
        sx={{
          height: "25px",
          width: "2px",
          borderRadius: "10px",
          background: theme.colors.custom.normalColorTypo,
          margin: "0 24px",
          opacity: 0.75,
        }}
      />

      <Shortcuts />
    </Box>
  );
};

export default Toolbar;
