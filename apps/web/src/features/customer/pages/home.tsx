import { useEffect } from "react";
import Mobile from "./home/mobile";
import Laptop from "./laptop.page";

const CustomerHomePage = () => {
  useEffect(() => {
    document.title = "Home";
  }, []);

  return (
    <div>
      <div className="md:hidden">
        <Mobile />
      </div>
      <div className="hidden md:block">
        <Laptop />
      </div>
    </div>
  );
};

export default CustomerHomePage;
