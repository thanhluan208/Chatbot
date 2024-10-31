import httpServices from '@/Services/httpServices';
import { AxiosRequestConfig } from 'axios';
import { useMutation } from 'react-query';

export interface PostDiscordRemoveBotParams {
  onSuccess?: (data: PostDiscordRemoveBotFnResponse) => void;
  onError?: (error: unknown) => void;
}

export function usePostDiscordRemoveBot({
  onError,
  onSuccess,
}: PostDiscordRemoveBotParams) {
  return useMutation({
    mutationKey: ['use-post-discord-remove-bot'],
    mutationFn: async ({ payload, config = {} }: PostDiscordRemoveBotFn) => {
      const url = '';
      const response = (await httpServices.post(
        url,
        payload,
        config
      )) as unknown as PostDiscordRemoveBotFnResponse;
      if (response && response.status_code == 200) {
        return response;
      }
      throw response;
    },
    onError,
    onSuccess,
  });
}

export interface PostDiscordRemoveBotFn {
  payload: PostDiscordRemoveBotPayload;
  config?: AxiosRequestConfig;
}

export interface PostDiscordRemoveBotPayload {
  bot_id: string;
}

export interface PostDiscordRemoveBotFnResponse {
  status_code: number;
}

export interface PostDiscordRemoveBotFnResponse {
  status_code: number;
}
