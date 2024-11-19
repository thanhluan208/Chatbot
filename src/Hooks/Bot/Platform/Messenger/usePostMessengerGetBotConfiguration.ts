import httpServices from '@/Services/httpServices';
import { AxiosRequestConfig } from 'axios';
import { useMutation } from 'react-query';

export interface PostMessengerGetBotConfigurationParams {
  onSuccess?: (data: PostMessengerGetBotConfigurationFnResponse) => void;
  onError?: (error: unknown) => void;
}

export function usePostMessengerGetBotConfiguration({
  onError,
  onSuccess,
}: PostMessengerGetBotConfigurationParams) {
  return useMutation({
    mutationKey: ['use-post-messenger-get-bot-configuration'],
    mutationFn: async ({
      payload,
      config = {},
    }: PostMessengerGetBotConfigurationFn) => {
      const url = '';
      const response = (await httpServices.post(
        url,
        payload,
        config
      )) as unknown as PostMessengerGetBotConfigurationFnResponse;
      if (response && response.status_code == 200) {
        return response;
      }
      throw response;
    },
    onError,
    onSuccess,
  });
}

export interface PostMessengerGetBotConfigurationFn {
  payload: PostMessengerGetBotConfigurationPayload;
  config?: AxiosRequestConfig;
}

export interface PostMessengerGetBotConfigurationPayload {
  bot_id: string;
}

export interface PostMessengerGetBotConfigurationFnResponse {
  status_code: number;
  data: PostMessengerGetBotConfigurationData;
}

export interface PostMessengerGetBotConfigurationData {
  page_id: string;
  page_access_token: string;
  app_secret_key: string;
  bot_id: string;
}
