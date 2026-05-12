// src/socket/SocketProvider.jsx
import { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setActiveUsersCount, setSocketStatus } from '../features/siteSettingsSlice';
import socket from './socket';

const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const initialized = useRef(false);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000;

  // ✅ 1. Sab handlers ko useCallback se stable banayein
  const handleConnect = useCallback(() => {
    console.log('🟢 Socket connected:', socket.id);
    dispatch(setSocketStatus({ status: 'connected', id: socket.id }));
    reconnectAttempts.current = 0;
  }, [dispatch]);

  const handleDisconnect = useCallback(
    (reason) => {
      console.log('🔴 Socket disconnected:', reason);
      dispatch(setSocketStatus({ status: 'disconnected', reason }));

      if (reason !== 'io client disconnect' && reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current += 1;
        console.log(
          `🔄 Reconnection attempt ${reconnectAttempts.current}/${maxReconnectAttempts} in ${reconnectDelay}ms...`
        );
        setTimeout(() => {
          if (!socket.connected) socket.connect();
        }, reconnectDelay);
      }
    },
    [dispatch]
  );

  const handleConnectError = useCallback(
    (err) => {
      console.error('❌ Socket connection error:', err.message);
      dispatch(setSocketStatus({ status: 'error', error: err.message }));
    },
    [dispatch]
  );

  // ✅ 2. activeUsersCount handler ko bhi stable banayein
  const handleActiveUsersCount = useCallback(
    ({ count }) => {
      dispatch(setActiveUsersCount({ count }));
    },
    [dispatch]
  );

  // ✅ Alternative: Without initialized guard
  useEffect(() => {
    socket.on('connect', handleConnect);
    socket.on('activeUsersCount', handleActiveUsersCount);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);

    if (!socket.connected) socket.connect();

    return () => {
      socket.off('connect', handleConnect);
      socket.off('activeUsersCount', handleActiveUsersCount);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
    };
  }, [handleConnect, handleDisconnect, handleConnectError, handleActiveUsersCount]); // Dependencies ke saath

  return children;
};

export default SocketProvider;
