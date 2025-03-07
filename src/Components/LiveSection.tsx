import { useState } from "react";
import { useSocket } from "../Context/SocketContext";
import { useAuth } from "../Context/AuthContext";

export default function LiveSection() {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(
    null
  );
  const { user1, user2 , socket , user1Percentage , user2Percentage } = useSocket();
  const {user} = useAuth();

  const handleCandidate = (candidate: string) => {
    setSelectedCandidate(candidate);

   if(candidate === user1?.name){
    socket?.emit("vote", {
      candidate: "user1",
      username: user?.username,
    });
   }else{
    socket?.emit("vote", {
      candidate: "user2",
      username: user?.username,

    });
   }
  }


  return (
    <div className=" bg-secondaryColor border border-white/20   text-white p-6 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-center">
        Who would you like to vote for?
      </h2>
      <div className="flex gap-4">
        <label
          key={user1?.name}
          className={`cursor-pointer p-2 flex flex-col w-[160px]  items-center rounded-xl border ${
            selectedCandidate === user1?.name
              ? "border-blue-500"
              : "border-white/20"
          }`}
          onClick={()=>{handleCandidate(user1?.name as string)}}
        >
          <img
            src={user1?.photoURL}
            alt={user1?.name}
            className="w-32 h-32 object-cover rounded-full "
          />
          <div className="mt-2 flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center">
              {selectedCandidate === user1?.name && (
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              )}
            </div>
            <span className="text-sm py-4 ">{user1?.name}</span>
       
          </div>
        </label>

        <label
          key={user2?.name}
          className={`cursor-pointer p-2 flex flex-col items-center w-[160px]  rounded-xl border ${
            selectedCandidate === user2?.name
              ? "border-blue-500"
              : "border-white/20"
          }`}
          onClick={()=>{handleCandidate(user2?.name as string)}}
        >


          <img
            src={user2?.photoURL}
            alt={user2?.name}
            className="w-32 h-32 object-cover rounded-full "
          />
          <div className="mt-2 flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center">
              {selectedCandidate === user2?.name && (
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              )}
            </div>
            <span className="text-sm py-4 ">{user2?.name}</span>
          </div>
        </label>

      </div>

      <div className="animate-pulse  text-white/50 text-center my-5 ">
              <span>Voting is live</span>
      </div>
      <div className="w-full  mx-auto flex justify-between mt-5">
        <div className={`bg-gradient-to-r from-red-500 via-red-600 to-red-700 rounded-l-full text-center  p-2 transition-all duration-300  w-[${user1Percentage}%]`}>{ user1Percentage}%</div>
        <div className={`bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700  rounded-r-full text-center  p-2 transition-all duration-300  w-[${user2Percentage}%]`}>{user2Percentage}%</div>
      </div>
     
    </div>
  );
}
