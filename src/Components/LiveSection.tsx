import { useState } from "react";
import { useSocket } from "../Context/SocketContext";

export default function LiveSection() {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(
    null
  );
  const { user1, user2 } = useSocket();

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
          onClick={() => setSelectedCandidate(user1?.name as string)}
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
          onClick={() => setSelectedCandidate(user2?.name as string)}
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

      {/* Reactions Section */}
      <h2 className="text-lg font-semibold mt-6 mb-3">Reactions</h2>
      <div className="grid grid-cols-4 gap-4">
        {["🔥", "😂", "😢", "😠", "🎉", "💀", "😭", "+"].map((emoji, index) => (
          <button
            key={index}
            className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-2xl shadow-md hover:bg-gray-700"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
