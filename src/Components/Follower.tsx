import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getUserFollower } from "../utils/apicalls";
import Loader from "../ReusableComponents/Loader";


import { IoCaretBack } from "react-icons/io5";
import React, { Suspense } from "react";
import SmallLoader from "../ReusableComponents/SmallLoader";


const UserCard = React.lazy(() => import("../ReusableComponents/UserCard"));

const Follower = () => {
  const { username } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: [`USER:FOLLOWERS:${username}`],
    queryFn: () => getUserFollower(username as string),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const navigate = useNavigate();
  const handleClick = ()=>{
          navigate(-1);
  }
  return (
    <div className="w-full  border border-white/10 min-h-screen   md:max-h-[96vh] md:my-[2vh] md:min-h-[96vh]  overflow-y-scroll rounded-2xl   bg-primaryColor md:bg-secondaryColor">
          <div className="flex absolute p-4 items-center space-x-2  backdrop-blur-xl   bg-secondaryColor/20  w-full md:w-[50%] rounded-2xl font-bold   "> 
            <IoCaretBack className="text-xl cursor-pointer" onClick={handleClick}/> 
            <span>Follower</span>
           </div>
      <div className="mt-12">
        {isLoading && <Loader />}

        {data?.data && (
          <div>
            {data?.data?.length == 0 && (
              <>
                <div className="text-center font-bold mt-14 text-xl ">
                  {" "}
                  He Does not Have Any Follower{" "}
                </div>
              </>
            )}
            {data?.data?.map((user, index) => {
      

                
              
              return         <Suspense key={index} fallback={<SmallLoader/>}> <UserCard user={user.follower}  /></Suspense>;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Follower;
