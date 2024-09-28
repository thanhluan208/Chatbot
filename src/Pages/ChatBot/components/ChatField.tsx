import { useGet, useSave } from "@/Stores/useStore";
import ChatBox from "./ChatBox";
import { Box } from "@mui/material";
import useGetBotChatHistory from "@/Hooks/Bot/useGetBotChatHistory";
import { useParams } from "react-router-dom";
import { TextBoxType } from "./TextBox";
import { useEffect, useMemo } from "react";
import cachedKeys from "@/Constants/cachedKeys";
import { BotData } from "@/Hooks/Bot/useGetBotData";

export interface Chat {
  id: string;
  avatar: string;
  name: string;
  type?: TextBoxType;
  content?: string;
  isByRole?: boolean;
}

interface IChatField {
  setIsBrandNew: React.Dispatch<React.SetStateAction<boolean>>;
  isBrandNew: boolean;
}

const ChatField = (props: IChatField) => {
  //! State
  const { setIsBrandNew, isBrandNew } = props;
  const listChat: Chat[] = useGet("LIST_CHAT") || [];
  const botData: BotData = useGet("BOT_DATA");
  const params = useParams();
  const botId = params?.botId;

  const query = new URLSearchParams(window.location.search);
  const conversationId = query.get("conversation");
  const save = useSave();

  const payload = useMemo(() => {
    if (!botId || !botData?.all_conversation?.[0] || !botData?.mode) return;
    return {
      botId,
      conversationId: botData?.all_conversation?.[0],
      platform: botData?.mode,
    };
  }, [botId, conversationId, botData?.mode, botData?.all_conversation?.[0]]);

  const { data, refetch } = useGetBotChatHistory(
    payload as {
      botId: string;
      conversationId: string;
      platform: string;
    },
    !!payload?.botId
  );

  const renderChats = useMemo(() => {
    return [...(data || []), ...listChat];
  }, [data, listChat]);

  //! Function
  useEffect(() => {
    if (!isBrandNew && data?.length === 0 && listChat.length === 0) {
      setIsBrandNew(true);
      return;
    }
    if (isBrandNew && data?.length > 0) {
      setIsBrandNew(false);
    }
  }, [data, isBrandNew, listChat]);

  useEffect(() => {
    save(cachedKeys.REFETCH_LIST_CHAT, refetch);
  }, [save]);

  useEffect(() => {
    return () => {
      save(cachedKeys.LIST_CHAT, null);
    };
  }, []);

  useEffect(() => {
    if (renderChats.length === 0) {
      save(cachedKeys.IS_BRANDNEW_CHAT, true);
    } else {
      save(cachedKeys.IS_BRANDNEW_CHAT, false);
    }
  }, [renderChats]);

  //! Render
  if (isBrandNew) return null;

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
