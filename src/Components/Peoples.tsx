import { useQuery } from "@tanstack/react-query";
import UserCard from "../ReusableComponents/UserCard";
import ReuseableTitle from "../ReusableComponents/ReuseableTitle";
import Loader from "../ReusableComponents/Loader";
import { getPersonas } from "../utils/apicalls";
import { useAuth } from "../Context/AuthContext";




export default function Peoples(){

    const {isLoading , data , isError} = useQuery({queryKey : ['personas'], queryFn : getPersonas}); 
    const {user} = useAuth() ; 
    return(
        <> 
        
        <div className=" p-4 bg-black/10 border-b border-borderColor  top-0 absolute  backdrop-blur-xl  font-bold   w-[41.5%] "> Personas </div>
        {isLoading && <Loader />}
        {isError && <div>Error...</div>}
        {data && <div>
            <ReuseableTitle title="Personas" />

            <div className="mt-16">

            {data.data.map((userd  , index ) => (
                <> 
                {user?.username === userd.username? ( <div> </div> )  : (

                    <>
                    <UserCard key={index} user={userd}  /> 
                    </>
                )}
             
                
                
                </>
                    
            ))}    
            </div>

            </div>
            
            }
        </>

    )
}