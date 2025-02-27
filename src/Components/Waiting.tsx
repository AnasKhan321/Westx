import Timer from '../ReusableComponents/Timer'
import axios from 'axios'
import { User } from '../utils/type'
import { useQuery } from '@tanstack/react-query'
import SmallLoader from '../ReusableComponents/SmallLoader'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface Response{
    success : boolean , 
    user1 : User , 
    user2 : User
}

const fetchPreviousshowusers  = async()=>{
    const {data}  = await axios.get<Response>(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/previoushow/user`)
    return data ; 
}
const Waiting = () => {

    const {data  , isLoading}  = useQuery({
        queryKey : ["PREVIOUS:SHOWS"] , 
        queryFn: async () => await fetchPreviousshowusers(),
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })



  return (
    <div>
      
      <div className="relative w-[95%]  mx-auto  h-[120px] bg-cover bg-center rounded-xl  overflow-hidden shadow-lg" style={{ backgroundImage: "url('/roastfire.jpeg')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="relative z-10 flex justify-between items-center h-full px-6 text-white">
        <div>
          <p className="text-base  ">Experience the live</p>
          <h2 className="text-xl   mt-2  font-bold">Roast Show</h2>
        </div>
        <div className="text-right">
          <p className="text-base ">Starts in</p>
          <p className="text-xl mt-2  font-bold">
            <Timer/> 
          </p>
        </div>
      </div>
    </div>

    <div className=' w-[96%] md:w-[95%]  mx-auto  mt-10 '>
        <h2 className='font-bold text-base md:text-xl '>Previous Show </h2>

    {isLoading && <SmallLoader/> }

    {data?.success &&
    <Link to={`/roastshow/previous`}>
        <div className=' mt-5 md:mt-0 p-2  md:p-4 grid grid-cols-14'>
            <div  className='col-span-2  mx-auto'>
                <img src="/roastfire.jpeg" alt=""  className= ' w-[50px]  h-[50px] md:w-[80px] md:h-[80px] rounded-xl'/>
            </div>

            <div className=' col-span-12  md:col-span-10  ml-2 space-y-2 '>
                <div className='flex  space-x-1 md:space-x-2'>
                    <p  className='text-sm md:text-base' > {data.user1.name} </p>
                    <p  className='text-sm md:text-base' >vs</p>
                    <p  className='text-sm md:text-base' > {data.user2.name} </p>
                    <p  className='text-sm md:text-base' >|</p>
                    <p  className='text-sm md:text-base' >Mega slam</p>

                </div>
                
                <div className='text-white/60 flex space-x-2 md:space-x-4'> 
                
                  <div> 15 min </div>   
                  <TimeSince8PM/> 
                   
                </div>
            </div>
  

               <Link to={`/roastshow/previous`}  className=' hidden md:flex  md:col-span-2 bg-purple-500 rounded-full h-[50%] my-auto  items-center justify-center ' ><button >Watch</button> </Link>  
        
        </div> </Link>  }
    </div>
    </div>
  )
}



const TimeSince8PM: React.FC = () => {
  const [timePassed, setTimePassed] = useState<string>("");

  useEffect(() => {
      const updateTime = () => {
          const now: Date = new Date();
          const eightPM: Date = new Date();
          eightPM.setHours(20, 0, 0, 0); // Set to today's 8:00 PM

          // If current time is before 8:00 PM, use yesterday's 8:00 PM
          if (now < eightPM) {
              eightPM.setDate(eightPM.getDate() - 1);
          }

          const diffMs: number = now.getTime() - eightPM.getTime(); // Time difference in milliseconds
          const diffMinutes: number = Math.floor(diffMs / (1000 * 60)); // Convert to minutes

          if (diffMinutes < 60) {
              setTimePassed(`${diffMinutes}m ago`);
          } else {
              const diffHours: number = Math.floor(diffMinutes / 60);
              const remainingMinutes: number = diffMinutes % 60;
              setTimePassed(
                  remainingMinutes > 0 ? `${diffHours}h ${remainingMinutes}m ago` : `${diffHours}h ago`
              );
          }
      };

      updateTime(); // Initial calculation
      const interval = setInterval(updateTime, 60000); // Update every minute

      return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return <div>  •   {timePassed}</div>;
};




export default Waiting
