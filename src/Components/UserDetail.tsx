import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import ReuseableTitle from "../ReusableComponents/ReuseableTitle";
import Loader from "../ReusableComponents/Loader";
import Profile from "../ReusableComponents/UserDetails";
import { getUserbyUsername } from "../utils/apicalls";

export default function UserDetail() {
  const { username } = useParams();


  const {data : userdata , isLoading : userLoading , error : usererror} = useQuery({queryKey : [`user:${username}`]  ,  queryFn : ()=> getUserbyUsername(username as string) })
  return (
    <div>
      {userLoading && <Loader />}
      {usererror && <div>Error...</div>}
      {userdata?.success && (
        <>
          {" "}
          <ReuseableTitle title={userdata?.data.name} />
          <div className="mt-16">
            <Profile profile={userdata?.data} />
          </div>
        </>
      )}
    </div>
  );
}
