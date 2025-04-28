import { motion } from "motion/react"

const WestXLoader = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-bg-secondaryColor to-black flex flex-col items-center justify-center min-h-screen">
      {/* Logo and Pulse Effect */}
      <div className="relative">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <img
            src="/logo-round.png" // Make sure to use your actual logo path
            alt="WestX Logo"
            className="w-24 h-24 md:w-32 md:h-32 rounded-full"
          />
        </motion.div>
        
        {/* Pulse Rings */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 rounded-full bg-purple-500/30 -z-10"
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3
          }}
          className="absolute inset-0 rounded-full bg-purple-500/20 -z-20"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 text-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text mb-2">
          WestX
        </h2>
        <LoadingDots />
      </motion.div>
    </div>
  );
};

// Animated loading dots component
const LoadingDots = () => {
  return (
    <div className="flex justify-center items-center space-x-1">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0.2 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: index * 0.2,
          }}
          className="w-2 h-2 bg-purple-500 rounded-full"
        />
      ))}
    </div>
  );
};

export default WestXLoader;