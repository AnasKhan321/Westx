import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { addReply } from "../utils/creationcall";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { LuSend } from "react-icons/lu"
import { ColorRing } from "react-loader-spinner";
type ReplyBoxProps = {
  tweetid: string;
};

const ReplyBox: React.FC<ReplyBoxProps> = ({ tweetid }) => {
  const [reply, setReply] = React.useState("");
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isLoading , setisLoading]  = useState(false)

  const handleClick = async () => {

    if(isLoading){
      return ; 
    }
    setisLoading(true)

    const response = await addReply({
      tweetid: tweetid,
      userid: user?.id as string,
      text: reply,
    });
    if (response?.success) {
      toast.success("Reply added !");
      
      queryClient.invalidateQueries({ queryKey: [`Tweet:Reply:${tweetid}`] });
    }
    setReply("");
    setisLoading(false)
  };

  return (
    <div className="border-b border-borderColor  mx-auto  my-4  ">
      <div className="p-4  w-[98%] md:w-[93%]  mx-auto  grid grid-cols-12 gap-x-2  justify-center items-center">
      <img
          src={user?.photoURL}
          alt={user?.username}
          width={48}
          height={48}
          className="rounded-full col-span-2 md:col-span-1 "
        />

        <input
          value={reply}
          onChange={(e) => {
            setReply(e.target.value);
          }}
          className=" text-sm md:text-base col-span-8 md:col-span-10 border border-white bg-[#464646] rounded-full   px-2 py-2  focus:outline-none bg-transparent"
          type="text"
          placeholder="Tweet Your Reply "
        />
        <button
          onClick={handleClick}
          className=" col-span-2 md:col-span-1 text-center flex items-center justify-center p-4 cursor-pointer bg-territary disabled:bg-purple-500 rounded-full font-sans"
          disabled={!reply}
        >
          {isLoading?   <ColorRing
                                  visible={true}
                                  height="20"
                                  width="20"
                                  ariaLabel="color-ring-loading"
                                  wrapperStyle={{}}
                                  wrapperClass="color-ring-wrapper"
                                  colors={["#ffffff"  ,  "#ffffff" , "#ffffff" , "#ffffff" , "#ffffff"]}/>
          :<LuSend/> 
            }
        </button>
      </div>
    </div>
  );
};

export default ReplyBox;
