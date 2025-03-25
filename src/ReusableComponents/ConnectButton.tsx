import { motion } from 'motion/react';

interface ConnectButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

const ConnectButton = ({ onClick, isLoading = false }: ConnectButtonProps) => {
  return (
    <motion.div
      className="  "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.button
        onClick={onClick}
        disabled={isLoading}
        className="group relative w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] disabled:opacity-70"
        whileHover={{ boxShadow: "0 0 20px rgba(147, 51, 234, 0.5)" }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Animated background effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "linear"
          }}
        />

        {/* Icon */}
        <motion.div
          animate={isLoading ? {
            rotate: 360,
            transition: {
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }
          } : {}}
        >
          {/* {isLoading ? (
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )} */}
        </motion.div>

        {/* Text */}
        <span className="text-white font-medium text-base">
          {isLoading ? "Connecting..." : "Connect with X"}
        </span>

        {/* Animated arrow */}
        <motion.svg
          className="w-5 h-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ x: [0, 5, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </motion.svg>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.button>

      {/* Subtle hint text */}
      <motion.p
        className="text-gray-400 text-sm text-center mt-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Connect to unlock all features
      </motion.p>
    </motion.div>
  );
};

export default ConnectButton;