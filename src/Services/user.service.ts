import {  getUserData } from "../Constants/api";
import httpServices from "./httpServices";

class UserService {
  getUserData(id: string) {
    return httpServices.post(getUserData, {
      user_id: id,
    });
  }
}

export default new UserService();
