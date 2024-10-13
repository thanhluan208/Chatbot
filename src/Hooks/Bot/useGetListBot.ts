import { useAuth } from "../../Providers/AuthenticationProvider";
import botService from "../../Services/bot.service";
import { useQuery } from "react-query";
import queryKey from "@/Constants/queryKey";
import { AxiosResponse } from "axios";

export interface Bot {
  bot_id: string;
  bot_name: string;
  description: string;
  owner_id: string;
  created_at: Date;
  user_name: string;
  permission_level: string;
  visibility: string;
  avatar_url: string;
}

interface Filters {
  search_filter?: string;
  visual_option?: string;
}

const useGetListBot = (filters?: Filters, isTrigger = true) => {
  const { userId } = useAuth();

  // Queries
  const query = useQuery<AxiosResponse<Bot[]>>(
    queryKey.LIST_BOT,
    () => {
      return botService.getBotStore({
        user_id: userId || "",
        visual_option: "shared",
        ...filters,
      });
    },
    {
      enabled: isTrigger && !!userId,
    }
  );

  return query;
};

export default useGetListBot;
