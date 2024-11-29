import userService from "@/Services/user.service";
import { useMutation } from "react-query";
import { toast } from "react-toastify";

const useMutateAuthen = () => {
  const handleCreateWorkflow = useMutation({
    mutationFn: (payload: FormData) => userService.signUp(payload),
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const handleVerifyEmail = useMutation({
    mutationFn: (email: string) => userService.verifyEmail(email),
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const handleSubmitOTP = useMutation({
    mutationFn: (payload: { email: string; otp: string }) =>
      userService.submitOTP(payload.email, payload.otp),
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const handleSignIn = useMutation({
    mutationFn: (payload: { email_or_username: string; password: string }) =>
      userService.signIn(payload),
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const handleLogout = useMutation({
    mutationFn: (payload: { email_or_username: string; token: string, refreshToken: string }) =>
      userService.logout(payload.email_or_username, payload.token, payload.refreshToken),
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  return {
    handleCreateWorkflow,
    handleVerifyEmail,
    handleSubmitOTP,
    handleSignIn,
    handleLogout
  };
};

export default useMutateAuthen;
