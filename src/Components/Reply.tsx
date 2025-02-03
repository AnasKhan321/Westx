import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Link, useParams } from "react-router-dom"
import { getReplyiess, Replydetail } from "../utils/apicalls"
import Loader from "../ReusableComponents/Loader"
import ReplyCard from "../ReusableComponents/ReplyCard"
import { DynamicText } from "../ReusableComponents/DynamicText"
import { timeSince } from "../utils/date"
import ReuseableTitle from "../ReusableComponents/ReuseableTitle"
import { useAuth } from "../Context/AuthContext"
import { useState } from "react"
import { addReplyParent } from "../utils/creationcall"
import toast from "react-hot-toast"



const Reply = () => {
    const {id}  = useParams()
    const {data , isLoading , isError}  = useQuery({queryKey : [`Reply:${id}`]  , queryFn : ()=> Replydetail(id as string)})
    const {user}  = useAuth()
    const [reply, setReply]  = useState("")
    const {data:childrendata  }  = useQuery({queryKey : [`Reply:Reply:${id}`]  , 
        queryFn : ()=> getReplyiess(id as string)
    })
    const queryClient = useQueryClient();

    const handleClick = async()=>{
        const response =  await addReplyParent({replyid : id as string , userid : user?.id  as string , text : reply})
        if(response?.success){
          toast.success("Reply added !")
          
           queryClient.invalidateQueries({ queryKey:  [`Reply:Reply:${id}`] });
          setReply("")
        }
    }
  return (
    <div>
        <ReuseableTitle title={"Reply"}/>
        <div className="mt-16"></div>
      {isLoading && <Loader/> }

      {data?.data && <div className="py-4 mb-2 border-b-borderColor px-2 border-b-2 ">
        
        <Link to={`/reply/${data.data.id}`}>
        <div className="flex items-start space-x-3">
          <img
            src={data.data.user.photoURL}
            alt={data.data.user.name}
            width={48}
            height={48}
            className="rounded-full"
          />
          <div>
            <div className="flex items-center space-x-2">
              <Link to={`/user/${data.data.user.username}`}>
                {" "}
                <div className="flex items-center gap-x-2">
                  <span className=" text-sm md:text-base font-bold  hover:underline">
                    {data.data.user.name}
                  </span>{" "}
                  {data.data.user.isPremium && (
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
              </Link>
              <Link to={`/user/${data.data.user.username}`}>
                {" "}
                <span className="text-sm  text-gray-400 md:text-base ">{data.data.user.username} · </span>
                <span className="text-sm text-gray-400  md:text-base ">
                  {" "}
                  {timeSince(data.data.createdAt)}{" "}
                </span>
              </Link>
            </div>
            <p><DynamicText text={data.data.content}  postedBy="assistant"/></p>
          </div>
        </div>
    
      </Link>

        
         </div>}

        {data?.data &&     <div className="p-4 w-full  mx-auto  grid grid-cols-12 gap-x-2 border-b-borderColor border-b-2 ">
    
    <img src={user?.photoURL} alt="" className="  w-[100px] col-span-1 rounded-full" />

    <input
      value={reply}
      onChange={(e) => {
        setReply(e.target.value);
      }}
      className="col-span-9 border-none focus:outline-none bg-transparent"
      type="text"
      placeholder="Your Reply "
    />
    <button onClick={handleClick} className="col-span-2 text-center bg-territary disabled:bg-purple-500 rounded-full font-sans" disabled={!reply}>
      Reply
    </button>
  </div>}
      {/* {data?.data.children.map((item)=> {
        return(
            <ReplyCard reply={item}  key={item.id}/>
        )


      })} */}


      {childrendata?.data && <> 
      {childrendata?.data.map((item)=> {
        return(
            <ReplyCard reply={item}  key={item.id}/>

        )
      })}</>}
      {isError && <div> Error ... </div> }
    </div>
  )
}

export default Reply
