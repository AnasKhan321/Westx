import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import SmallLoader from "./SmallLoader";
import { useToken } from "../Context/TokenContext";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";


interface TokenDetail {
    name : string , 
    symbol : string , 
    tokenMint : string , 
    price : number  , 
    market_cap : number 
}

const getTokenDetail = async (publicKey: string): Promise<TokenDetail> => {
    const { data } = await axios.get<TokenDetail>(`https://web3.westx.xyz/api/tokens/mint/${publicKey}`)
    return data;
}

const TokenDetail = ({ publicKey }: { publicKey: string }) => {

    const { handlebuy, handleSell, isChecking } = useToken()



    const {data : tokenDetail , isLoading : tokenDetailLoading} = useQuery({
        queryKey : [`tokenDetail-${publicKey}`],
        queryFn : () => getTokenDetail(publicKey)
    })

    if (tokenDetailLoading) {
        return <div className="w-full mx-auto bg-gray-700 h-[120px]  animate-pulse border border-white/40 py-8  mt-4 rounded-lg ">





        </div>;
    }


    return <div className="w-full mx-auto  py-2  mt-4 rounded-lg ">



        <div className="flex gap-x-10 items-center md:flex-row flex-col justify-center ">

            <div className="flex gap-x-10 items-center w-full   md:w-[80%] justify-center md:justify-around">
                <div className="flex  gap-1 items-center w-[70%]">
                    {!tokenDetailLoading &&
                        <div className="flex gap-x-1 items-center justify-center md:justify-start">
                            <p className=" font-bold">{tokenDetail?.price.toFixed(9)
                                .replace(/\.?0+$/, '')} SOL
                            </p>
                            <p className="text-white/50  "> Price</p>
                        </div>

                    }

                    {tokenDetailLoading && <SmallLoader />}
                </div>

                <div className="flex justify-center  md:justify-start  items-center w-[50%]">
                    {!tokenDetailLoading &&
                        <div className="flex gap-1 items-center ">
                            <p className=" font-bold">  {tokenDetail?.market_cap as number / LAMPORTS_PER_SOL } SOL  </p>
                            <p className="text-white/50 text-sm  ">MK</p>
                        </div>
                    }

                    {tokenDetailLoading && <SmallLoader />}

                </div>

            </div>


            <div className="flex w-[95%] mt-5 md:mt-0 md:w-[80%]  justify-between items-center  space-x-2">
                <button onClick={() => handlebuy(publicKey as string  , tokenDetail?.symbol as string)} className="   text-white  no-underline  w-full bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br py-2 rounded-full border border-white">Buy </button>
                <button onClick={() => handleSell(publicKey as string  , tokenDetail?.price as number)} className="   w-full py-2 border border-white rounded-full bg-gradient-to-r from-black/50 via-black/60 to-black/70 hover:bg-white transition-all   " disabled={isChecking}> {isChecking ? "Checking ..." : "Sell"} </button>
            </div>

        </div>


    </div>;
};

export default TokenDetail;
