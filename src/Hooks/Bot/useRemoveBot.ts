import { removeBotFromStore } from "@/Constants/api";
import queryKey from "@/Constants/queryKey";
import httpServices from "@/Services/httpServices";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

const useRemoveBot = () => {
  const { t } = useTranslation("store");
  const toastId = useRef<string | null>(null);
  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (data: { user_id: string; bot_id: string }) => {
      toastId.current = toast.loading(
        `${t("botStore.submitBotDialog.removing")}...`,
        {
          isLoading: true,
          autoClose: 3000,
        }
      ) as string;
      return await httpServices.post(removeBotFromStore, data);
    },
    {
      onSuccess: (response) => {
        toastId.current &&
          toast.update(toastId.current, {
            render:
              response?.data?.message ??
              t("botStore.submitBotDialog.removeSuccess"),
            type: response.data.status_code === 200 ? "success" : "error",
            isLoading: false,
            autoClose: 2000,
          });
        if (response.data.status_code === 200) {
          queryClient.refetchQueries(queryKey.LIST_BOT);
          queryClient.refetchQueries(queryKey.BOT_DATA);
        }
      },
      onError: (error) => {
        console.log("err", error);
        toastId.current &&
          toast.update(toastId.current, {
            render: t("botStore.submitBotDialog.removeFailed"),
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
      },
    }
  );

  return mutation;
};

export default useRemoveBot;
