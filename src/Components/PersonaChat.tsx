import { Link, useNavigate, useParams } from "react-router-dom";
import { getUserbyUsername } from "../utils/apicalls";
import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { BsSend } from "react-icons/bs";
import { useAuth } from "../Context/AuthContext";
import { ScaleLoader } from "react-spinners";
import { Message } from "../utils/type";
import { getAiResponse } from "../ai";
import { IoCaretBack } from "react-icons/io5";
import axios from "axios";
import { ColorRing } from "react-loader-spinner";

interface ChatMessages {
  success: boolean;
  messages: Message[];
}

const getChat = async (user1: string, user2: string): Promise<ChatMessages> => {
  if (user1 == undefined) {
    return {
      success: false,
      messages: [],
    };
  }
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
  const { user, isAuthenticated } = useAuth();

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

    const initializeChat = async () => {
      // Fetch previous chat
      const chatResponse = await getChat(
        user?.username as string,
        username as string
      );


      if (chatResponse.success) {
        setchats(chatResponse.messages);
      }
    };


    void initializeChat();

  }, [data?.data?.username, user?.username, username]);

  useEffect(() => {
    if (chats.length !== 0) {

      if (!isAuthenticated) {
        return;
      };
      const updateChat = async () => {
        await axios.post(`${import.meta.env.VITE_PUBLIC_AI_URL}/saveChat`, {
          user1: user?.username,
          user2: username,
          messages: chats,
        });
      };

      void updateChat();

    }
  }, [chats])

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add this scroll to bottom effect
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll when chats change or loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [chats, isloading]);




  const navigate = useNavigate();
  const handleClick = () => {
    navigate(-1);
  };

  return (
    <>
      {isLoaddingg && <div className="min-h-screen min-w-screen flex items-center bg-black justify-center" > 
        <ColorRing
          visible={true}
          height="70"
          width="70"
          ariaLabel="color-ring-loading"
          wrapperStyle={{}}
          wrapperClass="color-ring-wrapper"
          colors={["#9915eb"  ,  "#9915eb" , "#9915eb" , "#9915eb" , "#9915eb"]}
        /> </div> }
      {error && (
        <div className="min-h-screen min-w-screen flex items-center bg-primary justify-center">
          {" "}
          Error ..{" "}
        </div>
      )}
      {data && (
        <div className="grid grid-cols-16  bg-primaryColor text-secondary min-h-screen max-h-screen overflow-x-hidden font-roboto  "  style={{
          backgroundImage: `url('/chatb.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          
        }} >
          <div className="   tablet:col-span-3">
            <Link to={"/"}>
              <img
                src="/logo-round.png" // Replace with the profile image path
                alt="WestX Logo"
                className="w-16 h-16 rounded-full m-4 tablet:block hidden "
              />{" "}
            </Link>
          </div>
          <div className="  border-white/10 md:border col-span-16  min-h-screen max-h-screen  tablet:col-span-10 bg-primaryColor tablet:bg-secondaryColor  tablet:max-h-[96vh]    md:min-h-[96vh]  md:my-[2vh] md:rounded-2xl ">
            <div className="w-[97%] mx-auto">
              <div className="pt-2 pb-2   h-[10vh]  border-b border-white/20 flex space-x-4 items-center    ">
                <IoCaretBack
                  className="text-xl cursor-pointer"
                  onClick={handleClick}
                />
                <img
                  src={data.data.photoURL}
                  alt=""
                  className="w-[50px] h-[50px]  rounded-full "
                  onError={(e) => {
                    e.currentTarget.src = "/userdefault.jpg";
                  }}
                />
                <span className="font-bold "> Chat with {data.data.name} </span>
              </div>

              <div className="w-full h-[76vh]  overflow-y-scroll  mb-2  ">

                {chats.map((chat, index) => (
                  <div
                    key={index}
                    className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"
                      } my-1 `}
                  >
                    <div
                      key={index}
                      className={`p-3  text-sm  md:text-base rounded-lg ${chat.sender === "user"
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

                <div ref={messagesEndRef} />
              </div>

              <div className="w-full h-[10vh] my-auto ">
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
        </div>
      )}
    </>
  );
};

export default PersonaChat;
