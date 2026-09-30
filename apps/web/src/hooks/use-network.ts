import { useEffect, useState } from "react";

const useNetwork = (): boolean => {
  const [isOnline, setIsOnline] = useState(() => window.navigator.onLine);

  useEffect(() => {
    const updateNetworkStatus = () => setIsOnline(window.navigator.onLine);
    window.addEventListener("offline", updateNetworkStatus);
    window.addEventListener("online", updateNetworkStatus);

    return () => {
      window.removeEventListener("offline", updateNetworkStatus);
      window.removeEventListener("online", updateNetworkStatus);
    };
  }, []);

  return isOnline;
};

export default useNetwork;
