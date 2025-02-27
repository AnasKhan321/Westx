import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { User } from "../utils/type";


const SOCKET_SERVER_URL = import.meta.env.VITE_PUBLIC_BACKEND_URL; // Update with your actual server URL
interface Chats {
  user : string , 
  content : string
}
interface SocketContextType {
  socket: Socket | null;
  user1 : User | null; 
  user2 : User | null ;
  live : boolean ; 
  chats : Chats[];
  user1loading : boolean , 
  user2loading : boolean

}



const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);



  const [user1, setuser1] = useState<User | null>(null);
  const [user2, setuser2] = useState<User | null>(null);
  const [live, setlive] = useState<boolean>(false);

  const [chats , setchats]  = useState <Chats[]> ([])

  const [user1loading , setuser1loading]  = useState(false)
  const [user2loading , setuser2loading]  = useState(false)


  useEffect(() => {
    if (socket) {
      socket.on("START:SHOW", (data) => {
        setuser1(data.user1);
        setuser2(data.user2);
        setlive(true);
        setuser1loading(true)
      });

      socket.on("USER2:MESSAGE"  , (data)=>{
        console.log(data)
        const d = JSON.parse(data)

        setchats((prevChats) => [
          ...prevChats, 
         d ,
        ]);
        setuser1loading(true)
        setuser2loading(false)
      })

      socket.on("USER1:MESSAGE"  , (data)=>{
        const d = JSON.parse(data)
        setchats((prevChats) => [
          ...prevChats,
         d ,
        ]);
        setuser1loading(false)
        setuser2loading(true)
      })

      socket.on("ROASTSHOW:STARTED:ALREADY"  , (data)=>{
          setuser1(data.user1)
          setuser2(data.user2)
          setchats(data.chats)
          setlive(true)
      })

      socket.on("END:SHOW"  , ()=>{
    
        setuser1loading(false)
        setuser2loading(false)

      })
    }
  }, [socket]);

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

  return <SocketContext.Provider value={{ socket  , user1 , user1loading , user2  , user2loading , chats , live }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
