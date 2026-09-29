import {
  BookOpenIcon,
  HomeIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";

const navigationItems = [
  { label: "Cart", path: "/customer/cart", icon: ShoppingCartIcon },
  { label: "Book", path: "/customer/book", icon: BookOpenIcon },
  { label: "Home", path: "/customer/home", icon: HomeIcon },
];

const BottomNavigationCustom = () => {
  return (
    <nav
      aria-label="Customer navigation"
      className="fixed inset-x-1 bottom-1 z-40 rounded-full bg-brand-primary shadow-lg"
    >
      <div className="flex justify-around">
        {navigationItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end
            aria-label={label}
            data-page-navigation="true"
            onClick={(event) => {
              if (
                event.defaultPrevented ||
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
              ) {
                return;
              }

              window.setTimeout(() => {
                document
                  .querySelector<HTMLAnchorElement>(
                    '[data-page-navigation][aria-current="page"]',
                  )
                  ?.focus();
              }, 0);
            }}
            className={({ isActive }) =>
              [
                "flex flex-1 justify-center rounded-full p-3 text-white outline-none focus-visible:ring-2 focus-visible:ring-white",
                isActive && "bg-white/15",
              ]
                .filter(Boolean)
                .join(" ")
            }
          >
            <Icon aria-hidden="true" className="size-7" />
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigationCustom;
