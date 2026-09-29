import { useEffect, useState } from "react";

type CountdownCustomProps = { date?: string | number | Date | null };
type TimeLeft = { minutes?: number; seconds?: number };

const calculateTimeLeft = (date?: CountdownCustomProps["date"]): TimeLeft => {
  if (!date) return {};

  const difference = new Date(date).getTime() - Date.now();
  if (difference <= 0) return {};

  return {
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

const CountdownCustom = ({ date }: CountdownCustomProps) => {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(date));

  useEffect(() => {
    setTimeLeft(calculateTimeLeft(date));
    const timer = window.setInterval(() => {
      setTimeLeft(calculateTimeLeft(date));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [date]);

  return (
    <div role="timer" aria-label="Waktu tersisa">
      <div className="mt-[10px] mb-[30px] flex items-center justify-center">
        <div className="relative flex h-[50px] w-[7.5rem] items-center justify-center rounded-lg bg-white p-2">
          <div className="relative flex w-full items-center justify-center bg-white">
            <div className="flex w-[45%] items-center justify-center">
              <span className="text-3xl font-semibold text-black">
                {date ? (timeLeft.minutes ?? 0) : "--"}
              </span>
            </div>
            <div className="flex w-[10%] items-center justify-center">
              <span className="text-3xl font-semibold text-black">:</span>
            </div>
            <div className="flex w-[45%] items-center justify-center">
              <span className="text-3xl font-semibold text-black">
                {date ? (timeLeft.seconds ?? 0) : "--"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownCustom;
