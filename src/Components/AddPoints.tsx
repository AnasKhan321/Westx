import { useState } from 'react'
import { useAuth } from '../Context/AuthContext'
import { FaCoins } from 'react-icons/fa'
import { FiCreditCard } from 'react-icons/fi'
import { BsLightningCharge, BsStars, BsRocketTakeoff } from 'react-icons/bs'
import AuthRequired from '../ReusableComponents/Authrequired'
import { useNavigate } from 'react-router-dom'
import { IoCaretBack } from 'react-icons/io5'
import axios from "axios"


import { loadStripe } from '@stripe/stripe-js';


const stripePromise = loadStripe('pk_test_51RLmMSEErj9V1eYd6C8zbIafoj0ogt1ifgCRkGzlHHYpz7HofnVP62rRZhYeTIQ3b6he16PElkXHBHFe95VAqTt400CyNvbCZx'); // Replace with your public key


const AddPoints = () => {
  const { user } = useAuth()
  const [customPoints, setCustomPoints] = useState<number>(1000)
  const [customPrice, setCustomPrice] = useState<number>(10)
  const [isend, setisend] = useState<boolean>(false)
  const handleCustomPointsChange = (value: number) => {
    setCustomPoints(value)
    // $1 = 100 points conversion rate
    setCustomPrice(value / 100)
  }

  const handleCustomPriceChange = (value: number) => {
    setCustomPrice(value)
    // $1 = 100 points conversion rate
    setCustomPoints(value * 100)
  }

  const handlePurchase = async () => {
    if (!isend) {
      setisend(true)
      if (user?.id) {

        const response = await axios.post(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/payment/create-checkout-session`, {
          amount: customPrice,
          userid: user?.id
        })
        console.log(response)

        const session = await response.data;
        console.log(session);

        const stripe = await stripePromise;

        setisend(false)




        // Redirect to Stripe Checkout
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({
            sessionId: session.sessionId,
          });

          if (error) {
            console.error("Error redirecting to checkout:", error);
          }
        }
      }

      // TODO: Implement Stripe checkout
    }
  }

  return (
    <div className=' w-full bg-secondaryColor  rounded-l-lg p-2 overflow-auto'>
      {/* Current Balance Section */}
      <div className="mb-8 p-6 bg-primaryColor rounded-lg">
        <h2 className="text-2xl font-bold text-white mb-2">Your Balance</h2>
        <div className="flex items-center gap-2">
          <FaCoins className="text-yellow-400 text-xl" />
          <span className="text-3xl font-bold text-white">{user?.Points || 0}</span>
          <span className="text-white/60">points</span>
        </div>
        <p className="text-white/60 mt-2">Use points to upgrade personas and access premium features</p>
      </div>

      {/* Conversion Rate Info */}
      <div className="mb-8 p-4 mx-2  bg-primaryColor/20 border border-purple-500/30 rounded-lg">
        <div className="flex items-center gap-2">
          <FiCreditCard className="text-purple-400" />
          <span className="text-white font-medium">$1 = 100 points</span>
        </div>
      </div>

      {/* Custom Amount */}
      <div className="mb-8 p-6 bg-primaryColorrounded-lg">
        <h3 className="text-xl font-bold text-white mb-4">Purchase Points</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-white">Points Amount</label>
            <div className="relative">
              <input
                type="number"
                value={customPoints}
                onChange={(e) => handleCustomPointsChange(parseInt(e.target.value) || 0)}
                className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:border-purple-500"
                placeholder="Enter points amount"
                min="100"
                step="100"
              />
              <FaCoins className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-400" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-white">Price ($USD)</label>
            <div className="relative">
              <input
                type="number"
                value={customPrice}
                onChange={(e) => handleCustomPriceChange(parseFloat(e.target.value) || 0)}
                className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:border-purple-500"
                placeholder="Enter price in USD"
                min="1"
                step="0.1"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white">$</span>
            </div>
          </div>
        </div>
        <button
          onClick={handlePurchase}
          className="mt-6 w-full py-3 px-4 rounded-full font-medium text-lg transition-all bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br text-white disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={customPoints < 100 || isend}
        >
          {isend ? "Processing..." : "Purchase Points"}
        </button>
      </div>

      {/* Benefits Section */}
      <div className="p-6 bg-primaryColorrounded-lg">
        <h3 className="text-xl font-bold text-white mb-6">Benefits of Purchasing Points</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center gap-4 p-4 bg-primaryColor rounded-lg">
            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-700 rounded-full text-white">
              <BsStars size={24} />
            </div>
            <h4 className="text-white font-medium text-lg">Add New Personas</h4>
            <p className="text-white/60">Create and customize new personas for different purposes and audiences</p>
          </div>

          <div className="flex flex-col items-center text-center gap-4 p-4 bg-primaryColor rounded-lg">
            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-700 rounded-full text-white">
              <BsLightningCharge size={24} />
            </div>
            <h4 className="text-white font-medium text-lg">Upgrade Personas</h4>
            <p className="text-white/60">Level up your personas from Level 1 to Level 2 to unlock enhanced capabilities</p>
          </div>

          <div className="flex flex-col items-center text-center gap-4 p-4 bg-primaryColor rounded-lg">
            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-700 rounded-full text-white">
              <BsRocketTakeoff size={24} />
            </div>
            <h4 className="text-white font-medium text-lg">Launch as Token</h4>
            <p className="text-white/60">Launch your persona as a token and earn 0.5% transaction fees on every transaction before migration</p>
          </div>
        </div>
      </div>
    </div>
  )
}



const AddPointsWrapper = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(-1);
  }
  return (
    <div className=' h-screen bg-primaryColor md:h-[98vh] md:mt-[2vh] w-full md:bg-secondaryColor border border-white/10 rounded-l-lg  overflow-auto'>

      <div className="flex absolute p-4   items-center space-x-2  backdrop-blur-xl   bg-primaryColor  w-full  md:w-[49.8%] rounded-l-2xl font-bold   ">
        <IoCaretBack className="text-xl cursor-pointer" onClick={handleClick} />
        <span>Add Points</span>
      </div>

      <div className='mt-16'></div>

      {isAuthenticated ? <AddPoints /> : <AuthRequired />}
    </div>
  )
}

export default AddPointsWrapper

