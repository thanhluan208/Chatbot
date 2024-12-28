import useMutateKnowledgeFolder from "@/Hooks/Knowledges/useMutateKnowledgeFolder";
import { useAuth } from "@/Providers/AuthenticationProvider";
import { Box, useTheme } from "@mui/material";
import { memo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CommonIcons from "../../../../Components/CommonIcons";
import CommonStyles from "../../../../Components/CommonStyles";

interface ISectionButtonItem {
  title: string;
  permission_level: string;
  id: string;
}

function SectionButtonItem(props: ISectionButtonItem) {
  //! State
  const { permission_level, title, id } = props;
  const theme = useTheme();
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const {botId} = useParams()
  const {userId} = useAuth()

  const isOwner = permission_level.toLowerCase() === "owner";
  const [showAction, setShowAction] = useState(false);

  const { handleAddOrRemoveFolderKnowledge } = useMutateKnowledgeFolder();

  //! Function

  

  const handleNavigate = () => {
    navigate(`${pathname}/knowledge/${id}?isOwner=${isOwner}`);
  };

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      e.stopPropagation();
      e.preventDefault();
      navigator.clipboard.writeText(title);
      setShowAction(false);

      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleRemoveKnowledge = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();

    if(!userId || !botId) return

    handleAddOrRemoveFolderKnowledge.mutate({
      knowledge_storage_ids: [id],
      user_id: userId,
      bot_id: botId,
      isAdd: true,
    })
  }


  //! Render

  return (
    <CommonStyles.Button
      fullWidth
      onClick={handleNavigate}
      onMouseEnter={() => setShowAction(true)}
      onMouseLeave={() => setShowAction(false)}
      sx={{
        gap: "8px",
        color: "#000",
        maxWidth: "unset",
        height: "fit-content",
        justifyContent: "flex-start",
        alignItems: "center",
        textAlign: "left",
        position: "relative",
        overflow: "hidden",
        background: theme.colors.custom.backgroundSecondary,
        border: "solid 1px transparent",
        "&:hover": {
          border: `solid 1px ${theme.palette.primary.main}`,
        },
        "& p": {
          maxWidth: "calc(100vw/7*2 - 86px)",
          textWrap: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
        },
      }}
    >
      <Box>
        <CommonIcons.Topic color="primary" sx={{ width: 36, height: 36 }} />
      </Box>
      <Box>
        <CommonStyles.Typography type="semiBold14">
          {title}
        </CommonStyles.Typography>
        <CommonStyles.Typography
          type="normal12"
          color={theme.colors.custom.normalColorTypo}
        >
          {permission_level}
        </CommonStyles.Typography>
      </Box>
      <Box
        sx={{
          opacity: showAction ? 1 : 0,
          transition: "opacity 0.3s",
          display: "flex",
          position: "absolute",
          alignItems: "center",
          bottom: "0",
          right: "0",
          padding: "0 8px",
          background: "#4e40e50a",
          height: "100%",
          gap: "4px",
          svg: {
            height: "14px",
            width: "14px",
          },
          button: {
            height: "24px",
            width: "24px",
          },
          backdropFilter: "blur(400px)",
        }}
      >
        <CommonStyles.Button
          isIcon
          hasBorder={false}
          tooltip="Copy"
          isRound={false}
          onClick={handleCopy}
        >
          <CommonIcons.ContentCopyOutlined />
        </CommonStyles.Button>
        <CommonStyles.Button
          isIcon
          hasBorder={false}
          tooltip="Remove"
          isRound={false}
          onClick={handleRemoveKnowledge}
        >
          <CommonIcons.Remove />
        </CommonStyles.Button>
      </Box>
    </CommonStyles.Button>
  );
}

export default memo(SectionButtonItem);
