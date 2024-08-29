import { getBotData, getListBot } from "../Constants/api";
import httpServices from "./httpServices";

class BotServices {
  getListBot(id: string) {
    return httpServices.post(getListBot, {
      user_id: id,
    });
  }

  getBotData(payload: { bot_id: string; user_id: string }) {
    return httpServices.post(getBotData, payload);
  }
}

export default new BotServices();
