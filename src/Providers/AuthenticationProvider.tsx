import React, { createContext, useContext, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import httpServices from "../Services/httpServices";
import { changePasswordApi } from "../Constants/api";
import useGetUserData, { UserData } from "../Hooks/User/useGetUserData";
import { useSave } from "../Stores/useStore";
import cachedKeys from "../Constants/cachedKeys";
import useMutateAuthen from "@/Hooks/User/useMutateAuthen";
import { LOCAL_STORAGE_KEY } from "@/Constants/common";

interface AuthContextType {
  userId: string | null;
  signIn: (payload: SignInPayload) => void;
  logout: () => void;
  signUp: (payload: SignUpPayload, onSuccess: () => void) => void;
  changePass: (payload: IPayloadChangePass) => void;
  userData: UserData | null;
}

interface SignInPayload {
  email_or_username: string;
  password: string;
}

interface SignUpPayload {
  user_name: string;
  password: string;
  email: string;
  address?: string;
  phone_num?: string;
  display_name?: string;
}

interface IPayloadChangePass {
  user_id: string;
  old_password: string;
  new_password: string;
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  signIn: () => {},
  logout: () => {},
  signUp: () => {},
  changePass: () => {},
  userData: null,
});

export const useAuth = () => useContext(AuthContext);

const AuthenticationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const storageUserID = localStorage.getItem("userId");
  const [userId, setUserId] = React.useState<string | null>(
    storageUserID || null
  );
  const save = useSave();
  const userData = localStorage.getItem(LOCAL_STORAGE_KEY.USER_DATA);
  const { data, refetch } = useGetUserData(userId, !!userId);

  const {
    handleCreateWorkflow,
    handleVerifyEmail,
    handleSignIn,
    handleLogout,
  } = useMutateAuthen();

  if (data) {
    localStorage.setItem(LOCAL_STORAGE_KEY.USER_DATA, JSON.stringify(data));
  }

  const signIn = async (payload: SignInPayload) => {
    const toastId = toast.loading("Logging in...", {
      isLoading: true,
      autoClose: false,
    });

    const response = await handleSignIn.mutateAsync(payload);
    if (response.data.status_code === 200) {
      setUserId(response.data.user_data.id);
      toast.update(toastId, {
        render: "Login successfully",
        type: "success",
        autoClose: 2000,
        isLoading: false,
      });
      localStorage.setItem("userId", response.data.user_data.id);

      if (response?.data?.user_data) {
        localStorage.setItem(
          LOCAL_STORAGE_KEY.USER_DATA,
          JSON.stringify(response?.data?.user_data)
        );
      }
      if (response.data?.access_token) {
        httpServices.attachTokenToHeader(response.data?.access_token);
        localStorage.setItem(
          LOCAL_STORAGE_KEY.ACCESS_TOKEN,
          response?.data?.access_token
        );
      }
      if (response?.data?.refresh_token) {
        localStorage.setItem(
          LOCAL_STORAGE_KEY.REFRESH_TOKEN,
          response?.data?.refresh_token
        );
      }
    } else {
      toast.update(toastId, {
        render: response.data?.message || "Login failed",
        type: "error",
        autoClose: 2000,
        isLoading: false,
      });
    }
  };

  const signUp = async (payload: SignUpPayload, onSuccess: () => void) => {
    const toastId = toast.loading("Signing up...", {
      isLoading: true,
      autoClose: false,
    });
    const formData = new FormData();
    formData.append("user_name", payload.user_name);
    formData.append("password", payload.password);
    payload.email && formData.append("email", payload.email || "");
    payload.address && formData.append("address", payload.address || "");
    payload.phone_num && formData.append("phone_num", payload.phone_num || "");
    // formData.append("credit", "0.0");
    // formData.append("tier", "0");
    formData.append("display_name", payload.display_name || "");

    const response = await handleCreateWorkflow.mutateAsync(formData);

    if (response.data.status_code === 200) {
      toast.update(toastId, {
        render:
          "Sign up successfully. Please check your email to verify your account",
        type: "success",
        autoClose: 2000,
        isLoading: false,
      });

      const responseVerify = await handleVerifyEmail.mutateAsync(payload.email);
      if (responseVerify.data.status_code === 200) {
        onSuccess();
      }
    } else {
      toast.update(toastId, {
        render: response.data.message,
        type: "error",
        autoClose: 2000,
        isLoading: false,
      });
    }
  };

  const changePass = async (payload: IPayloadChangePass) => {
    const toastId = toast.loading("Changing password...", {
      isLoading: true,
      autoClose: false,
    });
    try {
      const response = await httpServices.axios.post(
        changePasswordApi,
        payload
      );
      if (response.data.status_code === 200) {
        toast.update(toastId, {
          render: "Change password successfully",
          type: "success",
          autoClose: 2000,
          isLoading: false,
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.log("error", error.message);
      toast.update(toastId, {
        render: error?.message || "Change password failed",
        type: "error",
        autoClose: 2000,
        isLoading: false,
      });
    }
  };

  const logout = async () => {
    const userData = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEY.USER_DATA) || "{}"
    );
    const token = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN) || "";
    const refreshToken =
      localStorage.getItem(LOCAL_STORAGE_KEY.REFRESH_TOKEN) || "";
     handleLogout.mutate({
      email_or_username: userData?.email,
      token,
      refreshToken,
    });
    setUserId(null);

    localStorage.removeItem("userId");
    localStorage.removeItem(LOCAL_STORAGE_KEY.USER_DATA);
    localStorage.removeItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEY.REFRESH_TOKEN);
    location.reload();
  };

  useEffect(() => {
    save(cachedKeys.REFETCH_USER_DATA, refetch);
  }, [refetch]);

  useEffect(() => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
    if (accessToken) httpServices.attachTokenToHeader(accessToken);
  }, []);

  const value = useMemo(() => {
    return {
      signIn,
      logout,
      userId,
      signUp,
      changePass,
      userData: userData ? JSON.parse(userData) : data,
    };
  }, [signIn]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthenticationProvider;
