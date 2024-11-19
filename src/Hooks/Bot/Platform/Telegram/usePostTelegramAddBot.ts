import httpServices from '@/Services/httpServices';
import { AxiosRequestConfig } from 'axios';
import { useMutation } from 'react-query';

export interface PostTelegramAddBotParams {
  onSuccess?: (data: PostTelegramAddBotFnResponse) => void;
  onError?: (error: unknown) => void;
}

export function usePostTelegramAddBot({
  onError,
  onSuccess,
}: PostTelegramAddBotParams) {
  return useMutation({
    mutationKey: ['use-post-telegram-add-bot'],
    mutationFn: async ({ payload, config = {} }: PostTelegramAddBotFn) => {
      const url = '';
      const response = (await httpServices.post(
        url,
        payload,
        config
      )) as unknown as PostTelegramAddBotFnResponse;
      if (response && response.status_code == 200) {
        return response;
      }
      throw response;
    },
    onError,
    onSuccess,
  });
}

export interface PostTelegramAddBotFn {
  payload: PostTelegramAddBotPayload;
  config?: AxiosRequestConfig;
}

export interface PostTelegramAddBotPayload {
  token: string;
  bot_id: string;
}

export interface PostTelegramAddBotFnResponse {
  status_code: number;
}

export interface PostTelegramAddBotFnResponse {
  status_code: number;
}
