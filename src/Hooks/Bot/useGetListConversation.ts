import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../Providers/AuthenticationProvider";
import botService from "../../Services/bot.service";
import { AxiosResponse } from "axios";
import moment from "moment";
import { isArray } from "lodash";

export interface Response {
  status_code: number;
  message: string;
  result: Result[];
}

export interface Result {
  conversation_id: string;
  bot_id: string;
  user_id: string;
  platform: string;
  created_at: Date;
}

export interface Conversation {
  [key: string]: {
    date: string;
    conversations: {
      id: string;
      createdAt: Date;
    }[];
  };
}

const useGetListConversation = (botId: string, isTrigger = true) => {
  const [data, setData] = useState<Conversation>({});
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();
  const { userId } = useAuth();

  const callApi = useCallback(() => {
    if (!userId) return;
    return botService.getListConversation({
      bot_id: botId,
      user_id: userId,
    });
  }, [userId]);

  const transformResponse = useCallback(
    (response?: AxiosResponse<Response>) => {
      if (response && isArray(response.data.result)) {
        const conversationGroupedByDate: Conversation = {};

        for (const conversation of response.data.result) {
          const date = moment(conversation.created_at).format("YYYY-MM-DD");

          if (!conversationGroupedByDate[date]) {
            conversationGroupedByDate[date] = {
              date,
              conversations: [],
            };
          }

          conversationGroupedByDate[date].conversations.push({
            id: conversation.conversation_id,
            createdAt: conversation.created_at,
          });
        }

        setData(conversationGroupedByDate);
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

export default useGetListConversation;
