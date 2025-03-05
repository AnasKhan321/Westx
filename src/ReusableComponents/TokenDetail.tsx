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

    const { handlebuy, handleSell  , isChecking } = useToken()
    const { data, isLoading, isError } = useQuery({
        queryKey: ["tokenDetail", publicKey],
        queryFn: () => getTokenDetail(publicKey)
    })

    return <div className="w-[95%] mx-auto border-b border-white/40 py-8   ">


        {isLoading && <div className="w-full h-full flex justify-center items-center">
            <SmallLoader />
        </div>}

        {isError && <div className="w-full h-full flex justify-center items-center">
            <p className="text-red-500">Error fetching token details</p>
        </div>}


        <div className="flex gap-x-10 items-center">
            <div className="flex flex-col gap-1 items-center">
                <p className="text-white/50  "> TokenPrice</p>
                <p className="text-xl font-bold">${(Number(data?.market_cap) / Number(data?.totalSupply))
                    .toFixed(9)  // Adjust number of decimal places as needed
                    .replace(/\.?0+$/, '')}  {/* Remove trailing zeros */}
                </p>
            </div>

            <div className="flex flex-col gap-1 items-center">
                <p className="text-white/50  ">Market Cap</p>
                <p className="text-xl font-bold">${(Number(data?.market_cap) / 1000000000)  // Adjust denominator based on your needs
                    .toFixed(2)  // Show 2 decimal places
                    .replace(/\.?0+$/, '')}</p>
            </div>

            <div className="flex mr-5  mt-7  space-x-2">
            <button onClick={()=>handlebuy(publicKey as string)} className=" text-green-500 underline hover:text-green-600  rounded-full ">Buy Token</button>
            <button onClick={()=>handleSell(publicKey as string)} className=" text-red-500 underline hover:text-red-600    rounded-full " disabled={isChecking}> {isChecking ? "Checking ..." : "Sell Token"} </button>
          </div>

        </div>


    </div>;
};

export default TokenDetail;
