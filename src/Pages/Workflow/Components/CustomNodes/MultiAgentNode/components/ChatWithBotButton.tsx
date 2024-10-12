import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import { changeCurrentNode } from "@/Constants/api";
import cachedKeys from "@/Constants/cachedKeys";
import { useAuth } from "@/Providers/AuthenticationProvider";
import httpServices from "@/Services/httpServices";
import { useSave } from "@/Stores/useStore";
import { CircularProgress, useTheme } from "@mui/material";
import { useReactFlow } from "@xyflow/react";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

interface ChatWithBotButtonProps {
  isCurrentNode: boolean;
  positionAbsoluteX: number;
  positionAbsoluteY: number;
  data: {
    [key: string]: unknown;
  };
  botId: string;
  nodeId: string;
}

const ChatWithBotButton = ({
  isCurrentNode,
  data,
  positionAbsoluteX,
  positionAbsoluteY,
  botId,
  nodeId,
}: ChatWithBotButtonProps) => {
  //! State
  const theme = useTheme();
  const save = useSave();
  const { setCenter, getNodes, updateNode } = useReactFlow();
  const [loading, setLoading] = useState(false);

  const { userId } = useAuth();

  //! Function
  const handleChatWithBot = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      !isCurrentNode &&
        (await httpServices.post(changeCurrentNode, {
          user_id: userId,
          bot_id: botId,
          selected_node_id: nodeId,
        }));
      save(cachedKeys.OPEN_CHAT, true);
      save(cachedKeys.COLLAPSE_TOOLBAR, true);
      setCenter(positionAbsoluteX + 1100, positionAbsoluteY + 550, {
        zoom: 0.55,
        duration: 1,
      });
      const currentNode = getNodes().find((node) => node.data?.currentNode);
      if (currentNode) {
        updateNode(currentNode.id, {
          data: {
            ...currentNode.data,
            currentNode: false,
          },
        });
      }

      updateNode(botId, {
        data: {
          ...data,
          currentNode: true,
        },
      });
      setLoading(false);
    } catch (error) {
      toast.error("Failed to chat with bot. Please try again later.");
      setLoading(false);
    }
  }, [botId, updateNode, data, positionAbsoluteX, positionAbsoluteY]);

  //! Render
  return (
    <CommonStyles.Button
      isIcon
      isRound={false}
      hasBorder={false}
      tooltip={isCurrentNode ? "Chatting..." : "Chat with this bot"}
      onClick={handleChatWithBot}
    >
      {loading ? (
        <CircularProgress size={16} />
      ) : (
        <CommonIcons.Chat
          fill={theme.colors.custom.normalColorTypo as string}
        />
      )}
    </CommonStyles.Button>
  );
};

export default ChatWithBotButton;
