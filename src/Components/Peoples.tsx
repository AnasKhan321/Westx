import { useQuery } from "@tanstack/react-query";

import Loader from "../ReusableComponents/Loader";
import { getPersonas } from "../utils/apicalls";
import { useAuth } from "../Context/AuthContext";
import { IoCaretBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Suspense } from "react";
import SmallLoader from "../ReusableComponents/SmallLoader";
import React from "react";

const UserCard = React.lazy(() => import("../ReusableComponents/UserCard"));


export default function Peoples(){

    const {isLoading , data } = useQuery({queryKey : ['personas'], queryFn : getPersonas  , 


        staleTime: Infinity, 
        refetchOnMount: false, 
        refetchOnWindowFocus: false, 
    }); 
    const navigate = useNavigate();
    const handleClick = ()=>{
            navigate(-1);
    }
    const {user} = useAuth() ; 
    return(
        <> 
        
        <div className=" max-h-screen md:max-h-[96vh] border border-white/10   md:rounded-xl md:my-[2vh] overflow-y-scroll bg-primaryColor    w-full md:bg-secondaryColor min-h-screen  md:min-h-[96vh]">

    
          <div className="flex absolute p-4 items-center space-x-2  backdrop-blur-xl   bg-secondaryColor/20 w-full  md:w-[50%] rounded-xl font-bold   "> 
            <IoCaretBack className="text-xl cursor-pointer" onClick={handleClick}/> 
            <span>Personas</span>
           </div>

                {isLoading && <Loader/> }

                    {data && <div className="mt-12">

            

            {data.data.map((userd  , index ) => (
               <div key={index}> 
                {user?.username === userd.username? ( <div> </div> )  : (

                    <>
                    <Suspense key={index} fallback={<SmallLoader/>}> <UserCard user={userd}  /></Suspense>;
                    </>
                )}
             
                
                
                </div>
                    
            ))}    


            </div>
            
            } 
        </div>
    
    


        </>

    )
}