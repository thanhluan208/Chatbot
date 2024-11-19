import { Box, useTheme } from "@mui/material";
import CommonStyles from "../../../../../Components/CommonStyles";
import moment from "moment";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DeleteKnowledge from "./DeleteKnowledge";
import { toast } from "react-toastify";
import httpServices from "../../../../../Services/httpServices";
import {
  removeKnowledgeFromBot,
  updateKnowledgeToBot,
} from "../../../../../Constants/api";
import { useMemo } from "react";
import { useAuth } from "@/Providers/AuthenticationProvider";
import { useQueryClient } from "react-query";
import queryKey from "@/Constants/queryKey";

export interface IKnowledgeFolder {
  id?: string;
  title?: string;
  description?: string;
  size: string;
  quantity: string;
  createdAt: string;
  sharingWithBots?: string[];
  userName?: string;
  owner_id?: string;
  permission_level?: string;
  avatar: string;
  enableButton?: boolean;
  handleMutate?: (knowledgeFolderId: string) => void;
}

const KnowledgeFolder = (props: IKnowledgeFolder) => {
  //! State
  const {
    title,
    description,
    size,
    quantity,
    createdAt,
    id,
    sharingWithBots,
    owner_id,
    permission_level,
    avatar,
    enableButton,
    handleMutate,
  } = props;
  const navigate = useNavigate();
  const theme = useTheme();
  const pathname = useLocation().pathname;
  const params = useParams();
  const botId = params.botId;
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  const isOwner = useMemo(() => {
    if (userId === owner_id) {
      return true;
    }

    return false;
  }, [userId, owner_id, permission_level]);

  const isSharing = useMemo(() => {
    if (botId && sharingWithBots?.includes(botId)) {
      return true;
    }

    return false;
  }, [botId, sharingWithBots]);

  //! Function
  const handleAddKnowledgeToBot = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    if (!botId || !id || !userId) return;

    const toastId = toast.loading("Adding knowledge to bot...", {
      isLoading: true,
      autoClose: false,
    });

    try {
      await httpServices.axios.post(updateKnowledgeToBot, {
        user_id: userId,
        bot_id: botId,
        knowledge_storage_ids: [id],
      });

      queryClient.invalidateQueries({
        queryKey: [queryKey.KNOWLEDGE_FOLDER_LIST],
      });

      toast.update(toastId, {
        render: "Added knowledge to bot successfully!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error) {
      toast.update(toastId, {
        render: "Failed to add knowledge to bot!",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  const handleRemoveKnowledgeFromBot = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    if (!botId || !id || !userId) return;

    const toastId = toast.loading("Removing knowledge from bot...", {
      isLoading: true,
      autoClose: false,
    });

    try {
      await httpServices.axios.post(removeKnowledgeFromBot, {
        user_id: userId,
        bot_id: botId,
        knowledge_storage_ids: [id],
      });

      queryClient.invalidateQueries({
        queryKey: [queryKey.KNOWLEDGE_FOLDER_LIST],
      });

      toast.update(toastId, {
        render: "Removed knowledge from bot successfully!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error) {
      toast.update(toastId, {
        render: "Failed to remove knowledge from bot!",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  //! Render

  return (
    <Box
      onClick={() => {
        if (id) {
          navigate(`${pathname}/knowledge/${id}?isOwner=${isOwner}`);
        }
      }}
      className="knowledge-folder"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px",
        borderRadius: "8px",
        cursor: "pointer",
        background: theme.colors.custom.backgroundCard,
        border: "1px solid transparent",
        "&:hover": {
          border: `1px solid ${theme.palette.primary.main}`,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <img
          src={avatar}
          alt="avatar"
          style={{ width: "36px", height: "36px", borderRadius: "8px" }}
        />
        <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <CommonStyles.Typography type="bold14">
            {title || "Anonymous folder"}
          </CommonStyles.Typography>
          <CommonStyles.Typography type="normal14">
            {description || "--"}
          </CommonStyles.Typography>
          <Box sx={{ display: "flex", flexDirection: "row", gap: "8px" }}>
            <CommonStyles.Chip label={size || "0 Byte"} />
            <CommonStyles.Chip label={`${quantity || 0} Data(s)`} />
          </Box>
          <CommonStyles.Typography type="normal12" color="#1c1f2366">
            Creation time {createdAt || moment().format("DD/MM/YYYY HH:mm")}
          </CommonStyles.Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: "8px",
        }}
      >
        {(botId || enableButton) && (
          <CommonStyles.Button
            variant="outlined"
            onClick={
              !!handleMutate
                ? (e) => {
                    e.stopPropagation();
                    handleMutate(id || "");
                  }
                : isSharing
                ? handleRemoveKnowledgeFromBot
                : handleAddKnowledgeToBot
            }
          >
            {isSharing ? "Remove" : "Add"}
          </CommonStyles.Button>
        )}
        {isOwner && <DeleteKnowledge data={props} />}
      </Box>
    </Box>
  );
};

export default KnowledgeFolder;
