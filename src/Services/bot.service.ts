import { getBotData, getListBot } from "../Constants/api";
import httpServices from "./httpServices";

class BotServices {
  getListBot(id: string) {
    return httpServices.post(getListBot, {
      user_id: id,
    });
  }

  getBotData(id: string) {
    return httpServices.post(getBotData, {
      bot_id: id,
    });
  }
}

export default new BotServices();
