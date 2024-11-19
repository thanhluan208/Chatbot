import httpServices from '@/Services/httpServices';
import { AxiosRequestConfig } from 'axios';
import { useMutation } from 'react-query';

export interface PostDiscordGetBotConfigurationParams {
  onSuccess?: (data: PostDiscordGetBotConfigurationFnResponse) => void;
  onError?: (error: unknown) => void;
}

export function usePostDiscordGetBotConfiguration({
  onError,
  onSuccess,
}: PostDiscordGetBotConfigurationParams) {
  return useMutation({
    mutationKey: ['use-post-discord-get-bot-configuration'],
    mutationFn: async ({
      payload,
      config = {},
    }: PostDiscordGetBotConfigurationFn) => {
      const url = '';
      const response = (await httpServices.post(
        url,
        payload,
        config
      )) as unknown as PostDiscordGetBotConfigurationFnResponse;
      if (response && response.status_code == 200) {
        return response;
      }
      throw response;
    },
    onError,
    onSuccess,
  });
}

export interface PostDiscordGetBotConfigurationFn {
  payload: PostDiscordGetBotConfigurationPayload;
  config?: AxiosRequestConfig;
}

export interface PostDiscordGetBotConfigurationPayload {
  bot_id: string;
}

export interface PostDiscordGetBotConfigurationFnResponse {
  status_code: number;
}

export interface PostDiscordGetBotConfigurationFnResponse {
  status_code: number;
  data: PostDiscordGetBotConfigurationData
}

export interface PostDiscordGetBotConfigurationData {
  token: string;
  bot_id: string;
}
