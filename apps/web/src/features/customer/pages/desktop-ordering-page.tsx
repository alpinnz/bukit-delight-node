import CustomerSidebar from "../components/customer-sidebar";
import CustomerDesktopMenuPanel from "./desktop-menu-panel";
import CustomerDesktopBanner from "../components/desktop-banner";
import CustomerDesktopCartContent from "./cart/desktop-content";
import icons from "../../../assets/icons";

const CustomerDesktopOrderingPage = () => {
  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className="md:col-span-2">
          <CustomerSidebar />
        </div>
        <div className="md:col-span-6">
          <CustomerDesktopBanner />
          <CustomerDesktopMenuPanel />
        </div>
        <div className="md:col-span-4">
          <div className="relative flex h-[10vh] items-center justify-around bg-white">
            <button type="button" aria-label="Lihat pesanan">
              <img className="h-[5vh]" src={icons.laptopPlatter} alt="" />
            </button>
            <button type="button" aria-label="Lihat keranjang">
              <img className="h-[5vh]" src={icons.laptopCart} alt="" />
            </button>
          </div>
          <CustomerDesktopCartContent />
        </div>
      </div>
    </div>
  );
};

export default CustomerDesktopOrderingPage;
