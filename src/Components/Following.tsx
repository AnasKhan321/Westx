import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { getUserFollowing } from "../utils/apicalls"
import Loader from "../ReusableComponents/Loader"
import { IoCaretBack } from "react-icons/io5"
import { Suspense } from "react"
import SmallLoader from "../ReusableComponents/SmallLoader"
import React from "react"
const UserCard = React.lazy(() => import("../ReusableComponents/UserCard"));


const Following = () => {

    const {username} = useParams()


    
    const {data , isLoading }  = useQuery({queryKey : [`USER:FOLLOWING:${username}`]  , 
        queryFn: ()=> getUserFollowing(username as string),
        staleTime: Infinity, 
        refetchOnMount: false, 
        refetchOnWindowFocus: false, 
     })

     const navigate = useNavigate();
     const handleClick = ()=>{
             navigate(-1);
     }
    
  return (
    <div className="w-full max-h-screen  md:max-h-[96vh] border border-white/10  md:my-[2vh] min-h-screen md:min-h-[96vh]  overflow-y-scroll md:rounded-xl bg-primaryColor   md:bg-secondaryColor">
          <div className="flex absolute p-4 items-center space-x-2  backdrop-blur-xl   bg-secondaryColor/20 w-full  md:w-[50%] rounded-xl font-bold   "> 
            <IoCaretBack className="text-xl cursor-pointer" onClick={handleClick}/> 
            <span>Following</span>
           </div>
    <div className="mt-12">
      {isLoading && <Loader />}

      {data?.data && (
        <div>
          {data?.data?.length == 0 && (
            <>
              <div className="text-center font-bold mt-14 text-xl ">
                {" "}
                He Does not Have Any Following
              </div>
            </>
          )}
          {data?.data?.map((user, index) => {
            return <Suspense key={index} fallback={<SmallLoader/>}> <UserCard user={user.following}  /></Suspense>;
          })}
        </div>
      )}
    </div>
  </div>
  )
}

export default Following
