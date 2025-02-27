import { useAuth } from "../Context/AuthContext";

import { User } from "../utils/type";
import ProfilePage from "./Profile2";

const ProfileDetail = () => {
  const { user } = useAuth();

  return (
    <>

      <ProfilePage  user={user as User}/> 
    </>
  );
};

export default ProfileDetail;
