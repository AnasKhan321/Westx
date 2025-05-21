import { useQuery } from "@tanstack/react-query";
import { getPersonas } from "../utils/apicalls";
import { useAuth } from "../Context/AuthContext";
import { IoCaretBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Suspense } from "react";
import React from "react";
import PersonaLoading from "../ReusableComponents/PersonaLoading";
import Loader2 from "../ReusableComponents/Loader2";
import SEO from "../ReusableComponents/SEO";
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
        <SEO title={ "WestX - Personas "} description={"Personas page where you can see all the personas"} />
        <div className=" max-h-screen md:max-h-[98vh] border border-white/10 mb-16 xl:mb-0   md:rounded-l-2xl md:mt-[2vh] overflow-y-scroll bg-primaryColor    w-full md:bg-[#0E1014] min-h-screen  md:min-h-[96vh]">

    
          <div className="flex absolute p-4 items-center space-x-2  backdrop-blur-xl   bg-newcolor w-full  md:w-[49.8%] rounded-2xl font-bold   "> 
            <IoCaretBack className="text-xl cursor-pointer" onClick={handleClick}/> 
            <span>Personas</span>
           </div>

                {isLoading && <Loader2 fullScreen={true}/> }

                    {data && <div className="mt-16">

            

            {data.data.map((userd  , index ) => (
               <div key={index}> 
          

                    <>
                    <Suspense key={index} fallback={<PersonaLoading/>}> <UserCard user={userd}  /></Suspense>
                    </>
                
             
                
                
                </div>
                    
            ))}    


            </div>
            
            } 
        </div>
    
    


        </>

    )
}