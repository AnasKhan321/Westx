import { BsTwitterX } from "react-icons/bs";
import axios from "axios" ; 
import { useQuery } from "@tanstack/react-query";


interface TwitterInfo {


    username: string;
    email: string;
    password: string;
    auth_token: string;
}


interface TwitterLink {

    success : boolean ; 
    data : TwitterInfo ; 
}


const getTwitterXLink  = async (username : string)  : Promise<TwitterLink> =>{

    const {data}  = await axios.get(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/getTwitterInfo/${username}`)
    console.log(data)
    return data ; 

}

const Level4 = ({username , isMyprofile}:{username:string  , isMyprofile : boolean}) => {

    const { data, isLoading } = useQuery({
        queryKey: [`TwitterLink:${username}`],
        queryFn: () => getTwitterXLink(username),
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      });

  return (
    <div className={`flex items-center gap-x-2  ${isMyprofile ? "mt-2" : "mt-4"} ml-1 `}>

        {isLoading ? <div>Loading...</div> : <div>

            {data?.success && <a href={`https://x.com/${data?.data.username}`} target="_blank" rel="noopener noreferrer">
            <BsTwitterX size={15} />
        </a>}

        {!data?.success && <div className="relative group">
            <div className="text-white/60 text-sm mt-1 cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.7913 2.04201L8.46063 5.84934L5.58063 2.04201H1.40796L6.39263 8.55934L1.66863 13.9587H3.69129L7.33729 9.79201L10.524 13.9587H14.592L9.39596 7.08934L13.8126 2.04201H11.7913ZM11.082 12.7487L3.76929 3.18801H4.97129L12.202 12.748L11.082 12.7487Z" fill="#5C5C5C"/>
                </svg>
            </div>
            <div className="absolute hidden group-hover:block bg-black/90 text-white text-xs rounded px-2 py-1 top-1/2 -translate-y-1/2 left-full ml-2 whitespace-nowrap">
                Persona will soon get Twitter Account
            </div>
        </div>}
            </div>}

    </div>
  );
}

export default Level4
