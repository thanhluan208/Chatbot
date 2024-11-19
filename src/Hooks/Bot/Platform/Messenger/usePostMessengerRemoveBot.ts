import httpServices from '@/Services/httpServices';
import { AxiosRequestConfig } from 'axios';
import { useMutation } from 'react-query';

export interface PostMessengerRemoveBotParams {
  onSuccess?: (data: PostMessengerRemoveBotFnResponse) => void;
  onError?: (error: unknown) => void;
}

export function usePostMessengerRemoveBot({
  onError,
  onSuccess,
}: PostMessengerRemoveBotParams) {
  return useMutation({
    mutationKey: ['use-post-messenger-remove-bot'],
    mutationFn: async ({ payload, config = {} }: PostMessengerRemoveBotFn) => {
      const url = '';
      const response = (await httpServices.post(
        url,
        payload,
        config
      )) as unknown as PostMessengerRemoveBotFnResponse;
      if (response && response.status_code == 200) {
        return response;
      }
      throw response;
    },
    onError,
    onSuccess,
  });
}

export interface PostMessengerRemoveBotFn {
  payload: PostMessengerRemoveBotPayload;
  config?: AxiosRequestConfig;
}

export interface PostMessengerRemoveBotPayload {
  bot_id: string;
}

export interface PostMessengerRemoveBotFnResponse {
  status_code: number;
}

export interface PostMessengerRemoveBotFnResponse {
  status_code: number;
}
