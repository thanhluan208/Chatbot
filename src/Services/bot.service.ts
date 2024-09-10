import { getBotData, getBotsStore, getListBot } from "../Constants/api";
import httpServices from "./httpServices";

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

  getBotStore(filter?: BotStoreFilter) {
    return httpServices.post(getBotsStore, filter);
  }
}

export default new BotServices();
