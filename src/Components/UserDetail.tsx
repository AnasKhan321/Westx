import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import ReuseableTitle from "../ReusableComponents/ReuseableTitle";
import Loader from "../ReusableComponents/Loader";
import Profile from "../ReusableComponents/UserDetails";
import { getUserbyUsername } from "../utils/apicalls";





export default function UserDetail() {
  const { username } = useParams();


  const {data : userdata , isLoading : userLoading , error : usererror} = useQuery({queryKey : [`user:${username}`]  ,  queryFn : ()=> getUserbyUsername(username as string)  , 
    staleTime: Infinity, 
    refetchOnMount: false, 
    refetchOnWindowFocus: false, 
   })
  return (
    <div>
          <ReuseableTitle title={username as string} />

      {userLoading && <Loader />}
      {usererror && <div>Error...</div>}
      {userdata?.success && (
        <>
          {" "}
          <div className="mt-16">
            <Profile profile={userdata?.data} />
          </div>
        </>
      )}
      {userdata?.success == false && (
          <div className="mt-16">
          <div className="text-center font-bold text-xl mt-4"> User not Found !</div>
        </div>
      )}
    </div>
  );
}
