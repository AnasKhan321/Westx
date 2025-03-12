import { ChangeEvent, useEffect, useState, KeyboardEvent } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../ReusableComponents/Loader";
import { ColorRing } from "react-loader-spinner";
import toast from "react-hot-toast";

interface TwitterUser {
  profile: string;
  name: string;
  avatar: string;
  blue_verified: boolean;
  status: string;
}

interface TwitterResponse {
  success: boolean;
  data: TwitterUser;
}

interface CreateUserResponse {
  success: boolean;
}

const formatTwitterAvatarUrl = (url: string): string => {
  if (!url) return "/omi-avatar.svg";
  let formattedUrl = url.replace("http://", "https://");
  formattedUrl = formattedUrl.replace("_normal", "");
  if (formattedUrl.includes("pbs.twimg.com")) {
    formattedUrl = formattedUrl.replace("/profile_images/", "/profile_images/");
  }
  return formattedUrl;
};

const Aiworld = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setsearch] = useState("");
  const [twitteruser, settwitteruser] = useState<TwitterUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userLoading, setuserLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setsearch(e.target.value);

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim()) {
      setIsLoading(true);
      const { data } = await axios.get<TwitterResponse>(
        `${import.meta.env.VITE_PUBLIC_AI_URL}/searchTwitter/${search}`
      );
      if (data.success) {
        settwitteruser(data.data);
      }
      setIsLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (twitteruser) {
      setuserLoading(true);
      const { data } = await axios.post<CreateUserResponse>(
        `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/api/user/PremiumUser`,
        {
          username: twitteruser.profile,
        }
      );
    

      setuserLoading(false);
      if (data.success) {
        toast.success("User Created Successfully !" , {
          style: {
            borderRadius: '20px',
            background: '#333',
            color: '#fff',
          },
          
        });
      }
    }
  };

  useEffect(() => {
    if (user?.username !== import.meta.env.VITE_PUBLIC_ADMIN_USERNAME) {
      navigate("/");
    }
  }, []);

  return (
    <div className="w-full h-screen max-h-screen  bg-primaryColor  md:min-h-[96vh] md:max-h-[96vh] md:my-[2vh]  md:rounded-2xl  md:bg-secondaryColor  ">
      <div className="">
        <div className="w-[90%] py-4   mx-auto">
          <input
            type="text"
            placeholder="Search on Twitter"
            value={search}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="w-full  mx-auto px-4 py-2 bg-white/10 rounded-full border border-white/20  text-white placeholder-gray-400  focus:outline-none"
          />
        </div>

        {twitteruser && (
          <>
            {!isLoading && (
              <>
                {twitteruser.status === "notfound" && (
                  <div className="text-center font-bold mt-5 text-xl">
                    {" "}
                    User not found !{" "}
                  </div>
                )}

                {twitteruser.status !== "notfound" && (
                  <div className="mx-6 my-4">
                    <div className="flex items-center bg-white/10  text-white  rounded-lg p-4 w-full font-sans">
        
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 mr-4">
                        <img
                          src={formatTwitterAvatarUrl(twitteruser.avatar)} 
                          alt="User Avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
             
                      <div className="flex-grow">
                        <div className="font-bold flex gap-x-2 items-center">
                          {" "}
                          {twitteruser.name}{" "}
                          <span>
                            {twitteruser.blue_verified && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="#db12ff"
                                className="size-6"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </span>{" "}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {" "}
                          @{twitteruser.profile}{" "}
                        </div>
                      </div>
           
                      <button
                        onClick={handleCreateUser}
                        className="  bg-purple-800 rounded-full    text-white  px-4 py-2  font-bold text-sm hover:bg-gray-300"
                      >
                        Import
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {isLoading && (
          <div className="mx-auto w-full ">
            {" "}
            <Loader />{" "}
          </div>
        )}
        {userLoading && (
          <div className="flex items-center justify-center flex-col">
            <span> Creating User ... </span>
            <ColorRing
              visible={true}
              height="30"
              width="30"
              ariaLabel="color-ring-loading"
              wrapperStyle={{}}
              wrapperClass="color-ring-wrapper"
              colors={["#9915eb", "#9915eb", "#9915eb", "#9915eb", "#9915eb"]}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Aiworld;
