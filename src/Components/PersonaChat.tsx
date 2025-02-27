import { Link, useNavigate, useParams } from "react-router-dom";
import { getUserbyUsername } from "../utils/apicalls";
import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { BsSend } from "react-icons/bs";
import { useAuth } from "../Context/AuthContext";
import { ScaleLoader } from "react-spinners";
import Loader from "../ReusableComponents/Loader";
import { Message } from "../utils/type";
import { getAiResponse } from "../ai";
import { IoCaretBack } from "react-icons/io5";
import axios from "axios";

interface ChatMessages {
  success: boolean;
  messages: Message[];
}

const getChat = async (user1: string, user2: string): Promise<ChatMessages> => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_PUBLIC_AI_URL}/getChat/${user1}/${user2}`
  );
  return data;
};

const PersonaChat = () => {
  const { username } = useParams();
  const {
    data,
    error,
    isLoading: isLoaddingg,
  } = useQuery({
    queryKey: [`user:${username}`],
    queryFn: () => getUserbyUsername(username as string),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const { user } = useAuth();

  const [chats, setchats] = useState<Message[]>([]);
  const [isloading, setisloading] = useState(false);
  const [message, setmessage] = useState("");

  const isMounted = useRef(false);
  const handleStreamRequest = async (question: string) => {
    if (isloading) return;
    if (data?.data) {
      const response = await getAiResponse(data?.data, question, chats);
     setchats((prevChats) => {
        const updatedChats = [...prevChats];
        updatedChats.push({
          sender: "assistant",
          content: response.trim(),
        });
        return updatedChats;
      });
      setisloading(false);


    }
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (!message.trim()) return;
    if (isloading) {
      return;
    }
    setisloading(true);

    setchats((prevChats) => [
      ...prevChats,
      { sender: "user", content: message },
    ]);
    setmessage("");
    await handleStreamRequest(message);
  }


  useEffect(() => {
    
    if (isMounted.current) return; // Prevent multiple executions
    isMounted.current = true;
    console.log("running")
    const initializeChat = async () => {
      // Fetch previous chat
      const chatResponse = await getChat(
        user?.username as string,
        username as string
      );
      console.log(chatResponse)

      if (chatResponse.success) {
        setchats(chatResponse.messages);
      }
    };

  
      void initializeChat();
    
  }, [data?.data?.username, user?.username, username]);

  useEffect(()=>{
      if (chats.length !== 0) {
        const updateChat = async () => {
          await axios.post(`${import.meta.env.VITE_PUBLIC_AI_URL}/saveChat`, {
            user1: user?.username,
            user2: username,
            messages: chats,
          });
        };

          void updateChat();
      
      }
  },[chats])




  const navigate = useNavigate();
  const handleClick = () => {
    navigate(-1);
  };

  return (
    <>
      {isLoaddingg && <Loader />}
      {error && (
        <div className="min-h-screen min-w-screen flex items-center bg-primary justify-center">
          {" "}
          Error ..{" "}
        </div>
      )}
      {data && (
        <div className="grid grid-cols-16  bg-primaryColor text-secondary min-h-screen max-h-screen overflow-x-hidden font-roboto  ">
          <div className="  md:col-span-3">
            <Link to={"/"}>
              <img
                src="https://codewithbat.s3.ap-south-1.amazonaws.com/logo-round.png" // Replace with the profile image path
                alt="WestX Logo"
                className="w-16 h-16 rounded-full m-4 md:block hidden "
              />{" "}
            </Link>
          </div>
          <div className="  border-white/10 md:border col-span-16  min-h-screen max-h-screen  md:col-span-10 bg-primaryColor md:bg-secondaryColor  md:max-h-[96vh]    md:min-h-[96vh]  md:my-[2vh] md:rounded-xl ">
            <div className="w-[97%] mx-auto">
              <div className="pt-2 pb-4 border-b border-white/20 flex space-x-4 items-center    ">
                <IoCaretBack
                  className="text-xl cursor-pointer"
                  onClick={handleClick}
                />
                <img
                  src={data.data.photoURL}
                  alt=""
                  className="w-[50px] h-[50px]  rounded-full "
                />
                <span className="font-bold "> Chat with {data.data.name} </span>
              </div>

              <div className="w-full md:min-h-[72vh]  my-4  min-h-[78vh]  max-h-[78vh]  md:max-h-[72vh] overflow-y-scroll ">
             
                {chats.map((chat, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      chat.sender === "user" ? "justify-end" : "justify-start"
                    } my-2 `}
                  >
                    <div
                      key={index}
                      className={`p-3  text-sm  md:text-base rounded-lg ${
                        chat.sender === "user"
                          ? "bg-purple-600 text-white"
                          : "bg-[#474747] text-white"
                      } max-w-[70%]`}
                    >
                      {chat.content}
                    </div>
                  </div>
                ))}
                {isloading && (
                  <div>
                    {" "}
                    <ScaleLoader color="white" />{" "}
                  </div>
                )}
              </div>

              <div className="w-full max-h-[20vh] y-4 ">
                <div className="  ">
                  <form
                    className="w-full grid grid-cols-12   gap-x-2  items-center   "
                    onSubmit={handleSubmit}
                  >
                    <input
                      type="text"
                      className=" col-span-10 md:col-span-11 text-white border bg-white/10 border-white/60 bg-[#1c1c1c]  rounded-3xl  px-4 py-2 focus:outline-none "
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setmessage(e.target.value);
                      }}
                    />
                    <button
                      className=" col-span-2 md:col-span-1 cursor-pointer  "
                      type="submit"
                    >
                      <div className="w-[50px] h-[50px] rounded-full hover:bg-purple-800  transition  bg-purple-600 flex justify-center items-center ">
                        <BsSend className="text-white" />
                      </div>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-3"></div>

          {/* <div className="border-gray-800  border-b  py-3   max-h-[10vh] flex justify-between  items-center  ">
            <div className=" hidden md:block md:w-[50%] px-4 ">
              <Link to={"/"} className="cursor-pointer">
                <img
                  src="https://codewithbat.s3.ap-south-1.amazonaws.com/logo-round.png"
                  width={55}
                  height={50}
                  className="rounded-full h-[50px]  "
                />
              </Link>
            </div>

            <div className="flex justify-center md:justify-start items-center gap-x-2 col-span-8  w-[100%] md:w-[70%]   ">
              <img
                src={data.data.photoURL}
                width={50}
                height={50}
                className="rounded-full "
              />
              <div className="font-bold text-xl text-white ">
                {data.data.name}
              </div>
              {data.data.isPremium && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#db12ff"
                  className="size-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </div>

          <div className="chat-section w-[85vw]  md:w-[65vw]  mx-auto  mt-2 max-h-[78vh] min-h-[78vh]  md:max-h-[77vh]  md:min-h-[77vh] overflow-y-scroll ">
            {loading && <ScaleLoader color="white" />}
            {chats.map((chat, index) => (
              <div
                key={index}
                className={`flex ${
                  chat.sender === "user" ? "justify-end" : "justify-start"
                } my-2 `}
              >
                <div
                  key={index}
                  className={`p-3  text-sm  md:text-base rounded-lg ${
                    chat.sender === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-[#1c1c1c] text-white"
                  } max-w-[70%]`}
                >
                  {chat.content}
                </div>
              </div>
            ))}
            {isloading && (
              <div>
                {" "}
                <ScaleLoader color="white" />{" "}
              </div>
            )}
          </div>

          <div className="w-full border-gray-800  max-h-[20vh] border-t  py-4 ">
            <div className=" w-[90vw] md:w-[65vw] mx-auto items-center ">
              <form
                className="w-full grid grid-cols-12   gap-x-2 flex items-center   "
                onSubmit={handleSubmit}
              >
                <input
                  type="text"
                  className=" col-span-9 md:col-span-11 text-white border border-[#2b2b2a] bg-[#1c1c1c]  rounded-3xl  px-4 py-2 focus:outline-none "
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setmessage(e.target.value);
                  }}
                />
                <button
                  className=" col-span-3 md:col-span-1 cursor-pointer  "
                  type="submit"
                >
                  <div className="w-[50px] h-[50px] rounded-full hover:bg-purple-800  transition  bg-purple-600 flex justify-center items-center ">
                    <BsSend className="text-white" />
                  </div>
                </button>
              </form>
            </div>
          </div> */}
        </div>
      )}
    </>
  );
};

export default PersonaChat;
