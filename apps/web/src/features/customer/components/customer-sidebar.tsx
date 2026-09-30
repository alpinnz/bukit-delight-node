import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingIndicator from "../../../components/atoms/loading-indicator";

type Category = { id: string; name: string };
type CustomerSidebarState = {
  Categories: { loading: boolean; data: Category[] };
};

const CategoryNavigation = () => {
  const { id: selectedCategoryId } = useParams<{ id?: string }>();
  const categories = useSelector(
    (state: CustomerSidebarState) => state.Categories,
  );

  if (categories.loading) {
    return (
      <div className="flex h-[90vh] items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  const isHome = window.location.pathname === "/customer/home";
  const linkClass = (isSelected: boolean) =>
    `block px-4 py-3 font-semibold ${isSelected ? "bg-brand-accent text-white" : "text-black/60 hover:bg-orange-50"}`;

  return (
    <nav aria-label="Kategori menu customer" className="w-full max-w-sm">
      <ul className="divide-y divide-slate-200 border-y border-slate-200">
        {categories.data.map((category) => {
          const isSelected = category.id === selectedCategoryId;
          return (
            <li key={category.id}>
              <Link
                to={`/customer/book/${category.id}`}
                aria-current={isSelected ? "page" : undefined}
                className={linkClass(isSelected)}
              >
                {category.name}
              </Link>
            </li>
          );
        })}
        <li>
          <Link
            to="/customer/home"
            aria-current={isHome ? "page" : undefined}
            className={`${linkClass(isHome)} ${isHome ? "" : "text-pink-600"}`}
          >
            PROMO &amp; FAV.
          </Link>
        </li>
      </ul>
    </nav>
  );
};

const CustomerSidebar = () => (
  <aside className="relative min-h-screen bg-white">
    <div className="flex h-[10vh] items-center justify-center">
      <h1 className="text-center text-xl font-extrabold text-[#11613F]">
        LOGO &amp; TEKS BUKIT DELIGHT
      </h1>
    </div>
    <CategoryNavigation />
  </aside>
);

export default CustomerSidebar;
