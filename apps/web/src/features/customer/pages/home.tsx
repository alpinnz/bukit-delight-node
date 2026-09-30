import { useEffect } from "react";
import { useSelector } from "react-redux";
import CustomerMobileHomePage from "./home/mobile";
import CustomerTableSelection from "../components/table-selection";
import CustomerDesktopOrderingPage from "./desktop-ordering-page";
import type { RootState } from "../../../reducers";

const CustomerHomePage = () => {
  const table = useSelector((state: RootState) => state.Tables.table);

  useEffect(() => {
    document.title = "Home";
  }, []);

  if (!table) return <CustomerTableSelection />;

  return (
    <div>
      <div className="md:hidden">
        <CustomerMobileHomePage />
      </div>
      <div className="hidden md:block">
        <CustomerDesktopOrderingPage />
      </div>
    </div>
  );
};

export default CustomerHomePage;
