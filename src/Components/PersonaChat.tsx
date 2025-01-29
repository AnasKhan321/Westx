import { Link, useParams } from "react-router-dom";
import { getUserbyUsername } from "../utils/apicalls";
import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { BsSend } from "react-icons/bs";
import { useAuth } from "../Context/AuthContext";
import { ScaleLoader } from "react-spinners";
import Loader from "../ReusableComponents/Loader";
interface Message {
  sender: string;
  content: string;
}

const PersonaChat = () => {
  const { username } = useParams();
  const {
    data,
    error,
    isLoading: isLoaddingg,
  } = useQuery({
    queryKey : [`user:${username}`] ,
    queryFn: () => getUserbyUsername(username as string),
  });
  const [chats, setchats] = useState<Message[]>([]);
  const [isloading, setisloading] = useState(false);
  const [message, setmessage] = useState("");
  const { user } = useAuth();
  const [loading, setloading] = useState(false);

  const handleStreamRequest = async (message: string) => {
    const res = await fetch("https://ai.westx.xyz/api/omi/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        question: message,
        messages: chats,
        recenttweets: [],
      }),
    });

    setisloading(true);

    if (!res.body) {
      console.error("No response body");
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let currentMessage = "";

    let isReading = true;

    while (isReading) {
      const { done, value } = await reader.read();
      if (done) {
        isReading = false;
        setisloading(false);
        break;
      }

      const chunk = decoder.decode(value).split("\n");
      chunk.forEach((line) => {
        if (line.startsWith("data: ")) {
          let jsonData = line.replace("data: ", "").trim();
          jsonData = jsonData.replace("data: ", "");
          if (jsonData === "[DONE]") {
            setisloading(false);
            isReading = false;
            return;
          }
          if (jsonData === "[END]") {
            setisloading(false);
            isReading = false;
            return;
          }

          try {
            const parsedData = JSON.parse(jsonData);
            const content = parsedData?.choices?.[0]?.delta?.content;

            if (content) {
              currentMessage += content;

              setchats((prevChats) => {
                const updatedChats = [...prevChats];
                if (
                  updatedChats.length &&
                  updatedChats[updatedChats.length - 1]?.sender === "assistant"
                ) {
                  updatedChats[updatedChats.length - 1].content =
                    currentMessage.trim();
                } else {
                  updatedChats.push({
                    sender: "assistant",
                    content: currentMessage.trim(),
                  });
                }
                return updatedChats;
              });
            }
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        }
      });
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
    if (data?.data.username) {
      const initializeChat = async () => {
        setloading(true);
        await handleStreamRequest(
          `${user?.name}  is here to come and chat with you either roast him or greet him  `
        );
        setloading(false);
      };

      void initializeChat();
    }
  }, []);

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
        <div className="bg-primary min-h-screen max-h-screen">
          <div className="border-gray-800  border-b  py-3   max-h-[10vh] flex justify-between  items-center  ">
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
          </div>
        </div>
      )}
    </>
  );
};

export default PersonaChat;
