import queryKey from "@/Constants/queryKey";
import knowledgeService from "@/Services/knowledge.service";
import { AddOrRemoveKnowledgeFromBotPayload } from "@/Types/knowledge";
import { useRef } from "react";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

const useMutateKnowledgeFolder = () => {
  const queryClient = useQueryClient();
  const toastId = useRef<any>();

  const handleAddOrRemoveFolderKnowledge = useMutation({
    mutationFn: (payload: AddOrRemoveKnowledgeFromBotPayload) => {
      toastId.current = toast.loading("Processing...");

      return payload?.isAdd
        ? knowledgeService.removeKnowledgeFromBot(payload)
        : knowledgeService.addKnowledgeToBot(payload);
    },
    onSuccess: async () => {
      await Promise.allSettled([
        queryClient.invalidateQueries({
          queryKey: [queryKey.KNOWLEDGE_FOLDER_LIST],
        }),
        queryClient.invalidateQueries({
          queryKey: [queryKey.BOT_DATA],
        }),
      ]);

      toast.update(toastId.current, {
        render: "Success",
        type: "success",
        isLoading: false,
        autoClose: 1000,
      });
    },
    onError: () => {
      toastId.current = toast.update(toastId.current, {
        render: "Error",
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
    },
  });

  return {
    handleAddOrRemoveFolderKnowledge,
  };
};

export default useMutateKnowledgeFolder;
