import { useCallback, useEffect, useState } from "react";
import userService from "../../Services/user.service";
import { AxiosResponse } from "axios";

export interface ListUserResponse {
    status_code: number;
    message:     string;
    list_user:   ListUser[];
}

export interface ListUser {
    user_id:   string;
    user_name: string;
}


const useGetListUser = (search?: string, isTrigger = true) => {
  const [data, setData] = useState<ListUser[] | []>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();

  const callApi = useCallback(() => {
    return userService.getListUser(search);
  }, [search]);


  const transformResponse = useCallback((response?: AxiosResponse<ListUserResponse>) => {
    if (response) {
      setData(response.data.list_user);
    }
  }, []);

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
  }, [isTrigger,callApi]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};

export default useGetListUser;
