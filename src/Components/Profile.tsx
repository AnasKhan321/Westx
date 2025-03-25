import { useAuth } from "../Context/AuthContext";

import { User } from "../utils/type";
import ProfilePage from "./Profile2";
import SEO from "../ReusableComponents/SEO";
import Authrequired from "../ReusableComponents/Authrequired";

const ProfileDetail = () => {
  const { user } = useAuth();
  const {isAuthenticated} = useAuth()
  return (
    <>
      <SEO title={ "Profile - " + user?.username} description={user?.bio} />
      {isAuthenticated ? (
        <ProfilePage  user={user as User}/> 
      ) : (
        <Authrequired description="Showcase your AI interactions & personalize your digital identity."/>
      )}
    </>
  );
};

export default ProfileDetail;
