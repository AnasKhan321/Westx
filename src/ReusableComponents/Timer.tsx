import { useState, useEffect } from "react";

const Timer: React.FC = () => {
  const targetHour = 20; 
  const targetMinute = 0; 

  const calculateTimeLeft = () => {
    const now = new Date();
    const targetTime = new Date();

    targetTime.setHours(targetHour, targetMinute, 0, 0);

    if (now > targetTime) {

      targetTime.setDate(targetTime.getDate() + 1);
    }

    return Math.floor((targetTime.getTime() - now.getTime()) / 1000);
  };

  const [timeLeft, setTimeLeft] = useState<number>(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div>
      <h2> {formatTime(timeLeft)}</h2>
    </div>
  );
};

export default Timer;
