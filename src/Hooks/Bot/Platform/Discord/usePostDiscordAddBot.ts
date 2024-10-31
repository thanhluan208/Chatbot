import httpServices from '@/Services/httpServices';
import { AxiosRequestConfig } from 'axios';
import { useMutation } from 'react-query';

export interface PostDiscordAddBotParams {
  onSuccess?: (data: PostDiscordAddBotFnResponse) => void;
  onError?: (error: unknown) => void;
}

export function usePostDiscordAddBot({
  onError,
  onSuccess,
}: PostDiscordAddBotParams) {
  return useMutation({
    mutationKey: ['use-post-discord-add-bot'],
    mutationFn: async ({ payload, config = {} }: PostDiscordAddBotFn) => {
      const url = '';
      const response = (await httpServices.post(
        url,
        payload,
        config
      )) as unknown as PostDiscordAddBotFnResponse;
      if (response && response.status_code == 200) {
        return response;
      }
      throw response;
    },
    onError,
    onSuccess,
  });
}

export interface PostDiscordAddBotFn {
  payload: PostDiscordAddBotPayload;
  config?: AxiosRequestConfig;
}

export interface PostDiscordAddBotPayload {
  token: string;
  bot_id: string;
}

export interface PostDiscordAddBotFnResponse {
  status_code: number;
}

export interface PostDiscordAddBotFnResponse {
  status_code: number;
}
