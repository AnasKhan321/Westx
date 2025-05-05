import { useEffect, useState } from "react";
import { User } from "../utils/type";
import { AnimatePresence, motion } from "motion/react";
import { FaStar, FaCoins } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../Context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useToken } from "../Context/TokenContext";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: User;
}

export const UpgradeModal = ({ isOpen, onClose, profile }: ModalProps) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const currentLevel = parseInt(profile.level.toString().split("_")[1]);
  const nextLevel = currentLevel + 1;
  const [isUpgrading, setIsUpgrading] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const {handleTokenLaucnh } = useToken();

  // Get level descriptions based on the next level
  const getLevelDescription = (level: number) => {
    const descriptions = {
      1: "Now Your Persona Starts Tweeting Once Per Day",
      2: "You Persona Also Post Photo Once A Week And You can Customize Your Persona ",
      3: "He Will Became a Supreme Persona Which will Start interacting with other Personas",
      4: "Persona Gets X Account and posts replies on X tweet  ",
      5: " Persona Also Posts Photos On X",
      6: "You can Launch Your Persona as a Token on Solana"
    };

    return descriptions[level as keyof typeof descriptions] || `Congratulations on reaching level ${level}! You've unlocked new features and benefits.`;
  };

  // Get upgrade cost based on the next level
  const getUpgradeCost = (level: number) => {
    const costs = {
      1: 100,
      2: 150,
      3: 250,
      4: 300,
      5: 400,
      6: 500
    };

    return costs[level as keyof typeof costs] || 1000;
  };

  const upgradeCost = getUpgradeCost(nextLevel);



  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Trigger animation after a short delay
      const timer = setTimeout(() => {
        setShowAnimation(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = 'unset';
      setShowAnimation(false);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const handleLaunch = async () => {
    if (user?.Points as number < upgradeCost) {
      toast.error("InSufficient Balance", {
        style: {
          borderRadius: '20px',
          background: '#333',
          color: '#fff',
        },

      });
      setIsUpgrading(false);
      return;
    }else{
      onClose();
      handleTokenLaucnh(profile.name, profile.photoURL, profile.username, user?.username || null)
    }
   
  }

  const handleUpgrade = async () => {
    setIsUpgrading(true);


    if (user?.Points as number < upgradeCost) {
      toast.error("InSufficient Balance", {
        style: {
          borderRadius: '20px',
          background: '#333',
          color: '#fff',
        },

      });
      setIsUpgrading(false);
      return;
    }

    const upgradeData = {
      username: profile.username,
      level: nextLevel.toString(),
      creator: user?.username
    }



    const { data } = await axios.post(`${import.meta.env.VITE_PUBLIC_AI_URL}/api/persona/upgrade`, upgradeData);

    if (data.success) {




      if (nextLevel === 4) {
        toast.success("Persona Will Get X Account Soon", {
          style: {
            borderRadius: '20px',
            background: '#333',
            color: '#fff',
          },

        });
      } else {
        toast.success("Persona Upgraded Successfully", {
          style: {
            borderRadius: '20px',
            background: '#333',
            color: '#fff',
          },

        });

      }



      onClose();
      queryClient.invalidateQueries({ queryKey: [`CreatedUser:${user?.username}`] });
    } else {
      toast.error(data.error, {
        style: {
          borderRadius: '20px',
          background: '#333',
          color: '#fff',
        },

      });
    }

    setIsUpgrading(false);
  }


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 top-0"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed max-h-[94vh] md:left-1/4 transform -translate-x-1/2 overflow-y-auto my-[3vh] w-full md:w-[90%] max-w-[28rem] md:max-w-2xl z-50 top-0"
          >
            <div className="w-[95%] md:w-full min-h-[300px] bg-gradient-to-b from-secondaryColor to-secondaryColor/80 rounded-xl shadow-2xl border border-white/10">
              <div className="flex items-center justify-end cursor-pointer" onClick={onClose}>
                <IoMdClose className="text-white/40 text-2xl absolute top-2 right-8 md:right-2" />
              </div>
              <div className="flex flex-col items-center justify-center p-6">
                {/* profile info */}
                <div className="flex items-center gap-3 justify-center flex-col py-4">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative"
                  >
                    <img src={profile.photoURL} alt="profile" className="w-16 h-16 rounded-full border-4 border-white/20" />
                    <motion.div
                      className="absolute -bottom-2 -right-2 bg-primaryColor rounded-full p-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <FaStar className="text-yellow-400 text-sm" />
                    </motion.div>
                  </motion.div>
                  <motion.span
                    className="text-xl font-bold text-white"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {profile.name}
                  </motion.span>
                </div>

                {/* Level transition */}
                <motion.div
                  className="flex flex-col items-center justify-center py-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Level Up!</h2>

                  <div className="flex items-center justify-center gap-4">
                    {/* Current level */}
                    <motion.div
                      className="flex flex-col items-center"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-2xl font-bold text-white">
                        {currentLevel}
                      </div>
                      <span className="text-sm text-white/70 mt-2">Current</span>
                    </motion.div>

                    {/* Arrow */}
                    <motion.div
                      className="flex items-center"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                    >
                      <div className="text-3xl text-white/50">→</div>
                    </motion.div>

                    {/* Next level */}
                    <motion.div
                      className="flex flex-col items-center"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: showAnimation ? 1.2 : 1, opacity: 1 }}
                      transition={{
                        delay: 0.8,
                        scale: {
                          repeat: showAnimation ? 1 : 0,
                          repeatType: "reverse",
                          duration: 0.5
                        }
                      }}
                    >
                      <div className="w-16 h-16 rounded-full bg-primaryColor flex items-center justify-center text-2xl font-bold text-white">
                        {nextLevel}
                      </div>
                      <span className="text-sm text-white/70 mt-2">Next</span>
                    </motion.div>
                  </div>

                  {/* Level Description */}
                  <motion.div
                    className="mt-8 p-4 bg-white/10 rounded-lg max-w-md text-center"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">Level {nextLevel} Unlocked!</h3>
                    <p className="text-white/80">{getLevelDescription(nextLevel)}</p>
                  </motion.div>

                  {/* Upgrade Cost */}
                  <motion.div
                    className="mt-6 flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.4, duration: 0.5 }}
                  >
                    <FaCoins className="text-yellow-400" />
                    <span className="text-white">Upgrade Cost: <span className="font-bold">{upgradeCost}</span> points</span>
                  </motion.div>

                  {/* Progress bar */}
                  <motion.div
                    className="w-full max-w-xs h-2 bg-white/10 rounded-full mt-8 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <motion.div
                      className="h-full bg-white rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 1, duration: 1 }}
                    />
                  </motion.div>

                  {/* Upgrade button */}

                  {nextLevel == 6  &&
                  
                  <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.8 }}
                  onClick={handleLaunch}
                  className="mt-6 px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed bg-white/20 hover:bg-white/30 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-b text-white rounded-full transition-colors"
                  disabled={isUpgrading}
                >
                  {isUpgrading ? "Launching..." : "Launch Token"}
                </motion.button>
                  
                  }

                  {nextLevel <=5  && 


                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.8 }}
                    onClick={handleUpgrade}
                    className="mt-6 px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed bg-white/20 hover:bg-white/30 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-b text-white rounded-full transition-colors"
                    disabled={isUpgrading}
                  >
                    {isUpgrading ? "Upgrading..." : "Upgrade"}
                  </motion.button>}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};