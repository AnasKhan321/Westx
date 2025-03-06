import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { Token } from "../utils/type";
import SmallLoader from "./SmallLoader";
import { useToken } from "../Context/TokenContext";


const getTokenDetail = async (publicKey: string): Promise<Token> => {
    const { data } = await axios.get<Token>(`https://believe-in-fun-backend.onrender.com/api/tokens/mint/${publicKey}`)
    return data;
}

const TokenDetail = ({ publicKey }: { publicKey: string }) => {

    const { handlebuy, handleSell, isChecking } = useToken()
    const { data, isLoading, isError } = useQuery({
        queryKey: ["tokenDetail", publicKey],
        queryFn: () => getTokenDetail(publicKey)
    })

    if(isLoading){
        return <div className="w-full h-full flex justify-center items-center">
            <SmallLoader />
        </div>
    }

    return <div className="w-full mx-auto border border-white/40 py-8  mt-4 rounded-lg ">




        {isError && <div className="w-full h-full flex justify-center items-center">
            <p className="text-red-500">Error fetching token details</p>
        </div>}


        <div className="flex gap-x-10 items-center flex-col">
            <div className="text-white/50 mb-6 text-lg italic  ">
            {data?.market_cap == 0 ? <div> Be the First  one to buy  this token</div> : <div> You can even buy tokens of Persona now </div>}
       
            </div>

            <div className="flex gap-x-10 items-center w-[95%]   md:w-[95%] justify-around">
                <div className="flex  gap-1 items-center w-[50%]">
                <p className=" font-bold">${(Number(data?.market_cap) / Number(data?.totalSupply))
                        .toFixed(9)
                        .replace(/\.?0+$/, '')}  
                    </p>
                    <p className="text-white/50  "> TokenPrice</p>

                </div>

                <div className="flex  gap-1 items-center w-[50%]">
                <p className=" font-bold">${(Number(data?.market_cap) / 1000000000) 
                        .toFixed(2) 
                        .replace(/\.?0+$/, '')}</p>
                    <p className="text-white/50 text-sm  ">MK</p>

                </div>

            </div>


            <div className="flex w-[95%] md:w-[80%]  justify-between items-center mt-7  space-x-2">
                <button onClick={() => handlebuy(publicKey as string)} className="  w-full bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br py-2 rounded-full border border-white">Buy </button>
                <button onClick={() => handleSell(publicKey as string)} className=" w-full py-2 border border-white rounded-full bg-gradient-to-r from-black/50 via-black/60 to-black/70 hover:bg-white transition-all   " disabled={isChecking}> {isChecking ? "Checking ..." : "Sell"} </button>
            </div>

        </div>


    </div>;
};

export default TokenDetail;
