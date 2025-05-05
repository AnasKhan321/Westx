import { createContext, useContext, ReactNode, useState } from 'react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react';
import toast from 'react-hot-toast';
import { Transaction } from "@solana/web3.js"
import { api } from '../utils/api';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useConnection } from '@solana/wallet-adapter-react';
import { Keypair } from '@solana/web3.js';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useQueryClient } from '@tanstack/react-query';
interface TokenContextType {
  handlebuy: (token: string  , symbol : string) => void
  handleSell: (token: string  , tokneprice : number) => void
  handleTokenLaucnh: (name: string, image: string, username: string  , creator : string | null) => void 
  isChecking: boolean
}

interface TokenProviderProps {
  children: ReactNode;
}

interface SellToken {
  address: string,
  balance: number,
  decimals: number,
}

interface TokenBalanceResponse {
  address: string
  balance: number,
  decimals: number
  exsists: boolean
}


// const fetchSolPrice = async () => {
//   const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
//   const data = await response.json();
//   return data.solana.usd; // SOL price in USD
// };

// const fetchTokenPrice = async () => {
//   return 0.000000033; // Hardcoded NASA price in USD
// };

// const calculateTokenEquivalent = async () => {
//   const solPrice = await fetchSolPrice();  // SOL price in USD
//   const nasaPriceUSD = await fetchTokenPrice(); // NASA price in USD

//   if (!solPrice || !nasaPriceUSD) return 'Price unavailable';

//   const solInUsd = solPrice * 0.1; // Convert 0.1 SOL to USD
//   const nasaEquivalent = solInUsd / nasaPriceUSD; // Convert USD to NASA tokens


  
//   return { nasaEquivalent, solInUsd };
// };



// const calculateTokenAmount = (
//   solAmount: number,
//   totalSupply: string,
//   targetSol: string
// ): number => {
//   // Convert SOL to lamports (1 SOL = 1e9 lamports)
//   const lamports = solAmount * LAMPORTS_PER_SOL;
  
//   // Convert string values to numbers
//   const supply = Number(totalSupply);
//   const target = Number(targetSol);
  
//   // Calculate tokens using bonding curve formula
//   // tokens = (input_sol * total_supply) / target_sol
//   const tokenAmount = (lamports * supply) / target;
  
//   return tokenAmount;
// };

const TokenContext = createContext<TokenContextType | undefined>(undefined);

const convertImageUrlToFile = async (imageUrl: string, fileName: string): Promise<File> => {
  try {
    // Fetch the image
    const response = await fetch(imageUrl  , {
      
  mode: 'no-cors'
}
    );
    const blob = await response.blob();

    // Create a File from the blob
    const file = new File([blob], fileName, { type: blob.type });
    return file;
  } catch (error) {
    console.error('Error converting image URL to file:', error);
    throw error;
  }
};

export function TokenProvider({ children }: TokenProviderProps) {

  const [isOpen, setIsOpen] = useState(false)
  const { publicKey, signTransaction, sendTransaction } = useWallet()
  const [isBuyOpen, setIsBuyOpen] = useState(false)
  const [buyAmount, setBuyAmount] = useState(0.1)
  const [buytoken, setBuyToken] = useState(1000)
  const [selectedtoken, setselectedtoken] = useState("")
  const { connection } = useConnection()
  const [symbol, setSymbol] = useState("")
  const [isSellOpen, setIsSellOpen] = useState(false)

  const [sellAmount, setSellAmount] = useState(0.1)
  const [sellToken, setSellToken] = useState(0)
  const [isBuying, setisBuying] = useState(false)

  const [isSelling, setIsSelling] = useState(false)

  const [selltokendata, setSellTokendata] = useState<SellToken | null>(null)

  const [isTokenLaucnhOpen, setIsTokenLaucnhOpen] = useState(false)

  const queryClient = useQueryClient();
  const [tokenname, settokename] = useState("")
  const [tokenimage, settokenimage] = useState("")
  const [tokenSymbol, settokenSymbol] = useState("")
  const [tokenDescription, settokenDescription] = useState("")
  const [isChecking, setisChecking] = useState(false)
  const [isLaunching, setisLaunching] = useState(false)
  const [username, setusername] = useState("")
  const [initial, setinitial] = useState(0)
  
  const [tokenPrice , setTokenPrice] = useState(0)

  const {isAuthenticated} = useAuth()

  const [creator, setCreator] = useState<string | null>(null)


  const updateAmountBuy = async (token : string   , amount : number)=>{
    if(amount == 0 ) {
      setBuyToken(0)
      return
    }
    const {data}   = await axios.get(`https://web3.westx.xyz/api/tokens/amount/${token}?solAmount=${amount}`)
    setBuyToken(data.tokensReceived)
  }

  const updateAmountSell = async (token : string   , amount : number)=>{
    if(amount == 0 ) {
      setSellAmount(0)
      return
    }
    const {data}   = await axios.get(`https://web3.westx.xyz/api/tokens/solAmount/${token}?tokenAmount=${amount}`)
    setSellAmount(data.solReceived)
  }
  const onClose = () => {
    setIsOpen(false)
  }

  const handlebuy = (token: string  , symbol : string) => {
    if(!isAuthenticated) {
      toast.error("Please login to buy tokens", {
        style: {
          borderRadius: '20px',
          background: '#333',
          color: '#fff',
        },
      })
      return
    }
    if (!publicKey) {
      setIsOpen(true)
      toast.error("Please connect your wallet", {
        style: {
          borderRadius: '20px',
          background: '#333',
          color: '#fff',
        },

      })

    } else {
      setselectedtoken(token)
      setIsBuyOpen(true)

      setSymbol(symbol)
      updateAmountBuy(token  , buyAmount)


    }
  }

  const confirmBuy = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      setisBuying(true)

      const lamports = Math.floor(buyAmount * LAMPORTS_PER_SOL);

      const prepareResponse = await api.prepareBuyTransaction(selectedtoken, lamports, buytoken, publicKey?.toString() as string)

      if (!prepareResponse.success) {
        throw new Error(prepareResponse.error)
      }

      const { serializedTransaction } = prepareResponse.data;

      const transaction = Transaction.from(Buffer.from(serializedTransaction, 'base64'));
      if (sendTransaction) {
        const signature = await sendTransaction(transaction, connection);
        // const {data}  = await axios.post(`${import.meta.env.VITE_PUBLIC_AI_URL}/verifySignature`, {
        //   signature: signature,
        // })
        // console.log(data)
        await connection.confirmTransaction(signature)
        const confirmResponse = await api.confirmBuyTransaction(
          selectedtoken,
          signature
        );
        if (!confirmResponse.success) {
          throw new Error(confirmResponse.error)
        }
        setIsBuyOpen(false)
        setisBuying(false)
        toast.success("Purchased successfully", {
          style: {
            borderRadius: '20px',
            background: '#333',
            color: '#fff',
          },

        })
        setBuyAmount(0.1)
        setBuyToken(1000)

      }





    } catch (error) {
      toast.error("Something went wrong", {
        style: {
          borderRadius: '20px',
          background: '#333',
          color: '#fff',
        },

      })
      setIsBuyOpen(false)
      setisBuying(false)

    }

  }



  const handleSell = async (token: string  , tokneprice : number  ) => {
    if(!isAuthenticated) {
      toast.error("Please login to sell tokens", {
        style: {
          borderRadius: '20px',
          background: '#333',
          color: '#fff',
        },
      })
      return
    }
    if (!publicKey) {
      setIsOpen(true)
      toast.error("Please connect your wallet", {
        style: {
          borderRadius: '20px',
          background: '#333',
          color: '#fff',
        },

      })
    } else {
      setselectedtoken(token)
      setisChecking(true)

      const { data } = await axios.get<TokenBalanceResponse>(`${import.meta.env.VITE_PUBLIC_AI_URL}/getTokenBalance/${publicKey.toBase58()}/${token}`)
      if (!data.exsists) {
        toast.error("You don't own any of this token", {
          style: {
            borderRadius: '20px',
            background: '#333',
            color: '#fff',
          },

        })
        setisChecking(false)
        return;
      } else {
        setisChecking(false)
        setSellTokendata({
          address: data.address,
          balance: Math.floor(data.balance),
          decimals: data.decimals
        });
        setTokenPrice(tokneprice)
        setIsSellOpen(true)
        setSellAmount(tokenPrice * sellToken)
        updateAmountSell(selectedtoken, 0)
      }
    }
  }


  const confirmSell = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      setIsSelling(true)
      let intNum = Math.floor(sellToken);
      const prepareResponse = await api.prepareSellTransaction(
        selectedtoken,
        intNum,
        0,
        publicKey?.toString() as string
      );

      if (!prepareResponse.success) {
        throw new Error(prepareResponse.error || 'Failed to prepare transaction');
      }

      const { serializedTransaction } = prepareResponse.data;
      const transaction = Transaction.from(Buffer.from(serializedTransaction, 'base64'));

      if (sendTransaction) {
        const signature = await sendTransaction(transaction, connection);
        // const {data}  = await axios.post(`${import.meta.env.VITE_PUBLIC_AI_URL}/verifySignature`, {
        //   signature: signature,
        // })
        // console.log(data)
        await connection.confirmTransaction(signature)
        const confirmResponse = await api.confirmSellTransaction(
          selectedtoken,
          signature
        );
        if (!confirmResponse.success) {
          throw new Error(confirmResponse.error)
        }
        setIsSelling(false)
        toast.success("Sold successfully", {
          style: {
            borderRadius: '20px',
            background: '#333',
            color: '#fff',
          },

        })
        setSellAmount(0.1)
        setSellToken(0)
        setIsSellOpen(false)
      }

    } catch (error) {
      toast.error("Something went wrong", {
        style: {
          borderRadius: '20px',
          background: '#333',
          color: '#fff',
        },

      })
      setIsSelling(false)
      setIsSellOpen(false)

    }

  }


  const handleTokenLaucnh = async (name: string, image: string, username: string , creator : string | null) => {
    if (!publicKey) {
      setIsOpen(true)
      toast.error("Please connect your wallet", {
        style: {
          borderRadius: '20px',
          background: '#333',
          color: '#fff',
        },

      })
    } else {
      setIsTokenLaucnhOpen(true)
      settokename(name)
      settokenimage(image)
      setusername(username)
      setCreator(creator)
  
    }

  }


  const confirmTokenLaucnh = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setisLaunching(true)
      let newdata = new FormData()
      newdata.append("name", tokenname)
      newdata.append("symbol", tokenSymbol)
      newdata.append("description", tokenDescription)
      newdata.append("buyAmount", initial.toString())
      if (typeof tokenimage === 'string' && tokenimage.startsWith('http')) {
        const fileName = `${tokenSymbol}_token.${tokenimage.split('.').pop()}`;
        const imageFile = await convertImageUrlToFile(tokenimage, fileName);
        newdata.append('image', imageFile);
      } else {
        newdata.append('image', tokenimage);
      }

      newdata.append("publicKey", publicKey?.toString() as string)

      const prepareResponse = await api.prepareLaunchTransaction(newdata)
      if (!prepareResponse.success) {
        throw new Error(prepareResponse.error)
      }

      const { serializedTransaction, tokenMint, tokenDetails } = prepareResponse.data;


      const transaction = Transaction.from(Buffer.from(serializedTransaction, 'base64'));

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

      const tokenMintKeypair = Keypair.fromSecretKey(new Uint8Array(tokenMint.secretKey));
      transaction.partialSign(tokenMintKeypair);

      if (signTransaction) {
        const signedTransaction = await sendTransaction(transaction, connection)
        await connection.confirmTransaction(signedTransaction)

        const confirmResponse = await api.confirmTokenCreation(
          tokenMint.publicKey,
          signedTransaction,
          tokenDetails
        );

        if (!confirmResponse.success) {
          throw new Error(confirmResponse.error)
        }

        const { data } = await axios.post(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/user/updateUser`, {
          publicKey: tokenMint.publicKey,
          username: username
        })

        if (!data.success) {
          throw new Error("issues in updating publicKey in database")
        }

        toast.success("Token Launched Successfully", {
          style: {
            borderRadius: '20px',
            background: '#333',
            color: '#fff',
          },

        })
        setIsTokenLaucnhOpen(false)
        setisLaunching(false)


        if(creator){
          const upgradeData = {
            username: username,
            level: "6",
            creator: creator
          }
          const {data} = await axios.post(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/persona/upgrade`, upgradeData);
          if(!data.success){
            throw new Error("issues in upgrading creator in database")
          }else{
            toast.success("Level Upgraded Successfully", {
              style: {
                borderRadius: '20px',
                background: '#333',
                color: '#fff',
              },
            })
          }

          queryClient.invalidateQueries({ queryKey: [`CreatedUser:${creator}`] });
          
        }


      }

      setisLaunching(false)



    } catch (error) {
      toast.error("Something went wrong", {
        style: {
          borderRadius: '20px',
          background: '#333',
          color: '#fff',
        },

      })
    }




  }

  return (
    <TokenContext.Provider value={{ handlebuy, handleSell, handleTokenLaucnh, isChecking }}>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center   justify-center ">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={onClose}
          />
          <div className="relative z-50 w-[95%] max-w-md h-[200px] rounded-lg bg-secondaryColor flex items-center justify-center p-6 shadow-xl">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              aria-label="Close modal"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className='flex flex-col gap-2 items-center justify-center '>
              <div className=' text-[14px]  text-center  text-yellow-400'>We are currently on Devnet  Make sure You are on Devnet  and You Should Have Solana Wallet to buy the Tokens</div>
              <div className='mt-4'>
                <WalletModalProvider>
                  <WalletMultiButton />
                </WalletModalProvider>
              </div>

            </div>



          </div>
        </div>
      )}



      {isBuyOpen && (
        <div className="fixed inset-0 z-50 flex items-center  justify-center  transition-all  ">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setIsBuyOpen(false)}
          />
          <div className="relative z-50 w-[95%] max-w-md rounded-lg bg-secondaryColor flex items-center justify-center p-6 shadow-xl">
            <button
              onClick={() => setIsBuyOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              aria-label="Close modal"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <form onSubmit={confirmBuy} className='w-full p-2 '>
              <div className='flex flex-col my-4  w-full gap-2'>
                <label htmlFor="amount" className='text-white'>Amount in Sol </label>
                <input type="number"
                  step="0.000000001"
                  min="0.000000001" id="amount" value={buyAmount} onChange={(e) => {setBuyAmount(parseFloat(e.target.value)); 
                   updateAmountBuy(selectedtoken, parseFloat(e.target.value))
                 }} placeholder='Enter amount in Sol' className='p-2 text-white rounded-md bg-primaryColor' />
              </div>

              <div className='flex flex-col w-full gap-2 '>
                <label className='text-white' htmlFor="amount">You Will Receive  ({symbol}) </label>
                <input value={ Math.floor( buytoken)} readOnly type="number" id="amount" placeholder='' className='p-2 text-white rounded-md bg-primaryColor' />
              </div>
              <button type='submit' className={`w-full p-2 text-white rounded-md bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br   mt-5 ${isBuying ? "opacity-50 cursor-not-allowed" : ""}`}> {isBuying ? "Purchasing..." : "Confirm Buy"} </button>
            </form>

          </div>
        </div>
      )}


      {isSellOpen && (
        <div className="fixed inset-0 z-50 flex items-center  justify-center ">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setIsSellOpen(false)}
          />
          <div className="relative z-50 w-[95%] max-w-md rounded-lg bg-secondaryColor flex items-center justify-center p-6 shadow-xl">
            <button
              onClick={() => setIsSellOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              aria-label="Close modal"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <form onSubmit={confirmSell} className='w-full p-2 '>


              <div className='flex flex-col w-full gap-2 '>
                <small className='text-white'> Your Current Balance is  {Math.floor(selltokendata?.balance as number)} </small>
                <label className='text-white' htmlFor="amount">Number of Tokens </label>
                <input value={sellToken} onChange={(e) => {setSellToken(parseInt(e.target.value))  ;     setSellAmount(tokenPrice * sellToken)} } type="number" id="amount" placeholder='Enter minimum token to receive' className='p-2 text-white rounded-md bg-primaryColor' />
              </div>
              <div className='flex flex-col my-4  w-full gap-2'>
                <label htmlFor="amount" className='text-white'>You will receive this Much of Sol </label>
                <input type="number"
                  id="amount" readOnly value={sellAmount} onChange={(e) => setSellAmount(parseFloat(e.target.value))} placeholder='Enter amount in Sol' className='p-2 text-white rounded-md bg-primaryColor' />
              </div>

              <div className='flex  gap-2'>
                <div onClick={() => {setSellToken(0)  ; setSellAmount(0)}} className='p-2 cursor-pointer text-white rounded-md bg-primaryColor'>Reset</div>
                <div onClick={() => {setSellToken(Math.floor(selltokendata?.balance as number * 0.25))  ;    updateAmountSell(selectedtoken, Math.floor(selltokendata?.balance as number * 0.25)) } } className='p-2 cursor-pointer text-white rounded-md bg-primaryColor'>25%</div>
                <div onClick={() => {setSellToken(Math.floor(selltokendata?.balance as number * 0.5))  ;  updateAmountSell(selectedtoken, Math.floor(selltokendata?.balance as number * 0.5)) } } className='p-2 cursor-pointer text-white rounded-md bg-primaryColor'>50%</div>
                <div onClick={() => {setSellToken(Math.floor(selltokendata?.balance as number * 0.75))  ;     updateAmountSell(selectedtoken, Math.floor(selltokendata?.balance as number * 0.75)) } } className='p-2 cursor-pointer text-white rounded-md bg-primaryColor'>75%</div>
                <div onClick={() => {setSellToken(Math.floor(selltokendata?.balance as number))  ;    updateAmountSell(selectedtoken, Math.floor(selltokendata?.balance as number)) } } className='p-2 cursor-pointer text-white rounded-md bg-primaryColor'>100%</div>

              </div>


              <button type='submit'
                className={`w-full p-2 text-white rounded-md bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br   mt-5 ${isSelling ? "opacity-50 cursor-not-allowed" : ""}`}> {isSelling ? "Selling..." : "Confirm Sell"} </button>
            </form>

          </div>
        </div>
      )}


      {isTokenLaucnhOpen && (
        <div className="fixed inset-0 z-50 flex items-center  justify-center ">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setIsTokenLaucnhOpen(false)}
          />
          <div className="relative z-50 w-[95%] max-w-md rounded-lg bg-secondaryColor flex items-center justify-center p-6 shadow-xl">
            <button
              onClick={() => setIsTokenLaucnhOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              aria-label="Close modal"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <form onSubmit={confirmTokenLaucnh} className='w-full p-2 '>
              {tokenimage && (
                <img src={tokenimage} alt="" className='w-[100px] mx-auto  h-[100px] object-cover rounded-full' />
              )}
              <div className='flex flex-col w-full gap-2 '>
                <label className='text-white' htmlFor="amount">Token Name </label>
                <input value={tokenname} readOnly type="string" id="amount" placeholder='Enter minimum token to receive' className='p-2 text-white rounded-md bg-primaryColor' />
              </div>
              <div className='flex flex-col my-4  w-full gap-2'>
                <label htmlFor="amount" className='text-white'>Token Symbol </label>
                <input required type="string"

                  id="amount" value={tokenSymbol} onChange={(e) => settokenSymbol(e.target.value)} placeholder='Enter token Symbol' className='p-2 text-white rounded-md bg-primaryColor' />
              </div>


              <div className='flex flex-col my-4  w-full gap-2'>
                <label htmlFor="intial" className='text-white'>Initial Buy </label>
                <input required type="number"  min={0}

                  id="intial" value={initial} onChange={(e) => setinitial(parseInt(e.target.value))} placeholder='Enter Initial Tokens you want'  className='p-2 text-white rounded-md bg-primaryColor' />
              </div>

              <div className='flex flex-col my-4  w-full gap-2'>
                <label htmlFor="desc" className='text-white'>Token Description </label>
                <textarea required name="desc" id="desc" value={tokenDescription} onChange={(e) => settokenDescription(e.target.value)} className='p-2 text-white rounded-md bg-primaryColor' ></textarea>
              </div>

              <button type='submit' disabled={isLaunching} className={` w-full p-2 text-white rounded-md bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br  mt-5 ${isLaunching ? "opacity-50 cursor-not-allowed" : ""}`} > {isLaunching ? "Launching..." : "Launch Token"}</button>


            </form>

          </div>
        </div>
      )}

      {children}
    </TokenContext.Provider>
  );
}

// Custom hook to use the token context
export function useToken() {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return context;
}