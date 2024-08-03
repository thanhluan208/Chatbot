import React, { createContext, useContext, useMemo } from "react";
import { toast } from "react-toastify";
import httpServices from "../Services/httpServices";
import { signInApi, signUpApi } from "../Constants/api";

interface AuthContextType {
  userId: string | null;
  signIn: (payload: SignInPayload) => void;
  logout: () => void;
  signUp: (payload: SignUpPayload) => void;
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

const AuthContext = createContext<AuthContextType >({
  userId: null,
  signIn: () => {},
  logout: () => {},
  signUp: () => {},
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
      }

      throw new Error("Login failed");
    } catch (error) {
      toast.update(toastId, {
        render: "Login failed",
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
      const response = await httpServices.axios.post(signUpApi, payload);
      if (response.data.status_code === 200) {
        setUserId(response.data.user_data.id);
        toast.update(toastId, {
          render: "Sign up successfully",
          type: "success",
          autoClose: 2000,
          isLoading: false,
        });
      }

      throw new Error("Sign up failed");
    } catch (error) {
      toast.update(toastId, {
        render: "Sign up failed",
        type: "error",
        autoClose: 2000,
        isLoading: false,
      });
    }
  }

  const logout = () => {
    setUserId(null);
    localStorage.removeItem("userId");
  };

  const value = useMemo(() => {
    return {
      signIn,
      logout,
      userId,
      signUp
    };
  }, [signIn]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthenticationProvider;
