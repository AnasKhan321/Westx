import { useEffect, useState } from "react";
import { useSocket } from "../Context/SocketContext";
import { User } from "../utils/type";

const RoastShow = () => {
  const { socket } = useSocket();
  const [user1, setuser1] = useState<User | null>(null);
  const [user2, setuser2] = useState<User | null>(null);
  const [live, setlive] = useState<boolean>(false);

  useEffect(() => {
    if (socket) {
      console.log(socket);
      socket.on("START:SHOW", (data) => {
        console.log("recieved");
        console.log(data);

        const user11 = JSON.parse(data.user1);
        const user22 = JSON.parse(data.user2);

        setuser1(user11);
        setuser2(user22);
        setlive(true);
      });
    }
  }, [socket]);
  return (
    <div className="bg-black text-white min-h-screen max-w-full min-w-full max-h-screen">
      {user1 == null && (
        <div className="text-center font-bold  text-xl py-3  ">
          {" "}
          Coming Soon !{" "}
        </div>
      )}

      {live && (
        <div>
          {user1?.username} vs {user2?.username}
        </div>
      )}
    </div>
  );
};

export default RoastShow;
