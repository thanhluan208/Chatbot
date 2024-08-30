import {  getUserData, searchUser } from "../Constants/api";
import httpServices from "./httpServices";

class UserService {
  getUserData(id: string) {
    return httpServices.post(getUserData, {
      user_id: id,
    });
  }

  getListUser(search?: string) {
    return httpServices.post(searchUser, {
      search_filter: search || '',
    });
  }
}

export default new UserService();
