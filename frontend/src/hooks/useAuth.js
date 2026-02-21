import { useEffect, useState } from "react";
import { login as loginApi, register as registerApi, logout as logoutApi, refresh, me } from "../api/auth";
import { getAccessToken } from "../api/client";

export function useAuth() {
  const [status, setStatus] = useState("loading");
  const [user, setUser] = useState(null);

  useEffect(() => {
    let active = true;
    async function init() {
      try {
        if (!getAccessToken()) {
          setStatus("guest");
          return;
        }
        await refresh();
        const currentUser = await me();
        if (active) {
          setUser(currentUser);
          setStatus("authenticated");
        }
      } catch (err) {
        if (active) {
          setUser(null);
          setStatus("guest");
        }
      }
    }
    init();
    return () => {
      active = false;
    };
  }, []);

  const login = async (payload) => {
    const loggedInUser = await loginApi(payload);
    setUser(loggedInUser);
    setStatus("authenticated");
  };

  const register = async (payload) => {
    const registeredUser = await registerApi(payload);
    setUser(registeredUser);
    setStatus("authenticated");
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
    setStatus("guest");
  };

  return { user, status, login, register, logout };
}
