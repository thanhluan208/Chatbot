import React, { createContext, useContext, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import httpServices from "../Services/httpServices";
import { changePasswordApi, signInApi, signUpApi } from "../Constants/api";
import useGetUserData, { UserData } from "../Hooks/User/useGetUserData";
import { useSave } from "../Stores/useStore";
import cachedKeys from "../Constants/cachedKeys";

interface AuthContextType {
  userId: string | null;
  signIn: (payload: SignInPayload) => void;
  logout: () => void;
  signUp: (payload: SignUpPayload) => void;
  changePass: (payload: IPayloadChangePass) => void;
  userData: UserData | null
}

interface SignInPayload {
  email_or_username: string;
  password: string;
}

interface SignUpPayload {
  user_name: string;
  password: string;
  email?: string;
  address?: string;
  phone_num?: string;
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
  userData: null
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

  const userData = localStorage.getItem("userData");
  const { data, refetch } = useGetUserData(userId, !!userId && !userData);
  if(data) {
    localStorage.setItem("userData", JSON.stringify(data));
  }

  const signIn = async (payload: SignInPayload) => {
    const toastId = toast.loading("Logging in...", {
      isLoading: true,
      autoClose: false,
    });
    try {
      const response = await httpServices.axios.post(signInApi, payload);
      if (response.data.status_code === 200) {
        setUserId(response.data.user_data.id);
        toast.update(toastId, {
          render: "Login successfully",
          type: "success",
          autoClose: 2000,
          isLoading: false,
        });
        localStorage.setItem("userId", response.data.user_data.id);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      toast.update(toastId, {
        render: error?.message || "Login failed",
        type: "error",
        autoClose: 2000,
        isLoading: false,
      });
    }
  };

  const signUp = async (payload: SignUpPayload) => {
    const toastId = toast.loading("Signing up...", {
      isLoading: true,
      autoClose: false,
    });
    try {
      const formData = new FormData();
      formData.append("user_name", payload.user_name);
      formData.append("password", payload.password);
      payload.email && formData.append("email", payload.email || "");
      payload.address && formData.append("address", payload.address || "");
      payload.phone_num  && formData.append("phone_num", payload.phone_num || "");
      formData.append("credit", "0.0");
      formData.append("tier", "0");

      const response = await httpServices.axios.post(signUpApi, formData);
      if (response.data.status_code === 200) {
        setUserId(response.data?.user_id);
        toast.update(toastId, {
          render: "Sign up successfully",
          type: "success",
          autoClose: 2000,
          isLoading: false,
        });
        localStorage.setItem("userId", response.data?.user_id);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.log("error", error.message);
      toast.update(toastId, {
        render: error?.message || "Sign up failed",
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

  const logout = () => {
    setUserId(null);
    localStorage.removeItem("userId");
    localStorage.removeItem("userData")
    location.reload()
  };

  useEffect(() => {
    save(cachedKeys.REFETCH_USER_DATA, refetch);
  }, [refetch]);

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
