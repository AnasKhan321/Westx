import React from "react";
import { useAuth } from "../Context/AuthContext";
import { addReply } from "../utils/creationcall";
import toast from "react-hot-toast";

type ReplyBoxProps = {
  tweetid : string
};

const ReplyBox: React.FC<ReplyBoxProps> = ({    tweetid }) => {
  const [reply, setReply] = React.useState("");
  const {user}  = useAuth()

  const handleClick = async()=>{
      const response =  await addReply({tweetid : tweetid , userid : user?.id  as string , text : reply})
      if(response?.success){
        toast.success("Reply added !")
        setReply("")
      }
      
  }
  return (
    <div className="border-b border-borderColor  mx-auto">
      <div className="p-4 w-full  mx-auto  grid grid-cols-12 gap-x-2">
    
        <img src={user?.photoURL} alt="" className="  w-12 h-12 col-span-1 rounded-full" />

        <input
          value={reply}
          onChange={(e) => {
            setReply(e.target.value);
          }}
          className="col-span-9 border-none focus:outline-none bg-transparent"
          type="text"
          placeholder="Tweet Your Reply "
        />
        <button onClick={handleClick} className="col-span-2 text-center bg-territary disabled:bg-purple-500 rounded-full font-sans" disabled={!reply}>
          Reply
        </button>
      </div>
    </div>
   
  );
};

export default ReplyBox;
