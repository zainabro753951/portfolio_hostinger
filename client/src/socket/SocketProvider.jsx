// src/socket/SocketProvider.jsx
import { useEffect, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import socket from "./socket";
import {
  setActiveUsersCount,
  setSocketStatus,
} from "../features/siteSettingsSlice";

const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const initialized = useRef(false);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000; // 3 seconds

  // Stable callback for connection status
  const handleConnect = useCallback(() => {
    console.log("🟢 Socket connected:", socket.id);
    dispatch(setSocketStatus({ status: "connected", id: socket.id }));
    reconnectAttempts.current = 0; // Reset attempts on successful connection
  }, [dispatch]);

  const handleDisconnect = useCallback(
    (reason) => {
      console.log("🔴 Socket disconnected:", reason);
      dispatch(setSocketStatus({ status: "disconnected", reason }));

      // Attempt reconnection if not manually disconnected
      if (
        reason !== "io client disconnect" &&
        reconnectAttempts.current < maxReconnectAttempts
      ) {
        reconnectAttempts.current += 1;
        console.log(
          `🔄 Reconnection attempt ${reconnectAttempts.current}/${maxReconnectAttempts} in ${reconnectDelay}ms...`,
        );

        setTimeout(() => {
          if (!socket.connected) {
            socket.connect();
          }
        }, reconnectDelay);
      }
    },
    [dispatch],
  );

  const handleConnectError = useCallback(
    (err) => {
      console.error("❌ Socket connection error:", err.message);
      dispatch(setSocketStatus({ status: "error", error: err.message }));
    },
    [dispatch],
  );

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // ✅ pehle listeners lagao
    socket.on("connect", handleConnect);
    socket.on("activeUsersCount", ({ count }) => {
      dispatch(setActiveUsersCount({ count }));
    });
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    // ✅ phir connect karo
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("activeUsersCount", ({ count }) => {
        dispatch(setActiveUsersCount({ count }));
      });
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
    };
  }, []);

  return children;
};

export default SocketProvider;
