import httpServices from '@/Services/httpServices';
import { AxiosRequestConfig } from 'axios';
import { useMutation } from 'react-query';

export interface PostTelegramGetBotConfigurationParams {
  onSuccess?: (data: PostTelegramGetBotConfigurationFnResponse) => void;
  onError?: (error: unknown) => void;
}

export function usePostTelegramGetBotConfiguration({
  onError,
  onSuccess,
}: PostTelegramGetBotConfigurationParams) {
  return useMutation({
    mutationKey: ['use-post-telegram-get-bot-configuration'],
    mutationFn: async ({
      payload,
      config = {},
    }: PostTelegramGetBotConfigurationFn) => {
      const url = '';
      const response = (await httpServices.post(
        url,
        payload,
        config
      )) as unknown as PostTelegramGetBotConfigurationFnResponse;
      if (response && response.status_code == 200) {
        return response;
      }
      throw response;
    },
    onError,
    onSuccess,
  });
}

export interface PostTelegramGetBotConfigurationFn {
  payload: PostTelegramGetBotConfigurationPayload;
  config?: AxiosRequestConfig;
}

export interface PostTelegramGetBotConfigurationPayload {
  bot_id: string;
}

export interface PostTelegramGetBotConfigurationFnResponse {
  status_code: number;
  data: PostTelegramGetBotConfigurationData
}

export interface PostTelegramGetBotConfigurationData {
  token: string;
  bot_id: string;
}
