import { Box } from "@mui/material";
import CommonIcons from "../../../../../Components/CommonIcons";
import CommonStyles from "../../../../../Components/CommonStyles";
import moment from "moment";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DeleteKnowledge from "./DeleteKnowledge";
import { toast } from "react-toastify";
import { useGet } from "../../../../../Stores/useStore";
import httpServices from "../../../../../Services/httpServices";
import {
  removeKnowledgeFromBot,
  updateKnowledgeToBot,
} from "../../../../../Constants/api";
import { useMemo } from "react";

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
  } = props;
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const params = useParams();
  const botId = params.botId;
  const userId = params.id;

  const isOwner = useMemo(() => {
    if (userId === owner_id) {
      return true;
    }

    return false;
  }, [userId, owner_id]);

  const isSharing = useMemo(() => {
    if (botId && sharingWithBots?.includes(botId)) {
      return true;
    }

    return false;
  }, [botId, sharingWithBots]);

  const refetchListFolder = useGet("REFETCH_FOLDER_KNOWLEDGE");

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

      await refetchListFolder?.();

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

      await refetchListFolder?.();

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
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px",
        borderRadius: "8px",
        cursor: "pointer",
        "&:hover": {
          background: "#2e2f380d",
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
        <Box>
          <CommonIcons.Topic color="primary" sx={{ width: 36, height: 36 }} />
        </Box>
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
        <CommonStyles.Button
          variant="outlined"
          onClick={
            isSharing ? handleRemoveKnowledgeFromBot : handleAddKnowledgeToBot
          }
        >
          {isSharing ? "Remove" : "Add"}
        </CommonStyles.Button>
        <DeleteKnowledge data={props} />
      </Box>
    </Box>
  );
};

export default KnowledgeFolder;
