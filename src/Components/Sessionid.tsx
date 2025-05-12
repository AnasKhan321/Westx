import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCoins, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { BsArrowLeft } from 'react-icons/bs';
import { BiTime } from 'react-icons/bi';

interface SessionData {
  amount: string,
  userid: string
}

const Sessionid = () => {
  const { sessionid } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [toastShown, setToastShown] = useState(false);

  useEffect(() => {
    const fetchSessionData = async () => {
      if (!sessionid) return;
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_PUBLIC_AI_URL}/api/payment/session/${sessionid}`
        );

        console.log(response.data.metadata);
        setSessionData(response.data.metadata);
        
        // Only show toast if it hasn't been shown yet
        if (!toastShown) {
          toast.success('Payment successful! Points added to your account.', {
            icon: '🎉',
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
            duration: 3000
          });
          setToastShown(true);
        }
        
      } catch (err) {
        console.error('Error fetching session data:', err);
        setError('Failed to fetch session data');
        
        // Only show error toast if no toast has been shown yet
        if (!toastShown) {
          toast.error('Something went wrong with fetching your payment data.', {
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            }
          });
          setToastShown(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [sessionid, toastShown]);

  // Auto redirect countdown
  useEffect(() => {
    if (!loading && !error) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [loading, error, navigate]);

  const handleGoBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="h-screen bg-primaryColor flex flex-col items-center justify-center">
        <div className="w-full max-w-md p-6 bg-secondaryColor rounded-lg">
          <div className="flex items-center justify-center mb-4">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-white text-center">Processing your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-primaryColor flex flex-col items-center justify-center">
        <div className="w-full max-w-md p-6 bg-secondaryColor rounded-lg">
          <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-4">
            <span className="text-red-500 text-3xl">✕</span>
          </div>
          <h2 className="text-xl text-white font-bold mb-4 text-center">Payment Error</h2>
          <p className="text-white/70 mb-6 text-center">{error}</p>
          <button 
            onClick={handleGoBack}
            className="w-full py-3 px-4 rounded-full font-medium transition-all bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br text-white"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Calculate points based on amount (assuming $1 = 100 points)
  const pointsAdded = parseInt(sessionData?.amount || "0") * 100;

  return (
    <div className="h-screen bg-secondaryColor  md:h-[98vh] md:mt-[2vh] w-full md:bg-primaryColor border border-white/10 rounded-l-lg  overflow-auto">


      <div className="w-full max-w-md p-6 mx-auto  mt-10 bg-secondaryColor rounded-lg">
        <div className="flex flex-col items-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
            <FaCheckCircle className="text-green-500 text-4xl" />
          </div>
          
          {/* Success Message */}
          <h2 className="text-2xl text-white font-bold mb-2 text-center">Payment Successful!</h2>
          <p className="text-white/70 mb-6 text-center">Your points have been added to your account.</p>
          
          {/* Payment Details */}
          <div className="w-full p-5 bg-white/5 rounded-lg mb-6 border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/70">Amount Paid:</span>
              <span className="text-white font-bold">${sessionData?.amount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Points Added:</span>
              <div className="flex items-center">
                <FaCoins className="text-yellow-400 mr-2" />
                <span className="text-white font-bold">{pointsAdded}</span>
              </div>
            </div>
          </div>
          
          {/* Auto Redirect Notice */}
          <div className="w-full p-3 bg-purple-500/10 rounded-lg mb-6 flex items-center justify-center">
            <BiTime className="text-purple-400 mr-2" />
            <span className="text-white/80">Redirecting to homepage in {countdown} seconds</span>
          </div>
          
          {/* Buttons */}
          <div className="flex gap-4 w-full">
            <button 
              onClick={handleGoBack}
              className="w-full py-3 px-4 rounded-full font-medium transition-all bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br text-white flex items-center justify-center"
            >
              <BsArrowLeft className="mr-2" />
              Return Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sessionid;
