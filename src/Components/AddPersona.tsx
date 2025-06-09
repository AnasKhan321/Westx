import axios from 'axios';
import { useState, KeyboardEvent } from "react";
import { IoCaretBack, IoSearchOutline } from 'react-icons/io5';
import { RiCloseLine } from 'react-icons/ri';
import { CreateUserResponse, formatTwitterAvatarUrl, TwitterResponse, TwitterUser } from './Aiworld';
import Loader2 from '../ReusableComponents/Loader2';
import toast from 'react-hot-toast';
import { useAuth } from '../Context/AuthContext';
import { ColorRing } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { FaPlus } from "react-icons/fa6";
import { AnimatePresence, motion } from 'motion/react';
import { IoMdClose } from 'react-icons/io';




const AddPersona = () => {
    const [searchValue, setSearchValue] = useState('');
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();
    const [twitteruser, settwitteruser] = useState<TwitterUser | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [userLoading, setuserLoading] = useState(false);

    const [isCreated, setIsCreated] = useState(false);
    const queryClient = useQueryClient();


    const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchValue.trim()) {
            searchUser();
        }
    };

    const handleClick = () => {
        navigate(-1);
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
            setIsCreated(false);
        }
    }

    const { user } = useAuth();



    const handleConfirmImport = async () => {
        if (twitteruser && !userLoading) {
            setuserLoading(true);
            setShowModal(false);

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
                queryClient.invalidateQueries({ queryKey: [`CreatedUser:${user?.username}`] });
                queryClient.invalidateQueries({ queryKey: [`POINTS:${user?.username}`] });
                navigate("/my-personas")
                setIsCreated(true);
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
        <div className="w-full min-h-screen max-h-screen tablet:min-h-[96vh] tablet:max-h-[96vh] border border-white/10 overflow-y-scroll tablet:my-[2vh] z-10 bg-primaryColor tablet:bg-secondaryColor rounded-l-2xl">
            <div className="flex   absolute p-4 items-center space-x-2   backdrop-blur-xl     bg-secondaryColor/20 w-full  md:w-[49.8%]  md:rounded-xl font-bold   ">
                <IoCaretBack
                    className="text-xl cursor-pointer"
                    onClick={handleClick}
                />
                <span>Add Persona</span>
            </div>
            <div className="p-4 md:p-6">

                {/* Search Container */}
                <div className="w-[90%] mx-auto mt-12">
                    <div className="relative">
                        {/* Search Icon */}
                        <div onClick={searchUser} className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400">
                            <IoSearchOutline className="w-5 h-5" />
                        </div>

                        {/* Input Field */}
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="Search user on X ..."
                            className="w-full pl-12 pr-12 py-3 bg-newcolor text-white rounded-lg
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

                                    <>
                                        {twitteruser.profile == null ? (<div>Please Try Again</div>) : (



                                            <div className="mx-6 my-4">
                                                <div className="flex items-center  bg-newcolor  border border-white/10 text-white  rounded-lg p-4 max-w-2xl mx-auto  font-sans">

                                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-newcolor  mr-4">
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



                                                    <button className='bg-gradient-to-r via-purple-600 from-purple-500 to-purple-700  transition-all rounded-full    text-white   px-2 py-1  md:text-sm  md:px-2 md:py-2  font-bold text-xs  hover:bg-gradient-to-b ' onClick={() => setShowModal(true)} disabled={isCreated}>

                                                        <FaPlus height={25} width={25} className='text-white text-lg ' />

                                                    </button>

                                                    {/* <button
                                                        disabled={isCreated}
                                                        onClick={handleCreateUser}
                                                        className="  bg-gradient-to-r via-purple-600 from-purple-500 to-purple-700  transition-all rounded-full    text-white   px-2 py-1  md:text-sm  md:px-4 md:py-2  font-bold text-xs  hover:bg-gradient-to-b "
                                                    >
                                                        Import
                                                    </button> */}
                                                </div>
                                            </div>
                                        )}


                                    </>
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


            <AnimatePresence>
                {showModal && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 top-0"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed max-h-[90vh] transform -translate-x-1/2 w-[100%]     mx-auto  xl:left-1/4 overflow-y-auto my-[3vh]  xl:w-[90%]   xl:max-w-2xl z-50 top-0"
                        >

                            <div className=" md:w-full min-h-[300px] bg-gradient-to-b from-secondaryColor to-secondaryColor/80 rounded-xl shadow-2xl border border-white/10">
                                <div className="flex items-center justify-end cursor-pointer" onClick={() => setShowModal(false)}>
                                    <IoMdClose className="text-white/40 text-2xl absolute top-2 right-8 md:right-2" />
                                </div>

                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-white mb-4">Import Persona</h2>

                                    {/* Persona Info */}
                                    <div className="flex items-center space-x-4 mb-6">
                                        <div className="w-16 h-16 rounded-full overflow-hidden">
                                            <img
                                                src={twitteruser?.avatar ? formatTwitterAvatarUrl(twitteruser.avatar) : ''}
                                                alt="Persona Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">{twitteruser?.name}</h3>
                                            <p className="text-gray-400">@{twitteruser?.profile}</p>
                                        </div>
                                    </div>


                                    <div className="space-y-3">
                                        <h4 className="text-white font-semibold">Benefits:</h4>
                                        <ul className="space-y-2 text-gray-300">
                                            <li className="flex items-center space-x-2">
                                                <span className="text-purple-400">•</span>
                                                <span>Full ownership rights of the persona</span>
                                            </li>
                                            <li className="flex items-center space-x-2">
                                                <span className="text-purple-400">•</span>
                                                <span>Earn 0.5% transaction fees on all token transactions</span>
                                            </li>
                                            <li className="flex items-center space-x-2">
                                                <span className="text-purple-400">•</span>
                                                <span>Level up your persona from Level 1 to 6</span>
                                            </li>
                                            <li className="flex items-center space-x-2">
                                                <span className="text-purple-400">•</span>
                                                <span>Get an X (Twitter) account at Level 4</span>
                                            </li>
                                            <li className="flex items-center space-x-2">
                                                <span className="text-purple-400">•</span>
                                                <span>Launch persona as token at Level 6</span>
                                            </li>
                                        </ul>
                                    </div>






                                    <div className="rounded-lg  mt-6">
                                        <h4 className="text-white font-semibold mb-3">Ownership Rights</h4>
                                        <div className="space-y-2">
                                            <p className="text-gray-300 text-sm  ml-1">
                                                When the Twitter user logs into WestX, they can:
                                            </p>
                                            <ul className="space-y-2 text-gray-300">
                                                <li className="flex items-center space-x-2">
                                                    <span className="text-purple-400">•</span>
                                                    <span>Claim ownership of their persona</span>
                                                </li>
                                                <li className="flex items-center space-x-2">
                                                    <span className="text-purple-400">•</span>
                                                    <span>Pay you points based on the persona's current level</span>
                                                </li>
                                                <li className="flex items-center space-x-2">
                                                    <span className="text-purple-400">•</span>
                                                    <span>Take full control of their persona's activities</span>
                                                </li>
                                            </ul>
                                            <p className="text-gray-400 text-sm mt-2 italic">
                                                Note: You'll receive points when ownership is claimed, based on the level you've upgraded the persona to.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <button
                                            onClick={handleConfirmImport}
                                            disabled={userLoading}
                                            className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                                        >
                                            {userLoading ? 'Importing...' : 'Confirm Import'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>



        </div>


    );
};

export default AddPersona;
