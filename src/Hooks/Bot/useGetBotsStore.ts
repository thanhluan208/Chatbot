import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../Providers/AuthenticationProvider";
import { AxiosResponse } from "axios";
import botService from "@/Services/bot.service";

export interface BotStoreResponse {
  status_code: number;
  message: string;
  list_bots: ListBot[];
}

export interface ListBot {
  bot_id: string;
  bot_name: string;
  description: string;
  owner_id: string;
  created_at: Date;
  user_name: string;
  permission_level: string;
  visibility: string;
}

const useGetBotsStore = (isTrigger = true) => {
  const [data, setData] = useState<ListBot[] | []>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();
  const { userId } = useAuth();

  const callApi = useCallback(() => {
    return botService.getBotStore({
      visual_option: "public",
      user_id: userId as string,
    });
  }, [userId]);

  const transformResponse = useCallback(
    (response?: AxiosResponse<BotStoreResponse>) => {
      if (response) {
        setData(response.data.list_bots);
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
  }, [callApi]);

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
  }, [isTrigger, callApi]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};

export default useGetBotsStore;
