import CommonStyles from "@/Components/CommonStyles";
import { Box, useTheme } from "@mui/material";
import { NodeProps, useReactFlow } from "@xyflow/react";
import { ComponentPropsWithoutRef, useMemo } from "react";
import UpdateNodePos from "./UpdateNodePos";

const GradientBorder = ({
  data,
  selected,
  id,
  children,
  className,
}: NodeProps & ComponentPropsWithoutRef<"div">) => {
  const theme = useTheme();
  const { updateNode } = useReactFlow();

  const classname = useMemo(() => {
    if (data?.currentNode && data?.startNode) return "chatting-start";
    else if (data?.currentNode && !data?.startNode) return "agent-chatting";
    else if (data?.startNode) return "start-node";
    else return "agent-node";
  }, [data?.currentNode, data?.startNode]);

  return (
    <Box
      className={className}
      sx={{
        display: "flex",
        borderRadius: "8px",
        padding: "2px",
        transition: "all 0.5s ease",
        position: "relative",
      }}
    >
      <UpdateNodePos id={id} />
      {(!!data?.currentNode || !!data?.startNode) && (
        <Box
          sx={{
            position: "absolute",
            top: "-50px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {!!data?.currentNode && (
            <Box
              sx={{
                background: `${theme.palette.success.main}`,
                borderRadius: "12px",
                padding: "4px 12px",
              }}
            >
              <CommonStyles.Typography type="semiBold16" color="#fff">
                Chatting...
              </CommonStyles.Typography>
            </Box>
          )}
          {!!data?.startNode && (
            <Box
              sx={{
                background: `${theme.palette.secondary.main}`,
                borderRadius: "12px",
                padding: "4px 12px",
              }}
            >
              <CommonStyles.Typography type="semiBold16" color="#fff">
                Start node
              </CommonStyles.Typography>
            </Box>
          )}
        </Box>
      )}
      <Box
        sx={{
          borderRadius: "8px",
          position: "relative",
          padding: "2px",
          minWidth: data?.currentNode && selected ? "800px" : "500px",
          transition: "width 0.5s ease, height 0.5s ease",
          overflow: "hidden",
          display: "flex",
          boxShadow:
            "0 0 8px 0 rgba(29,28,35,.06),0 0 2px 0 rgba(29,28,35,.18)",
          "&:hover": {
            boxShadow: "0 0 1px rgba(0,0,0,.3),0 4px 14px rgba(0,0,0,.1)",
          },
          borderColor: theme.colors.custom.borderColor,
        }}
        className={classname}
        onClick={() => {
          const updates: any = {
            selected: true,
            readyToPaste: true,
          };
          updateNode(id, {
            data: {
              ...data,
              ...updates,
            },
          });
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            position: "relative",
            background: theme.colors.custom.backgroundCard,
            borderRadius: "8px",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default GradientBorder;
