import { useQuery } from "@tanstack/react-query";
import UserCard from "../ReusableComponents/UserCard";
import ReuseableTitle from "../ReusableComponents/ReuseableTitle";
import Loader from "../ReusableComponents/Loader";
import { getPersonas } from "../utils/apicalls";
import { useAuth } from "../Context/AuthContext";




export default function Peoples(){

    const {isLoading , data , isError} = useQuery({queryKey : ['personas'], queryFn : getPersonas  , 


        staleTime: Infinity, 
        refetchOnMount: false, 
        refetchOnWindowFocus: false, 
    }); 
    const {user} = useAuth() ; 
    return(
        <> 
        
        <ReuseableTitle title="Personas" />
    
        {isLoading && <Loader />}
        {isError && <div>Error...</div>}
        {data && <div>

            <div className="mt-16">

            {data.data.map((userd  , index ) => (
               <div key={index}> 
                {user?.username === userd.username? ( <div> </div> )  : (

                    <>
                    <UserCard key={index} user={userd}  /> 
                    </>
                )}
             
                
                
                </div>
                    
            ))}    
            </div>

            </div>
            
            }
        </>

    )
}