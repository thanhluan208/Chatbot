import {
  getUserData,
  searchUser,
  signInApi,
  signUpApi,
  submitOTP,
  verifyEmail,
} from "../Constants/api";
import httpServices from "./httpServices";

class UserService {
  getUserData(id: string) {
    return httpServices.post(getUserData, {
      user_id: id,
    });
  }

  getListUser(search?: string) {
    return httpServices.post(searchUser, {
      search_filter: search || "",
    });
  }

  signUp(data: FormData) {
    return httpServices.post(signUpApi, data);
  }

  verifyEmail(email: string) {
    return httpServices.post(verifyEmail, {
      email: email,
    });
  }

  submitOTP(email: string, otp: string) {
    return httpServices.post(submitOTP, {
      email: email,
      verification_code: otp,
    });
  }

  signIn(data: { email_or_username: string; password: string }) {
    return httpServices.post(signInApi, data);
  }
}

export default new UserService();
