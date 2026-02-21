import { useEffect } from "react";
import { io } from "socket.io-client";
import { API_URL, getAccessToken } from "../api/client";

export function useSocket({ enabled, onEvent }) {
  useEffect(() => {
    if (!enabled) return undefined;

    const token = getAccessToken();
    const socket = io(API_URL, {
      auth: { token }
    });

    socket.on("workflow:queued", onEvent);
    socket.on("workflow:completed", onEvent);

    return () => {
      socket.disconnect();
    };
  }, [enabled, onEvent]);
}
