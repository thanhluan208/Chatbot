import httpServices from "@/Services/httpServices";
import { useMutation } from "react-query";

interface PostTelegramAddBotParams {
  onSuccess?:
    | ((
        data: PostTelegramAddBotResponse,
        variables: PostTelegramAddBotFn,
        context: unknown
      ) => Promise<unknown> | unknown)
    | undefined;
  onError?:
    | ((
        error: Error,
        variables: PostTelegramAddBotFn,
        context: unknown
      ) => Promise<unknown> | unknown)
    | undefined;
}

export const usePostTelegramAddBot = ({
  onError,
  onSuccess,
}: PostTelegramAddBotParams) => {
  return useMutation({
    mutationKey: ['delete-note-preview'],
    mutationFn: async ({ preview_id }: PostTelegramAddBotFn) => {
      const url = `note/preview/${preview_id}`;

      const response = await httpServices.axios.delete<any,PostTelegramAddBotResponse>(url).json<PostTelegramAddBotResponse>();

      if (response && response.status_code === 200) {
        return response;
      }
      throw response;
    },
    // onError,
    // onSuccess,
  });
};

export interface PostTelegramAddBotFn {
    preview_id: number;
}


export interface PostTelegramAddBotResponse {
  status_code: number;
}
export interface PostTelegramAddBotError {
  status_code: number;
  message: string;
}
