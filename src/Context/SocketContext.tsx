import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_SERVER_URL = import.meta.env.VITE_PUBLIC_BACKEND_URL; // Update with your actual server URL

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });



    newSocket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
