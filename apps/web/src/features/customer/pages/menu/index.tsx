import { useEffect } from "react";
import Mobile from "./mobile";
import Desktop from "../desktop-ordering-page";

const CustomerMenuPage = () => {
  useEffect(() => {
    document.title = "Menu";
  }, []);

  return (
    <div>
      <div className="md:hidden">
        <Mobile />
      </div>
      <div className="hidden md:block">
        <Desktop />
      </div>
    </div>
  );
};

export default CustomerMenuPage;
