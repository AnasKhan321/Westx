import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { getUserFollowing } from "../utils/apicalls"
import { IoCaretBack } from "react-icons/io5"
import { Suspense } from "react"
import React from "react"
import PersonaLoading from "../ReusableComponents/PersonaLoading"
import Loader2 from "../ReusableComponents/Loader2"
import SEO from "../ReusableComponents/SEO"
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
      <SEO title={ `Following - ${username}`} description={`Following page for ${username}`} />
          <div className="flex absolute p-4 items-center space-x-2  backdrop-blur-xl   bg-secondaryColor/20 w-full  md:w-[50%] rounded-xl font-bold   "> 
            <IoCaretBack className="text-xl cursor-pointer" onClick={handleClick}/> 
            <span>Following</span>
           </div>
    <div className="mt-12">
      {isLoading && <Loader2 fullScreen={true}/>}

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
            return <Suspense key={index} fallback={<PersonaLoading/>}> <UserCard user={user.following}  /></Suspense>;
          })}
        </div>
      )}
    </div>
  </div>
  )
}

export default Following
