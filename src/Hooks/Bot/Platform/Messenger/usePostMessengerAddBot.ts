import httpServices from '@/Services/httpServices';
import { AxiosRequestConfig } from 'axios';
import { useMutation } from 'react-query';

export interface PostMessengerAddBotParams {
  onSuccess?: (data: PostMessengerAddBotFnResponse) => void;
  onError?: (error: unknown) => void;
}

export function usePostMessengerAddBot({
  onError,
  onSuccess,
}: PostMessengerAddBotParams) {
  return useMutation({
    mutationKey: ['use-post-messenger-add-bot'],
    mutationFn: async ({ payload, config = {} }: PostMessengerAddBotFn) => {
      const url = '';
      const response = (await httpServices.post(
        url,
        payload,
        config
      )) as unknown as PostMessengerAddBotFnResponse;
      if (response && response.status_code == 200) {
        return response;
      }
      throw response;
    },
    onError,
    onSuccess,
  });
}

export interface PostMessengerAddBotFn {
  payload: PostMessengerAddBotPayload;
  config?: AxiosRequestConfig;
}

export interface PostMessengerAddBotPayload {
  page_id: string;
  page_access_token: string;
  app_secret_key: string;
  bot_id: string;
}

export interface PostMessengerAddBotFnResponse {
  status_code: number;
}

export interface PostMessengerAddBotFnResponse {
  status_code: number;
}
