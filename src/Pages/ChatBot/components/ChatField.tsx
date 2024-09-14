import { useGet } from "@/Stores/useStore";
import ChatBox from "./ChatBox";
import { Box } from "@mui/material";
import useGetBotChatHistory from "@/Hooks/Bot/useGetBotChatHistory";
import { useParams } from "react-router-dom";
import { TextBoxType } from "./TextBox";
import { useMemo } from "react";

export interface Chat {
  id: string;
  avatar: string;
  name: string;
  type?: TextBoxType;
  content?: string;
  isByRole?: boolean;
}

const ChatField = () => {
  //! State
  const listChat: Chat[] = useGet("LIST_CHAT") || [];
  const params = useParams();
  const botId = params.botId;

  const { data } = useGetBotChatHistory(botId as string, !!botId);


console.log('data',data)
  const renderChats = useMemo(() => {
    return [...(data || []), ...listChat];
  }, [data, listChat]);

  //! Function

  //! Render
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {renderChats.map((item) => {
        return (
          <ChatBox
            id={item.id}
            avatar={item.avatar}
            name={item.name}
            key={item.id}
            type={item.type}
            content={item.content}
            isByRole={item.isByRole}
          />
        );
      })}
    </Box>
  );
};

export default ChatField;
