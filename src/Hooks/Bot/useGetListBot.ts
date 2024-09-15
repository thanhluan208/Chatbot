import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../Providers/AuthenticationProvider";
import botService from "../../Services/bot.service";

export interface Bot {
  bot_id: string;
  bot_name: string;
  description: string;
}

const useGetListBot = (isTrigger = true) => {
  const [data, setData] = useState<Bot[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();
  const { userId } = useAuth();

  const callApi = useCallback(() => {
    if (!userId) return;
    return botService.getBotStore({
      user_id: userId,
      visual_option: "shared",
    });
  }, [userId]);

  const transformResponse = useCallback((response: any) => {
    if (response) {
      setData(response.data.list_bots);
    }
  }, []);

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

export default useGetListBot;
