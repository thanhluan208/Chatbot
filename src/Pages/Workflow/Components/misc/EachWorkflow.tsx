import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import { useAuth } from "@/Providers/AuthenticationProvider";
import { useGet } from "@/Stores/useStore";
import { Workflow } from "@/Types/workflow";
import { Box, useTheme } from "@mui/material";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import MoreOption from "./MoreOption";
import { ListRoutes } from "@/Constants/routes";

const EachWorkflow = (props: Workflow) => {
  //! State
  const navigate = useNavigate();
  const theme = useTheme();
  const { userData } = useAuth();
  const { workflow_id, workflow_name, description, avatar_url } = props;
  const openDialog = useGet("OPEN_DIALOG");

  //! Function
  const handleClick = (e: any) => {
    if (openDialog) return;
    e.stopPropagation();
    navigate(ListRoutes.workflowDetail(workflow_id));
  };

  //! Render
  return (
    <Box
      className="botCard"
      onClick={handleClick}
      sx={{
        color: "unset",
        padding: "16px",
        maxWidth: "400px",
        background: theme.colors.custom.backgroundCard,
        boxShadow: "0px 2px 4px 0px #1E1E1F0A",
        borderRadius: "12px",
        transition: "all 0.3s",
        cursor: "pointer",
        border: `solid 1px ${theme.colors.custom.borderColor}`,
        ".btnGroup": {
          display: "none",

          "& button": {
            borderRadius: "8px",
          },
        },
        "&:hover": {
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          background: theme.colors.custom.backgroundCard,
          ".btnGroup": {
            display: "flex",
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
        }}
      >
        <Box
          sx={{
            flex: 5,
          }}
        >
          <CommonStyles.Typography type="semiBold16">
            {workflow_name}
          </CommonStyles.Typography>
          <CommonStyles.Typography
            color={theme.colors.custom.normalColorTypo}
            sx={{
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              display: "-webkit-box",
              paddingRight: "20px",
              textAlign: "justify",
              marginTop: "8px",
            }}
          >
            {description}
          </CommonStyles.Typography>
        </Box>
        <Box>
          <img
            src={
              avatar_url ??
              "https://p16-flow-product-sign-sg.ibyteimg.com/tos-alisg-i-bfte7mpw5s-sg/9c9ef4e4c6f147339c0cae1408bb1f46~tplv-bfte7mpw5s-resize:128:128.image?rk3s=2e2596fd&x-expires=1727594320&x-signature=VTZfu6FleEdw6gvUsvvssaBeyLg%3D"
            }
            alt={""}
            style={{
              width: "75px",
              height: "75px",
              borderRadius: "8px",
              objectFit: "cover",
            }}
          />
        </Box>
      </Box>
      <Box display={"flex"}>
        <Box flex={5}>
          <Box mt={1} display={"flex"}>
            <CommonStyles.Typography
              type="normal12"
              color={theme.colors.custom.normalColorTypo}
            >
              GPT-4 (8k)
            </CommonStyles.Typography>
            <CommonIcons.Circle
              sx={{
                width: "3px",
                height: "3px",
                margin: "auto 8px",
                color: theme.colors.custom.normalColorTypo,
              }}
            />
            <CommonStyles.Typography
              type="normal12"
              color={theme.colors.custom.normalColorTypo}
            >
              Edited {moment(props?.created_at).format("HH:mm")}
            </CommonStyles.Typography>
          </Box>
          <Box
            mt={1}
            sx={{ display: "flex", gap: "8px", alignItems: "center" }}
          >
            <CommonStyles.Typography
              sx={{
                maxWidth: "150px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                textWrap: "nowrap",
              }}
            >
              {userData?.display_name}
            </CommonStyles.Typography>
            <CommonStyles.Typography
              color={theme.colors.custom.normalColorTypo}
              sx={{
                maxWidth: "200px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                textWrap: "nowrap",
              }}
            >
              {userData?.email ? `@${userData?.email}` : "-"}
            </CommonStyles.Typography>
          </Box>
        </Box>
        <Box
          flex={2}
          display={"flex"}
          gap={"8px"}
          sx={{
            alignItems: "end",
            justifyContent: "flex-end",
          }}
        >
          <MoreOption workflow={{ ...props }} />
        </Box>
      </Box>
    </Box>
  );
};

export default EachWorkflow;
