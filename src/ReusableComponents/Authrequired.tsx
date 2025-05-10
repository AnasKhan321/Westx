import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const AuthRequired = ({isHome = false  , description = "Please sign in to access this page and experience the future of social media with WestX."}) => {
  const navigate = useNavigate();
const {handleTwitterLogin} = useAuth()
  return (
    <div className={`min-h-screen ${isHome ? 'bg-transparent' : 'bg-newcolor'} text-white flex items-center justify-center p-4`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Logo and Icon */}
        <motion.div 
          className="flex flex-col items-center mb-8"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <img
            src="/logo-round.png"
            alt="WestX Logo"
            className="w-24 h-24 rounded-full mb-6"
          />
    
        </motion.div>

        {/* Content */}
        <motion.div 
          className="bg-[#1a1a1a] rounded-xl p-8 shadow-2xl border border-purple-500/20"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-xl  md:text-2xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
          Unlock with Sign in 
          </h1>
          
          <p className="text-gray-400 text-center mb-8">
           {description}
          </p>

          {/* Buttons */}
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleTwitterLogin}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
               Connect With X
            </motion.button>

          {!isHome && 
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/')}
              className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Go Back Home
            </motion.button>
          }
          </div>

          {/* Footer */}
    
        </motion.div>

        {/* Animated Background Elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute -inset-[10px] opacity-50"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
              backgroundSize: ['100% 100%', '200% 200%'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              background: 'radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, rgba(79, 70, 229, 0) 70%)',
              filter: 'blur(40px)',
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default AuthRequired;