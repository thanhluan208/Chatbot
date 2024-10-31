import httpServices from '@/Services/httpServices';
import { AxiosRequestConfig } from 'axios';
import { useMutation } from 'react-query';

export interface PostTelegramRemoveBotParams {
  onSuccess?: (data: PostTelegramRemoveBotFnResponse) => void;
  onError?: (error: unknown) => void;
}

export function usePostTelegramRemoveBot({
  onError,
  onSuccess,
}: PostTelegramRemoveBotParams) {
  return useMutation({
    mutationKey: ['use-post-telegram-remove-bot'],
    mutationFn: async ({ payload, config = {} }: PostTelegramRemoveBotFn) => {
      const url = '';
      const response = (await httpServices.post(
        url,
        payload,
        config
      )) as unknown as PostTelegramRemoveBotFnResponse;
      if (response && response.status_code == 200) {
        return response;
      }
      throw response;
    },
    onError,
    onSuccess,
  });
}

export interface PostTelegramRemoveBotFn {
  payload: PostTelegramRemoveBotPayload;
  config?: AxiosRequestConfig;
}

export interface PostTelegramRemoveBotPayload {
  bot_id: string;
}

export interface PostTelegramRemoveBotFnResponse {
  status_code: number;
}

export interface PostTelegramRemoveBotFnResponse {
  status_code: number;
}
