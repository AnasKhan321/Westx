import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Loader from "../ReusableComponents/Loader";
import Profile from "../ReusableComponents/UserDetails";
import { getUserbyUsername } from "../utils/apicalls";
import { useAuth } from "../Context/AuthContext";
import ProfilePage from "./Profile2";
import { User } from "../utils/type";






export default function UserDetail() {
  const { username } = useParams();

  const {user}  =useAuth() ; 

  const {data : userdata , isLoading : userLoading , error : usererror} = useQuery({queryKey : [`user:${username}`]  ,  queryFn : ()=> getUserbyUsername(username as string)  , 
    staleTime: Infinity, 
    refetchOnMount: false, 
    refetchOnWindowFocus: false, 
   })
  return (
    <div>
      {userLoading &&  <div className="bg-secondaryColor rounded-2xl min-h-[96vh]  my-[2vh] ">
        <Loader/> 
      </div> }
      {usererror && <div>Error...</div>}
      {userdata?.success && (
        <>
          {" "}
          {userdata.data.username === user?.username? <ProfilePage user={userdata.data as User}/> :  <Profile profile={userdata.data} />  }
        </>
      )}
      {userdata?.success == false && (
       
          <div className="text-center bg-secondaryColor rounded-xl min-h-[96vh]  my-[2vh] font-bold text-xl mt-4 flex justify-center items-center">  Currently User is not Available !</div>
       
      )}
    </div>
  );
}
