import { useAuth } from "../Context/AuthContext";

import { User } from "../utils/type";
import ProfilePage from "./Profile2";
import SEO from "../ReusableComponents/SEO";

const ProfileDetail = () => {
  const { user } = useAuth();

  return (
    <>
      <SEO title={ "Profile - " + user?.username} description={user?.bio} />
      <ProfilePage  user={user as User}/> 
    </>
  );
};

export default ProfileDetail;
