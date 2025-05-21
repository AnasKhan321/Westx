import { useNavigate, useParams } from "react-router-dom";
import { searchUser } from "../utils/apicalls";
import { useQuery } from "@tanstack/react-query";
import { IoCaretBack } from "react-icons/io5";
import React, { Suspense } from "react";
import PersonaLoading from "../ReusableComponents/PersonaLoading";
import Loader2 from "../ReusableComponents/Loader2";
import SEO from "../ReusableComponents/SEO";
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

  if(isLoading){
    return <Loader2 fullScreen={true}/>
  }
  return (
    <div className=" max-h-screen min-h-screen md:max-h-[96vh]  md:min-h-[96vh] bg-primaryColor  md:my-[2vh]  md:bg-secondaryColor  w-full rounded-l-2xl  border border-white/10 ">
      <SEO title={ "Search Result - " + query} description={"Search Result for " + query} />
      <div className="flex absolute  p-4 items-center space-x-2  backdrop-blur-xl   bg-secondaryColor/20 w-[49.9%] rounded-xl font-bold   "> 
        <IoCaretBack className="text-xl cursor-pointer" onClick={handleClick}/> 
        <span>Search Result</span>
       </div>
      
      {error && (
        <div className="font-bold text-center text-2xl  mt-16">
          {" "}
          Something Went Wrong!{" "}
        </div>
      )}
      {data?.success && (
        <>
          {data?.data && (
            <div className="mt-16">
              {data.data.length == 0 && (
                <div className="flex flex-col items-center justify-center mt-20 px-4">
                  <div className="text-center space-y-4 max-w-md">
                    <h3 className="text-xl font-bold text-white">
                      No Persona Found
                    </h3>
                    <p className="text-gray-400 text-sm">
                      This persona hasn't been added to WestX yet. You can be the first to add it!
                    </p>
                    <button
                      onClick={() => navigate('/persona/add')}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      <svg 
                        className="w-5 h-5" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M12 4v16m8-8H4" 
                        />
                      </svg>
                      Add New Persona
                    </button>
                    <p className="text-xs text-gray-500">
                      Search for this persona on Twitter and add them to WestX to start interacting.
                    </p>
                  </div>
                </div>
              )}
              {data.data.map((user, index) => {
                return <Suspense key={index} fallback={<PersonaLoading/>}><UserCard user={user} /></Suspense>;
              })}
            </div>
          )}
        </>
      )}

      
    </div>
  );
};

export default Explores;
