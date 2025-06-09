import {  useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Followings2 } from "../utils/apicalls";
import { IoCaretBack } from "react-icons/io5";
import React, { Suspense } from "react";
import PersonaLoading from "../ReusableComponents/PersonaLoading";
import Loader2 from "../ReusableComponents/Loader2";
import SEO from "../ReusableComponents/SEO";


const UserCard = React.lazy(() => import("../ReusableComponents/UserCard"));


const getUserFollower = async ({ userid }: { userid: string }): Promise<Followings2[]> => {
  const res = await fetch(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/user/follower/${userid}`)
  const data = await res.json();

  return data.data;
}

const Follower = () => {
  const { username } = useParams();
  const navigate = useNavigate()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`USER:FOLLOWERS:${username}`],
    queryFn: () => getUserFollower({ userid: username as string }),
  })

  const handleClick = () => {
    navigate(-1)
  }



  return (
    <div className="tablet:min-h-[98vh] min-h-screen max-h-screen  tablet:max-h-[98vh]  tablet:mt-[2vh] bg-primaryColor tablet:bg-secondaryColor overflow-y-scroll rounded-l-xl border border-white/10 ">
      <SEO title={`Followers - ${username} `} description={"Followers page where you can see all your followers"} />
      <div className="flex   absolute p-4 items-center space-x-2   backdrop-blur-xl     bg-secondaryColor/20 w-full  tablet:w-[49.8%]  tablet:rounded-xl font-bold   ">
        <IoCaretBack
          className="text-xl cursor-pointer"
          onClick={handleClick}

        />
        <span>Followers</span>
      </div>
      {isLoading && <Loader2 fullScreen={true} />}
      <div className="mt-14"> </div>
      {data?.length == 0 && <div className="text-center text-gray-200  font-bold text-xl  ">No Followers Yet</div>}
      {isError && <div className="text-red-500">Error: {error.message}</div>}

      {data?.map((user) => (
        <Suspense fallback={<PersonaLoading />} key={user.id}>
          <UserCard user={user.follower} /> </Suspense>
      ))}
       <div className=" tablet:mb-4 mb-16"> </div>
           
    </div>
  )

};

export default Follower;