import { useNavigate, useParams } from "react-router-dom";
import { searchUser } from "../utils/apicalls";
import { useQuery } from "@tanstack/react-query";
import Loader from "../ReusableComponents/Loader";

import { IoCaretBack } from "react-icons/io5";
import React, { Suspense } from "react";
import SmallLoader from "../ReusableComponents/SmallLoader";
const UserCard = React.lazy(() => import("../ReusableComponents/UserCard"));
const Explores = () => {
  const { query } = useParams();
  const { data, error, isLoading } = useQuery({
    queryKey: ["query", query],
    queryFn: () => searchUser(query as string),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const navigate = useNavigate();
  const handleClick = ()=>{
          navigate(-1);
  }
  return (
    <div className=" max-h-screen min-h-screen md:max-h-[96vh]  md:min-h-[96vh] bg-primaryColor  md:my-[2vh]  md:bg-secondaryColor  w-full rounded-2xl  border border-white/10 ">
      <div className="flex absolute  p-4 items-center space-x-2  backdrop-blur-xl   bg-secondaryColor/20 w-[50%] rounded-xl font-bold   "> 
        <IoCaretBack className="text-xl cursor-pointer" onClick={handleClick}/> 
        <span>Search Result</span>
       </div>
      
      {isLoading && <Loader />}
      {error && (
        <div className="font-bold text-center text-2xl  mt-8">
          {" "}
          Something Went Wrong!{" "}
        </div>
      )}
      {data?.success && (
        <>
          {data?.data && (
            <div className="mt-12">
             

              {data.data.length == 0 && (
                <div className="text-center font-bold text-xl mt-12">
                  Not found any user!
                </div>
              )}
              {data.data.map((user, index) => {
                return     <Suspense key={index} fallback={<SmallLoader/>}> <UserCard user={user}  /></Suspense>;
              })}
          </div>
          )}
        </>
      )}

      {!data?.success && <div className=""> Something went Wrong Try Again !  </div> }
    </div>
  );
};

export default Explores;
