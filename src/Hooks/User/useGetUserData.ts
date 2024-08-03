import { useCallback, useEffect, useState } from "react";
import userService from "../../Services/user.service";

export interface UserData {
  id: string;
  user_name: string;
  email: string;
  address: string;
  phone_num: string;
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
      localStorage.setItem("userData", JSON.stringify(response.data.user_data));
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
