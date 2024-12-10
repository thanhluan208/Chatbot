import CommonIcons from "@/Components/CommonIcons";
import FitView from "@/Components/CommonIcons/FitView";
import CommonStyles from "@/Components/CommonStyles";
import cachedKeys from "@/Constants/cachedKeys";
import { useGet, useSave } from "@/Stores/useStore";
import { Box, useTheme } from "@mui/material";
import { useReactFlow } from "@xyflow/react";
import { cloneDeep, isEmpty } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import AddNodes from "./Toolbar/AddNodes";
import AnimationControl from "./Toolbar/AnimationControl";
import ReArrangeFlow from "./Toolbar/ReArrangeFlow";
import Shortcuts from "./Toolbar/Shortcuts";
import ZoomControl from "./Toolbar/ZoomControl";

// const direction = "TB"

export type HistoryRef = {
  handleChangeHistory: (value: number) => void;
};

const Toolbar = ({
  listNode,
}: {
  listNode: { name: string; label?: string; hidden?: boolean }[];
}) => {
  //! State
  const theme = useTheme();
  const save = useSave();
  const { setNodes, fitView, getZoom, zoomTo } = useReactFlow();
  const isEditing = useGet("IS_EDITING");
  const mousePos = useRef<{
    clientX: number;
    clientY: number;
  } | null>(null);

  const [open, setOpen] = useState(true);

  const COLLAPSE_TOOLBAR = useGet("COLLAPSE_TOOLBAR") || !open;
  const collapse = COLLAPSE_TOOLBAR || !open;

  //! Function

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isEditing) return;
      if (e.code.toLowerCase() === "keyz" && (e.ctrlKey || e.metaKey)) {
        // historyRef.current?.handleChangeHistory &&
        //   historyRef.current?.handleChangeHistory(1);
      } else if (e.code.toLowerCase() === "keyy" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        // historyRef.current?.handleChangeHistory &&
        //   historyRef.current?.handleChangeHistory(-1);
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
    [isEditing, setNodes, getZoom, zoomTo]
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
  }, [handleKeyDown, handleTrackMouse]);

  //! Render
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: "10px",
        right: "250px",
        border: `solid 1px ${theme.colors.custom.borderColor}`,
        width: !collapse ? "850px" : "68px",
        transition: "width 0.5s ease",
        overflow: "hidden",
        background: theme.colors.custom.background,
        padding: !collapse ? "10px 20px" : "10px 20px 10px 0",
        boxShadow: "0 5px 10px rgba(0,0,0,0.2)",
        borderRadius: "12px",
        alignItems: "center",
        display: "flex",
        justifyContent: "end",
        "& .iconBtn": {
          borderRadius: "8px",
          margin: "0 4px",
          maxWidth: "unset",
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

      {/* <History innerRef={historyRef} /> */}

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

      <CommonStyles.Button
        isIcon
        isRound={false}
        onClick={() =>
          setOpen(() => {
            if (collapse) {
              save(cachedKeys.COLLAPSE_TOOLBAR, false);
              return true;
            } else {
              save(cachedKeys.COLLAPSE_TOOLBAR, true);
              return false;
            }
          })
        }
        sx={{
          transform: !collapse
            ? "translateX(0) rotate(180deg)"
            : "translateX(10px) rotate(0deg)",
          transition: "transform 0.3s",
        }}
        className="iconBtn"
      >
        <CommonIcons.KeyboardDoubleArrowLeft />
      </CommonStyles.Button>
    </Box>
  );
};

export default Toolbar;
