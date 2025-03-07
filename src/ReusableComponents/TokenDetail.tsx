import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { Token } from "../utils/type";
import SmallLoader from "./SmallLoader";
import { useToken } from "../Context/TokenContext";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";


interface MarketCap {
    tokenMint: string , 
    marketCap: number ,
     unit: string
    }

interface TokenPrice {

    price: number ,
    tokenMint: string , 
    unit: string
}


const getTokenDetail = async (publicKey: string): Promise<Token> => {
    const { data } = await axios.get<Token>(`https://believe-in-fun-backend-production.up.railway.app/api/tokens/mint/${publicKey}`)
    return data;
}

const getMarketCap = async (publicKey: string) : Promise<MarketCap> => {
    const { data } = await axios.get<MarketCap>(`https://believe-in-fun-backend-production.up.railway.app/api/tokens/marketcap/${publicKey}`)
    console.log(data)
    return data ; 
}

const getTokenPrice = async (publicKey: string) : Promise<TokenPrice> => {
    const { data } = await axios.get<TokenPrice>(`https://believe-in-fun-backend-production.up.railway.app/api/tokens/price/${publicKey}`)
    console.log(data)
    return data ; 
}

const TokenDetail = ({ publicKey }: { publicKey: string }) => {

    const { handlebuy, handleSell, isChecking } = useToken()
    const { data, isLoading, isError } = useQuery({
        queryKey: ["tokenDetail", publicKey],
        queryFn: () => getTokenDetail(publicKey)
    })

    const {data : marketcapdata , isLoading : marketcaploading , isError : marketcaperror} = useQuery({
        queryKey: [`marketcap-${publicKey}`],
        queryFn: () => getMarketCap(publicKey)  , 
    })

    const {data : tokenprice , isLoading : tokenpriceloading , isError : tokenpriceerror} = useQuery({
        queryKey: [`tokenprice-${publicKey}`],
        queryFn: () => getTokenPrice(publicKey)  , 
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

            <div className="flex gap-x-10 items-center w-[95%]   md:w-[80%] justify-around">
                <div className="flex  gap-1 items-center w-[50%]">
                <p className=" font-bold">${tokenprice?.price.toFixed(9)
                        .replace(/\.?0+$/, '')}  
                    </p>
                    <p className="text-white/50  "> TokenPrice</p>

                </div>

                <div className="flex  gap-1 items-center w-[50%]">
                <p className=" font-bold">  {marketcapdata?.marketCap as number/ LAMPORTS_PER_SOL} SOL  </p>
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
