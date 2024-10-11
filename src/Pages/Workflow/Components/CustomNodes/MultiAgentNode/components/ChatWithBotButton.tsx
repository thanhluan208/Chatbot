import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import cachedKeys from "@/Constants/cachedKeys";
import { useSave } from "@/Stores/useStore";
import { useTheme } from "@mui/material";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";

interface ChatWithBotButtonProps {
  isCurrentNode: boolean;
  positionAbsoluteX: number;
  positionAbsoluteY: number;
  data: {
    [key: string]: unknown;
  };
  botId: string;
}

const ChatWithBotButton = ({
  isCurrentNode,
  data,
  positionAbsoluteX,
  positionAbsoluteY,
  botId,
}: ChatWithBotButtonProps) => {
  //! State
  const theme = useTheme();
  const save = useSave();
  const { setCenter, getNodes, updateNode } = useReactFlow();

  //! Function
  const handleChatWithBot = useCallback(() => {
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
  }, [botId, updateNode, data, positionAbsoluteX, positionAbsoluteY]);

  //! Render
  return (
    <CommonStyles.Button
      isIcon
      isRound={false}
      tooltip={isCurrentNode ? "Chatting..." : "Chat with this bot"}
      onClick={handleChatWithBot}
    >
      <CommonIcons.Chat fill={theme.colors.custom.normalColorTypo as string} />
    </CommonStyles.Button>
  );
};

export default ChatWithBotButton;
