import {
  ClipboardDocumentListIcon,
  HomeIcon,
  ReceiptPercentIcon,
} from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";

const tabs = [
  { label: "Home", icon: HomeIcon, path: "/cashier/home" },
  { label: "Orders", icon: ClipboardDocumentListIcon, path: "/cashier/orders" },
  {
    label: "Transactions",
    icon: ReceiptPercentIcon,
    path: "/cashier/transactions",
  },
];

const CashierTabs = () => {
  return (
    <nav aria-label="Cashier navigation" className="bg-brand-primary">
      <div className="mx-auto flex max-w-3xl justify-around">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end
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
                "flex w-1/3 flex-col items-center gap-1 px-3 py-2 text-sm font-medium text-white outline-none focus-visible:ring-2 focus-visible:ring-white",
                isActive && "bg-black/10",
              ]
                .filter(Boolean)
                .join(" ")
            }
          >
            <tab.icon aria-hidden="true" className="size-5" />
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default CashierTabs;
