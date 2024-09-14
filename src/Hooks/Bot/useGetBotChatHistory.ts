import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../Providers/AuthenticationProvider";
import botService from "../../Services/bot.service";
import { AxiosResponse } from "axios";
import { v4 as uuid } from "uuid";
import { Chat } from "@/Pages/ChatBot/components/ChatField";
import { TextBoxType } from "@/Pages/ChatBot/components/TextBox";

export interface HistoryChat {
  role: Role;
  content: string;
  additional_kwargs: AdditionalKwargs;
}

export interface AdditionalKwargs {}

export enum Role {
  Assistant = "assistant",
  User = "user",
}

interface Response {
  history_dialog: HistoryChat[];
  message: string;
  status: number;
}

const useGetBotChatHistory = (
  payload: { botId: string; conversationId?: string },
  isTrigger = true
) => {
  const [data, setData] = useState<Chat[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();
  const { userId } = useAuth();

  const callApi = useCallback(() => {
    if (!userId || !payload?.botId) return;

    return botService.getBotChatHistory({
      bot_id: payload?.botId,
      user_id: userId,
      platform: "Alphii",
      conversation_id: payload?.conversationId || undefined,
    });
  }, [userId, payload?.botId, payload?.conversationId]);

  const transformResponse = useCallback(
    (response?: AxiosResponse<Response>) => {
      if (response) {
        setData(
          response.data.history_dialog.map((item) => {
            return {
              id: uuid(),
              avatar: "",
              name: item.role,
              content: item.content,
              isByRole: true,
              type:
                item.role === Role.Assistant
                  ? TextBoxType.BOT_CHAT
                  : TextBoxType.USER_CHAT,
            };
          })
        );
      }
    },
    []
  );

  const refetch = useCallback(async () => {
    try {
      const response = await callApi();
      transformResponse(response);
    } catch (error: any) {
      setError(error);
    }
  }, []);

  useEffect(() => {
    let shouldSetData = true;

    if (isTrigger) {
      (async () => {
        try {
          setLoading(true);
          const response = await callApi();

          if (shouldSetData) {
            transformResponse(response);
          }
        } catch (error: any) {
          setError(error);
        } finally {
          setLoading(false);
        }
      })();

      return () => {
        shouldSetData = false;
      };
    }
  }, [isTrigger]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};

export default useGetBotChatHistory;
