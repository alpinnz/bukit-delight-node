import { useEffect, useState } from "react";
import { Typography } from "@material-ui/core";

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
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 10,
          marginBottom: 30,
        }}
      >
        <div
          style={{
            backgroundColor: "#FFFFFF",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "7.5rem",
            height: 50,
            borderRadius: 8,
            position: "relative",
            padding: "0.5rem",
          }}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "45%",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
              }}
            >
              <Typography style={{ color: "#000000" }} align="center" variant="h3">
                {date ? (timeLeft.minutes ?? 0) : "--"}
              </Typography>
            </div>
            <div
              style={{
                width: "10%",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
              }}
            >
              <Typography style={{ color: "#000000" }} align="center" variant="h3">
                :
              </Typography>
            </div>
            <div
              style={{
                width: "45%",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
              }}
            >
              <Typography style={{ color: "#000000" }} align="center" variant="h3">
                {date ? (timeLeft.seconds ?? 0) : "--"}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownCustom;
