import { useCallback, useEffect, useState } from "react";
import userService from "../../Services/user.service";

export interface UserData {
  activate: string;
  credits: number;
  current_plan: string;
  display_name: string;
  email: string;
  favorites: Favorites;
  last_login: number;
  next_plan: string;
  phone_num: string;
  stars: Favorites;
  time_end: number;
  time_start: number;
  usage_information: UsageInformation;
  user_id: string;
  avatar_url: string;
  background_url: string;
}

export interface Favorites {
  agents: any[];
  workflows: any[];
}

export interface UsageInformation {
  in_month: { [key: string]: In };
  in_day: { [key: string]: In };
  in_minute: { [key: string]: In };
}

export interface In {
  credits_used: number;
  requests_used: number;
  tokens_used: number;
}

const useGetUserData = (userId: string | null, isTrigger = true) => {
  const [data, setData] = useState<UserData | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();

  const callApi = useCallback(() => {
    if (!userId) return;
    return userService.getUserData(userId);
  }, [userId]);

  const transformResponse = useCallback((response: any) => {
    if (response) {
      setData(response.data.user_data);
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

export default useGetUserData;
