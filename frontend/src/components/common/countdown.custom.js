import React, { useEffect, useState } from "react";
import { Typography } from "@material-ui/core";

const Countdown = (props) => {
  const { date } = props;
  const calculateTimeLeft = () => {
    //   let year = new Date().getFullYear();
    //   let difference = +new Date(`10/01/${year}`) - +new Date();
    let difference = +new Date(date) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    // Clear timeout if the component is unmounted
    return () => clearTimeout(timer);
  });

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(timeLeft[interval]);
  });

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
              <Typography
                style={{ color: "#000000" }}
                align="center"
                variant="h3"
              >
                {date ? timeLeft.minutes : "--"}
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
              <Typography
                style={{ color: "#000000" }}
                align="center"
                variant="h3"
              >
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
              <Typography
                style={{ color: "#000000" }}
                align="center"
                variant="h3"
              >
                {date ? timeLeft.seconds : "--"}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
