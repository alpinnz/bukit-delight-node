import { useState, useEffect } from "react";

const useNetwork = () => {
  const [isNetwork, setIsNetwork] = useState(window.navigator.onLine);

  const updateNetwork = () => {
    setIsNetwork(window.navigator.onLine);
  };

  useEffect(() => {
    window.addEventListener("offline", updateNetwork);
    window.addEventListener("online", updateNetwork);
    return () => {
      window.removeEventListener("offline", updateNetwork);
      window.removeEventListener("online", updateNetwork);
    };
  });

  return isNetwork;
};

export default useNetwork;
