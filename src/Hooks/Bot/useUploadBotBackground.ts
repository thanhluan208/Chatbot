import queryKey from "@/Constants/queryKey";
import botService from "@/Services/bot.service";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

const useUploadBotBackground = () => {
  const { t } = useTranslation("store");
  const toastId = useRef<string | null>(null);
  const queryClient = useQueryClient();
  return useMutation(
    async (data: { bot_id: string; file_input: File; user_id: string }) => {
      toastId.current = toast.loading(`Uploading...`, {
        isLoading: true,
        autoClose: 3000,
      }) as string;
      return await botService.uploadBackground(data);
    },
    {
      onSuccess: (response) => {
        toastId.current &&
          toast.update(toastId.current, {
            render: response?.data?.message ?? "Upload successfully",
            type: response.data.status_code === 200 ? "success" : "error",
            isLoading: false,
            autoClose: 2000,
          });
        if (response.data.status_code === 200) {
          queryClient.refetchQueries(queryKey.BOT_DATA);
        }
      },
      onError: (error) => {
        console.log("err", error);
        toastId.current &&
          toast.update(toastId.current, {
            render: t("botStore.submitBotDialog.publishFailed"),
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
      },
    }
  );
};

export default useUploadBotBackground;
