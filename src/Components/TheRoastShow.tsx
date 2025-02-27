import { useSocket } from "../Context/SocketContext";
import { ScaleLoader } from "react-spinners";
import { DynamicText2 } from "../ReusableComponents/DynamicText";
import { useState } from "react";
import {motion}  from "motion/react"
import { BiUpArrowAlt } from "react-icons/bi";
import { IoCaretBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Waiting from "./Waiting";
const RoastShow = () => {
  const { user1, live, user2, chats, user1loading, user2loading } = useSocket();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("vote");
  const navigate = useNavigate() ; 
  const handleClick = ()=>{
    navigate(-1);
  }
  return (
    <div className="md:min-h-[96vh] md:my-[2vh] w-full md:rounded-xl border-white/20 border  bg-primaryColor md:bg-secondaryColor text-white  max-w-full min-w-full max-h-screen">

    {!live &&    <div className="p-4 flex space-x-3 items-center ">

                  <IoCaretBack
                    className="text-xl cursor-pointer "
                    onClick={handleClick}
                  />
        <p className="text-lg font-bold ">           Roast Show   </p>

      </div>}
      {user1 == null && (
        <Waiting/> 
      )}

      {live && (
        <>
          <div className="border-white/20   border-b  py-3  mx-auto   max-h-[10vh]  ">
            <div className="flex justify-between  items-center w-[95%] md:w-[75%] mx-auto  ">
              <IoCaretBack  onClick={handleClick} /> 
              <div className="flex  items-center space-x-2">
                <img
                  src={user1?.photoURL}
                  alt=""
                  className="h-[50px] rounded-full "
                />
                <span className="font-bold text-sm md:text-base">
                  {" "}
                  {user1?.name}{" "}
                </span>
              </div>

              <div className="font-bold"> V/S </div>
              <div className="flex  items-center space-x-2">
                <img
                  src={user2?.photoURL}
                  alt=""
                  className="h-[50px] rounded-full "
                />
                <span className="font-bold  text-sm md:text-base ">
                  {" "}
                  {user2?.name}{" "}
                </span>
              </div>
            </div>
          </div>

          <div className=" w-[98%] mx-auto  min-h-[85vh]  max-h-[85vh]  overflow-y-scroll">
            {chats.map((chat, index) => (
              <div
                key={index}
                className={`flex ${
                  chat.user === user1?.username
                    ? "justify-start"
                    : "justify-end"
                } my-2 `}
              >
                <div
                  key={index}
                  className={`p-3 my-2   text-xs   md:text-base rounded-lg ${
                    chat.user === user2?.username
                      ? "bg-purple-300  text-black"
                      : "bg-[#474747] text-white"
                  } max-w-[70%]`}
                >
                  {DynamicText2({ text: chat.content })}
                </div>
              </div>
            ))}

            <div className="w-full flex justify-between">
              <div
                className={`${user1loading ? "block" : "hidden"} justify-start`}
              >
                {" "}
                <ScaleLoader color="white" />{" "}
              </div>

              {user2loading && (
                <div
                  className={`${
                    user2loading ? "block" : "hidden"
                  } justify-end w-full flex`}
                >
                  {" "}
                  <ScaleLoader color="white" />{" "}
                </div>
              )}
            </div>
          </div>

          <div className="fixed bottom-0 left-0 w-full flex justify-center items-end">
      {/* Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/50 z-10"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Bottom Sheet */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: isOpen ? "0%" : "100%" }}
        transition={{ type: "spring", stiffness: 100 }}
        className="w-full bg-secondaryColor rounded-t-xl p-4 fixed bottom-0 z-20"
      >
        {/* Drag Handle */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
          className="w-10 h-1 bg-gray-600 mx-auto rounded-full mb-4"
        />

        {/* Tabs */}
        <div className={`${isOpen ? "hidden" : "flex"} justify-between text-gray-400`}>
          <button className="text-white">Vote</button>
          <button>React</button>
        </div>

        {/* Content */}
        {isOpen && (
          <motion.div className="mt-4">
            {/* Tabs */}
            <div className="flex justify-between text-gray-400 border-b border-gray-700 pb-2">
              <button
                className={`w-1/2 text-center pb-1 ${
                  activeTab === "vote" ? "text-white border-b-2 border-white" : ""
                }`}
                onClick={() => setActiveTab("vote")}
              >
                Vote
              </button>
              <button
                className={`w-1/2 text-center pb-1 ${
                  activeTab === "react" ? "text-white border-b-2 border-white" : ""
                }`}
                onClick={() => setActiveTab("react")}
              >
                React
              </button>
            </div>

            {activeTab === "vote" ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-2 border rounded-lg">
                    <input type="radio" name="vote" />
                    {user1?.name}
                  </label>
                  <label className="flex items-center gap-2 p-2 border rounded-lg">
                    <input type="radio" name="vote" />
                    {user2?.name}
                  </label>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 w-full bg-purple-600 py-2 rounded-lg text-white"
                >
                  Vote
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-4 gap-4 my-4"
              >
                {["🔥", "😂", "😢", "😠", "🎉", "💀", "😭", "+"].map((emoji, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 bg-primaryColor rounded-xl flex items-center justify-center text-2xl shadow-md hover:bg-gray-700"
                  >
                    {emoji}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Button to Open */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={() => setIsOpen(true)}
          className="bg-secondaryColor block md:hidden text-white p-3 rounded-full fixed bottom-5 z-30"
        >
          <BiUpArrowAlt className="text-xl"/>
        </motion.button>
      )}
    </div>
        </>
      )}
    </div>
  );
};

export default RoastShow;
