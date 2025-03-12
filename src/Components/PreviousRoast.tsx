import axios from "axios"
import {  User } from "../utils/type";
import { useQuery } from "@tanstack/react-query";
import { DynamicText2 } from "../ReusableComponents/DynamicText";
import { IoCaretBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Loader2 from "../ReusableComponents/Loader2";
import SEO from "../ReusableComponents/SEO";
interface Chats {
    user : string , 
    content : string
  }

interface Response {
    success : boolean , 
    messages : Chats[] , 
    user1 : User , 
    user2 : User
}

const fetchPreviousShow = async() : Promise<Response> =>  {
   
    const {data}   = await axios.get<Response>(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/previousshow`)

    return data ; 
}

const PreviousRoast = () => {
  const navigate = useNavigate() ; 
    const { data , isLoading  } = useQuery({
        queryKey: [`PREVIOUS:SHOW`],
        queryFn: async () => await fetchPreviousShow(),
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
   
      });

     const handleClick = ()=>{
      navigate(-1)
     }
  return (
    <div className="md:min-h-[96vh] border border-white/10   md:max-h-[96vh]   md:my-[2vh]  w-full bg-primaryColor md:bg-secondaryColor  md:rounded-xl">
      <SEO title={ "Previous Roast"} description={"Previous Roast page where you can see the previous roast"} />
        {data  && <div> 
            <div className="border-white/20   flex items-center  border-b  py-3  mx-auto   max-h-[10vh]  ">
            <div className=" ml-2 md:ml-10 cursor-pointer " onClick={handleClick}>
            <IoCaretBack className="text-xl "/> 

            </div>
            <div className="flex justify-between  items-center w-[95%] md:w-[75%] mx-auto  ">
              
              <div className="flex  items-center space-x-2">
                <img
                  src={data.user1?.photoURL}
                  alt=""
                  className="h-[50px] rounded-full "
                />
                <span className="font-bold text-sm md:text-base">
                  {" "}
                  {data.user1?.name}{" "}
                </span>
              </div>

              <div className="font-bold"> V/S </div>
              <div className="flex  items-center space-x-2">
                <img
                  src={data.user2?.photoURL}
                  alt=""
                  className="h-[50px] rounded-full "
                />
                <span className="font-bold  text-sm md:text-base ">
                  {" "}
                  {data.user2?.name}{" "}
                </span>
              </div>
            </div>
          </div>
          <div className=" w-[98%] mx-auto   max-h-[85vh]  overflow-y-scroll">
            {data.messages.map((chat, index) => (
              <div
                key={index}
                className={`flex ${
                  chat.user === data.user1?.username
                    ? "justify-start"
                    : "justify-end"
                } my-2 `}
              >
                <div
                  key={index}
                  className={`p-3 my-2   text-xs   md:text-base rounded-lg ${
                    chat.user === data.user2?.username
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
                className={` "block" : "hidden"} justify-start`}
              >
                {" "}
              
              </div>


            </div>
          </div>

            
            </div>}
        {isLoading && <Loader2 fullScreen={true}/> }
        
    </div>
  )
}

export default PreviousRoast
