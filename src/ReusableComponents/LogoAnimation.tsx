import { motion } from "motion/react";
import { useState, useEffect } from "react";

const text = "WEST";

export default function WestxWithTyping() {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    // Small initial delay before bounce (0-0.8s)
    const initialDelay = setTimeout(() => setAnimationPhase(1), 300);
    // Phase 1: X bounces to center (0.8-1.6s)
    const timer1 = setTimeout(() => setAnimationPhase(2), 1200);
    // Phase 2: X moves to right (1.6-2.0s)
    const timer2 = setTimeout(() => setAnimationPhase(3), 1600);
    // Phase 3: Text comes from right (2.0-2.6s)
    const timer3 = setTimeout(() => setAnimationPhase(4), 2300);
    
    return () => {
      clearTimeout(initialDelay);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondaryColor text-white overflow-hidden relative">
      {/* Container to center everything */}
      <div className="relative w-full flex justify-center items-center">
        {/* X Animation with enhanced bounce */}
        <motion.div
          initial={{ y: 600, x: 0 }}
          animate={{ 
            y: animationPhase >= 1 ? 0 : 600,
            x: animationPhase >= 3 ? 50 : -150
          }}
          transition={{
            y: {
              type: "spring",
              stiffness: 100,
              damping: 8,
              mass: 0.8,
              restDelta: 0.0001,
            },
            x: {
              type: "spring",
              duration: 0.8,
              stiffness: 150,
              damping: 20,
            }
          }}
          className="absolute z-20"
        >
          <motion.img
            src="/X.png"
            alt="X"
            className="md:h-[60px] h-[40px] md:-translate-x-[-68px] -translate-x-[-30px]"
          />
        </motion.div>

        {/* WEST text animation from right */}
        {animationPhase >= 4 && (
          <div className="flex items-center justify-center absolute">
            <div className="flex gap-1 md:text-[60px] text-[40px] font-extrabold tracking-wider -translate-x-[50px]">
              {text.split("").map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ x: 100, opacity: 0, scale: 0.8 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  transition={{
                    delay: index * 0.08,
                    duration: 0.8,
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  className="text-white font-akira"
                >
                  {char}
                </motion.span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
