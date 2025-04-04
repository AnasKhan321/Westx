import axios from "axios";
import { useAuth } from "../Context/AuthContext"
import SEO from "../ReusableComponents/SEO"
import { IoAddSharp } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import { User } from "../utils/type";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import SafeImage from "../ReusableComponents/SafeImage";
import { FaArrowUp } from "react-icons/fa6"
import toast from "react-hot-toast";
import Loader2 from "../ReusableComponents/Loader2";

const CreatedUser = async (username: string): Promise<User[]> => {
    let sdata = {
        username: username
    }
    const { data } = await axios.post(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/getUser`, sdata);
    return data.data;
}

const ManagePersonas = () => {
    const { user } = useAuth()
    return (
        <div className="md:min-h-[96vh] min-h-screen max-h-screen  md:max-h-[96vh]  md:my-[2vh] bg-primaryColor md:bg-secondaryColor overflow-y-scroll rounded-xl border border-white/10 ">
            <SEO title={`Manage Personas - ${user?.username} `} description={"Manage Personas page where you can manage your personas"} />


            <div className="w-[93%] mx-auto mt-4 ">
                <div className="flex  justify-between   items-center">
                    <h1 className=" lg:text-xl   font-roboto font-bold  ">My Personas</h1>
                    <div className="hidden md:block"><Link to={"/persona/add"} className="  hover:bg-white/10 transition-all duration-300 cursor-pointer border-white border-2 rounded-full flex items-center space-x-2  px-4 py-2"> <IoAddSharp size={22} className="text-white" />  <span className="text-medium"> Add new Persona </span> </Link></div> 
                    <div className="block  md:hidden"><Link to={"/persona/add"} className="   bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700   hover:bg-gradient-to-b transition-all duration-300 cursor-pointer  rounded-full flex items-center space-x-2  px-4 py-2"> <IoAddSharp size={22} className="text-white" />  <span className="text-medium"> Add new  </span> </Link></div> 

                </div>

                {user?.username && <GetUsers username={user.username} />}

            </div>

        </div>
    )
}



const GetUsers = ({ username }: { username: string }) => {
    const { data, isLoading, error } = useQuery({
        queryKey: [`CreatedUser:${username}`],
        queryFn: () => CreatedUser(username) , 
        staleTime: Infinity, 
        refetchOnMount: false, 
        refetchOnWindowFocus: false, 
    })
    console.log(data)

    return (
        <div>
            {isLoading && <Loader2 fullScreen={true}/>}
            {error && <div className="text-red-500">Error fetching data</div>}
            {data && <div>


                {data.map((user, index) => {
                    return (
                        <UserCard key={index} user={user} />
                    )
                })}


                {data.length === 0 && <NoUserfound />}
            </div>}
        </div>
    )
}



const UserCard = ({ user }: { user: User }) => {

    const handleLevelup = () => {
        toast.success("Coming Soon", {
            style: {
                borderRadius: '20px',
                background: '#333',
                color: '#fff',
            },
        })
    }
    return (
        <motion.div initial={{ opacity: 0.5, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center  py-6   text-white  rounded-lg w-full  font-roboto">
            {/* Avatar */}
            <Link to={`/user/${user.username}`} className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 mr-4">
                <SafeImage
                    src={user.photoURL}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                />

            </Link>
            <div className="flex-grow">
                <div className="font-bold flex gap-x-2 items-center"> <Link to={`/user/${user.username}`}> {user.name}</Link>          <span >

                    {user.isPremium &&
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#a200e8" className="size-6">
                            <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                        </svg>}

                </span>  </div>
                <div className="text-gray-400 text-sm"> <Link to={`/user/${user.username}`} > @{user.username} </Link> </div>




            </div>




            <div className="flex flex-col gap-y-1 mr-5">
                <p className="text-white/70 text-sm">Currently</p>
                <p className="text-white text-sm">Level 1</p>
            </div>
            <button onClick={handleLevelup}>
                <button className=" md:block hidden   bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700    transition-all    text-white py-2 px-8  rounded-full font-bold text-sm hover:bg-gradient-to-b ">
                    Level UP
                </button></button>



            <button onClick={handleLevelup}>
                <button className=" md:hidden  block   bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700   p-2  transition-all    text-white  rounded-full font-bold text-sm hover:bg-gradient-to-b hover:text-white ">
                    <FaArrowUp className="text-xl " />
                </button></button>
        </motion.div>
    )
}


const NoUserfound = () => {
    return (
        <div className=" w-[70%] md:w-[50%] mx-auto h-[70vh]  my-auto flex flex-col items-center justify-center">

            <div className="flex flex-col items-center justify-center">
            <svg width="49" height="48" viewBox="0 0 49 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M29 27C30.1935 27 31.3381 27.4741 32.182 28.318C33.0259 29.1619 33.5 30.3065 33.5 31.5V33C33.5 38.913 27.92 45 18.5 45C9.08 45 3.5 38.913 3.5 33V31.5C3.5 30.3065 3.97411 29.1619 4.81802 28.318C5.66193 27.4741 6.80653 27 8 27H29ZM29 30H8C7.60218 30 7.22064 30.158 6.93934 30.4393C6.65804 30.7206 6.5 31.1022 6.5 31.5V33C6.5 37.314 10.796 42 18.5 42C26.204 42 30.5 37.314 30.5 33V31.5C30.5 31.1022 30.342 30.7206 30.0607 30.4393C29.7794 30.158 29.3978 30 29 30ZM39.5 21C40.0967 21 40.669 21.2371 41.091 21.659C41.5129 22.081 41.75 22.6533 41.75 23.25C41.75 23.8467 41.5129 24.419 41.091 24.841C40.669 25.2629 40.0967 25.5 39.5 25.5C38.9033 25.5 38.331 25.2629 37.909 24.841C37.4871 24.419 37.25 23.8467 37.25 23.25C37.25 22.6533 37.4871 22.081 37.909 21.659C38.331 21.2371 38.9033 21 39.5 21ZM18.5 7.5C20.688 7.5 22.7865 8.36919 24.3336 9.91637C25.8808 11.4635 26.75 13.562 26.75 15.75C26.75 17.938 25.8808 20.0365 24.3336 21.5836C22.7865 23.1308 20.688 24 18.5 24C16.312 24 14.2135 23.1308 12.6664 21.5836C11.1192 20.0365 10.25 17.938 10.25 15.75C10.25 13.562 11.1192 11.4635 12.6664 9.91637C14.2135 8.36919 16.312 7.5 18.5 7.5ZM18.5 10.5C17.1076 10.5 15.7723 11.0531 14.7877 12.0377C13.8031 13.0223 13.25 14.3576 13.25 15.75C13.25 17.1424 13.8031 18.4777 14.7877 19.4623C15.7723 20.4469 17.1076 21 18.5 21C19.8924 21 21.2277 20.4469 22.2123 19.4623C23.1969 18.4777 23.75 17.1424 23.75 15.75C23.75 14.3576 23.1969 13.0223 22.2123 12.0377C21.2277 11.0531 19.8924 10.5 18.5 10.5ZM39.5 3C41.0913 3 42.6174 3.63214 43.7426 4.75736C44.8679 5.88258 45.5 7.4087 45.5 9C45.5 11.19 44.864 12.42 43.238 14.124L42.446 14.934C41.315 16.113 41 16.749 41 18C41 18.3978 40.842 18.7794 40.5607 19.0607C40.2794 19.342 39.8978 19.5 39.5 19.5C39.1022 19.5 38.7206 19.342 38.4393 19.0607C38.158 18.7794 38 18.3978 38 18C38 15.81 38.636 14.58 40.262 12.876L41.054 12.066C42.185 10.89 42.5 10.254 42.5 9C42.5 8.20435 42.1839 7.44129 41.6213 6.87868C41.0587 6.31607 40.2957 6 39.5 6C38.7043 6 37.9413 6.31607 37.3787 6.87868C36.8161 7.44129 36.5 8.20435 36.5 9C36.5 9.39782 36.342 9.77936 36.0607 10.0607C35.7794 10.342 35.3978 10.5 35 10.5C34.6022 10.5 34.2206 10.342 33.9393 10.0607C33.658 9.77936 33.5 9.39782 33.5 9C33.5 7.4087 34.1321 5.88258 35.2574 4.75736C36.3826 3.63214 37.9087 3 39.5 3Z" fill="white" />
            </svg>

            <p className="mt-4 font-medium ">No personas yet</p>
            </div>

            <p className="mt-4 text-white/70 text-center ">You Haven't Created Any Personas Yet  Create One Now and Start Chatting </p>

        </div>
    )
}

export default ManagePersonas

