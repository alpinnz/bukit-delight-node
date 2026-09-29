import Sidebar from "./sidebar";
import ContentLeft from "./desktop-menu-panel";
import Banner from "../components/laptop-banner";
import CustomerDesktopCartContent from "./cart/desktop-content";
import Icons from "../../../assets/icons";

const CustomerLaptopPage = () => {
  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className="md:col-span-2">
          <Sidebar />
        </div>
        <div className="md:col-span-6">
          <Banner />
          <ContentLeft />
        </div>
        <div className="md:col-span-4">
          <div className="relative flex h-[10vh] items-center justify-around bg-white">
            <button type="button" aria-label="Lihat pesanan">
              <img className="h-[5vh]" src={Icons.laptop_plater} alt="" />
            </button>
            <button type="button" aria-label="Lihat keranjang">
              <img className="h-[5vh]" src={Icons.laptop_cart} alt="" />
            </button>
          </div>
          <CustomerDesktopCartContent />
        </div>
      </div>
    </div>
  );
};

export default CustomerLaptopPage;
