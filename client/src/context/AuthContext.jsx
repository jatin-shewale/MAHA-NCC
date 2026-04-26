import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { api, getErrorMessage } from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("ncc-pro-token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("ncc-pro-user");
    return raw ? JSON.parse(raw) : null;
  });
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(token));

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setIsBootstrapping(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        setUser(data.data);
        localStorage.setItem("ncc-pro-user", JSON.stringify(data.data));
      } catch (error) {
        logout();
      } finally {
        setIsBootstrapping(false);
      }
    };

    bootstrap();
  }, [token]);

  const persistAuth = (payload) => {
    setToken(payload.token);
    setUser(payload.user);
    localStorage.setItem("ncc-pro-token", payload.token);
    localStorage.setItem("ncc-pro-user", JSON.stringify(payload.user));
  };

  const login = async (values) => {
    const { data } = await api.post("/auth/login", values);
    persistAuth(data.data);
    toast.success(`Welcome back, ${data.data.user.name}`);
    return data.data.user;
  };

  const register = async (values) => {
    const { data } = await api.post("/auth/register", values);
    toast.success(data.message);
    if (data.data) {
      persistAuth(data.data);
      return data.data.user;
    }
    return null;
  };

  const forgotPassword = async (email) => {
    const { data } = await api.post("/auth/forgot-password", { email });
    toast.success(data.message);
  };

  const resetPassword = async (tokenValue, password) => {
    const { data } = await api.post(`/auth/reset-password/${tokenValue}`, { password });
    toast.success(data.message);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("ncc-pro-token");
    localStorage.removeItem("ncc-pro-user");
  };

  const updateStoredUser = (nextUser) => {
    setUser(nextUser);
    localStorage.setItem("ncc-pro-user", JSON.stringify(nextUser));
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isBootstrapping,
      login,
      register,
      forgotPassword,
      resetPassword,
      logout,
      updateStoredUser
    }),
    [token, user, isBootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const withAsyncToast = async (promise) => {
  try {
    return await promise;
  } catch (error) {
    toast.error(getErrorMessage(error));
    throw error;
  }
};
