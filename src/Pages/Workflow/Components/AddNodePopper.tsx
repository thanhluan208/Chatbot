import CommonStyles from "@/Components/CommonStyles";
import { Box, Fade, Popper, PopperPlacementType, SxProps, useTheme } from "@mui/material";
import React from "react";
import { NodeTypes, nodeTypes } from "./AddNodes";
import logo from "@/assets/agent.png";
import CommonIcons from "@/Components/CommonIcons";
import { Node, useReactFlow } from "@xyflow/react";

interface IAddNodePopper {
  open?: boolean;
  anchorEl?: HTMLElement | null;
  listNode: {
    name: string;
    label: string;
    description?: string;
  }[];
  placement?: PopperPlacementType;
  sxContainer?: SxProps;
  isHelperNode?: boolean;
  helperPosition?: { x: number; y: number };
}

const AddNodePopper = (props: IAddNodePopper) => {
  //! State
  const {
    open,
    anchorEl,
    listNode,
    placement,
    sxContainer,
    isHelperNode,
    helperPosition,
  } = props;
  const { setNodes } = useReactFlow();
  const theme = useTheme()

  //! Function
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: keyof typeof nodeTypes
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleAddNode = (node: {
    name: string;
    label: string;
    description?: string;
  }) => {
    if (!setNodes) return;
    setNodes((nodes) => {
      const newNodes = nodes.filter(
        (node) => node.type !== NodeTypes.helperNode
      );
      const lastnode: Node = newNodes[newNodes.length - 1];
      if (lastnode) {
        const position = helperPosition ?? {
          x: lastnode.position.x + (lastnode.measured?.width ?? 200) + 100,
          y: lastnode.position.y,
        };
        const newNode = {
          id: `${node.name}-${newNodes.length}`,
          type: node.name,
          position,
          data: { label: `${node.label} node` },
        };
        newNodes.push(newNode);
      } else {
        const newNode = {
          id: `${node.name}-${newNodes.length}`,
          type: node.name,
          position: helperPosition ?? {
            x: 0,
            y: 0,
          },
          data: { label: `${node.label} node` },
        };
        newNodes.push(newNode);
      }
      console.log("newNodes", newNodes);
      return newNodes;
    });
  };

  //! Render
  return (
    <Popper
      open={!!open}
      anchorEl={anchorEl}
      placement={placement ?? "top-end"}
      transition
      keepMounted={false}
      modifiers={[
        {
          name: "arrow",
          enabled: true,
        },
      ]}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Box
            sx={{
              width: "500px",
              boxShadow: "0 5px 10px rgba(0,0,0,0.2)",
              borderRadius: "12px",
              padding: "10px 20px",
              marginBottom: "20px",
              backdropFilter: "blur(10px)",
              background: theme.colors.custom.backgroundCard,
              ...sxContainer,
            }}
          >
            <CommonStyles.Typography
              type={isHelperNode ? "semiBold12" : "semiBold16"}
              sx={{ marginBottom: "20px" }}
            >
              Drag the node to the canvas, or double click on the canvas to add
              a node
            </CommonStyles.Typography>
            {listNode.map((node) => {
              return (
                <Box
                  key={node.name}
                  onDragStart={(event) =>
                    onDragStart(event, node.name as keyof typeof nodeTypes)
                  }
                  draggable
                  sx={{
                    borderRadius: "8px",
                    border: `1px solid ${theme.palette.primary.main}`,
                    boxShadow:
                      "0 6px 8px 0 rgba(29,28,35,.06),0 0 2px 0 rgba(29,28,35,.18)",
                    padding: "8px 12px",
                    cursor: "grab",
                    backdropFilter: "blur(10px)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          padding: "4px",
                          borderRadius: "8px",
                          background: "#4e40e5",
                        }}
                      >
                        <img
                          src={logo}
                          alt="logo"
                          style={{ width: "16px", height: "16px" }}
                        />
                      </Box>
                      <CommonStyles.Typography
                        type={isHelperNode ? "semiBold12" : "semiBold16"}
                      >
                        {node.label}
                      </CommonStyles.Typography>
                    </Box>
                    <CommonStyles.Typography
                      type={isHelperNode ? "normal10" : "normal16"}
                      sx={{ opacity: 0.5, marginTop: "8px" }}
                    >
                      {node.description}
                    </CommonStyles.Typography>
                  </Box>
                  <CommonStyles.Button
                    variant="outlined"
                    startIcon={<CommonIcons.Add />}
                    sx={{
                      border: `1px solid ${theme.palette.primary.main}`,
                    }}
                    onClick={() => {
                      handleAddNode(node);
                    }}
                  >
                    <CommonStyles.Typography
                      type={isHelperNode ? "semiBold12" : "semiBold16"}
                    >
                      Add
                    </CommonStyles.Typography>
                  </CommonStyles.Button>
                </Box>
              );
            })}
          </Box>
        </Fade>
      )}
    </Popper>
  );
};

export default AddNodePopper;
