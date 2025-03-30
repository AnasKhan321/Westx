import axios from 'axios';
import { useState, KeyboardEvent } from "react";
import { IoSearchOutline } from 'react-icons/io5';
import { RiCloseLine } from 'react-icons/ri';
import { CreateUserResponse, formatTwitterAvatarUrl, TwitterResponse, TwitterUser } from './Aiworld';
import Loader2 from '../ReusableComponents/Loader2';
import toast from 'react-hot-toast';
import { useAuth } from '../Context/AuthContext';
import { ColorRing } from 'react-loader-spinner';




const AddPersona = () => {
    const [searchValue, setSearchValue] = useState('');


    const [twitteruser, settwitteruser] = useState<TwitterUser | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [userLoading, setuserLoading] = useState(false);

    const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchValue.trim()) {
            searchUser() ; 
        }
    };

    const searchUser = async () => {
        if (searchValue.trim()) {
            setIsLoading(true);
            const { data } = await axios.get<TwitterResponse>(
                `${import.meta.env.VITE_PUBLIC_AI_URL}/searchTwitter/${searchValue}`
            );

            if (data.success) {
                settwitteruser(data.data);
            }
            setIsLoading(false);
        }
    }

    const { user } = useAuth();


    const handleCreateUser = async () => {
        if (twitteruser && !userLoading) {
            console.log("calling ...")
            setuserLoading(true);
            const { data } = await axios.post<CreateUserResponse>(
                `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/api/user/nonPremiumUser`,
                {
                    username: twitteruser.profile,
                    creator: user?.username
                }
            );

            setuserLoading(false);

            if (data.success) {
                toast.success("User Created Successfully !", {
                    style: {
                        borderRadius: '20px',
                        background: '#333',
                        color: '#fff',
                    },

                });
            } 
            if (!data.success) {
 
                toast.error(data.message, {
                    style: {
                        borderRadius: '20px',
                        background: '#333',
                        color: '#fff',
                    },
                });
            }
        }
    };
    return (
        <div className="w-full min-h-screen max-h-screen md:min-h-[96vh] md:max-h-[96vh] overflow-y-scroll md:my-[2vh] z-10 bg-primaryColor md:bg-secondaryColor rounded-2xl">
            <div className="p-4 md:p-6">
                {/* Header */}
                <h1 className="text-2xl text-center font-bold mb-6 text-white">
                    Add Persona
                </h1>

                {/* Search Container */}
                <div className="max-w-2xl mx-auto">
                    <div className="relative">
                        {/* Search Icon */}
                        <div onClick={searchUser} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <IoSearchOutline className="w-5 h-5" />
                        </div>

                        {/* Input Field */}
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="Search user on X ..."
                            className="w-full pl-12 pr-12 py-3 bg-[#1a1a1a] text-white rounded-lg
                border border-white/10 focus:outline-none focus:border-purple-500
                placeholder:text-gray-500"
                            onKeyDown={handleKeyDown}
                        />

                        {/* Clear Button */}
                        {searchValue && (
                            <button
                                onClick={() => setSearchValue('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400
                  hover:text-white"
                            >
                                <RiCloseLine className="w-5 h-5" />
                            </button>
                        )}
                    </div>
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
                                        <div className="flex items-center bg-white/10  text-white  rounded-lg p-4 max-w-2xl mx-auto  font-sans">

                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 mr-4">
                                                <img
                                                    src={formatTwitterAvatarUrl(twitteruser.avatar)}
                                                    alt="User Avatar"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            <div className="flex-grow">
                                                <div className="font-bold md:text-base text-sm  flex gap-x-2 items-center">
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
                                                <div className="text-gray-400 text-xs md:text-sm">
                                                    {" "}
                                                    @{twitteruser.profile}{" "}
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleCreateUser}
                                                className="  bg-gradient-to-r via-purple-600 from-purple-500 to-purple-700  transition-all rounded-full    text-white   px-2 py-1  md:text-sm  md:px-4 md:py-2  font-bold text-xs  hover:bg-gradient-to-b "
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
                    <div className="mx-auto w-full mt-10 ">
                        {" "}
                        <Loader2 fullScreen={false} />          </div>
                )}

                {userLoading && (
                    <div className="flex items-center justify-center flex-col">
                        <span> Adding Persona  ... </span>
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

export default AddPersona;
