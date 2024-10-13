import { AxiosResponse } from "axios";
import {
  botChatHistory,
  getBotData,
  getBotListConversation,
  getBotNode,
  getBotsStore,
  getListBot,
} from "../Constants/api";
import httpServices from "./httpServices";
import { ListBotResponse } from "@/Types/Bot";

export interface BotStoreFilter {
  user_id?: string;
  visual_option?: string;
  search_filter?: string;
}

class BotServices {
  getListBot(id: string) {
    return httpServices.post(getListBot, {
      user_id: id,
    });
  }

  getBotData(payload: { bot_id: string; user_id: string }) {
    return httpServices.post(getBotData, payload);
  }

  getBotStore(filter?: BotStoreFilter): Promise<AxiosResponse<ListBotResponse>> {
    return httpServices.post(getBotsStore, filter);
  }

  getBotChatHistory(payload: {
    bot_id: string;
    user_id: string;
    platform: string;
    conversation_id?: string;
  }) {
    return httpServices.post(botChatHistory, payload);
  }

  getListConversation(payload: { bot_id: string; user_id: string }) {
    return httpServices.post(getBotListConversation, payload);
  }

  getNode(payload: { bot_id: string; node_id: string }) {
    return httpServices.post(getBotNode, payload);
  }
}

export default new BotServices();
