import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";

type AdminDrawerProps = {
  openMobileDrawer: boolean;
  setOpenMobileDrawer: Dispatch<SetStateAction<boolean>>;
};

const navigationItems = [
  { label: "Dashboard", path: "dashboard" },
  { label: "Transactions", path: "transactions" },
  { label: "Categories", path: "categories" },
  { label: "Menus", path: "menus" },
  { label: "Tables", path: "tables" },
  { label: "Accounts", path: "accounts" },
  { label: "Favorites", path: "favorites" },
];

const AdminDrawer = ({
  openMobileDrawer,
  setOpenMobileDrawer,
}: AdminDrawerProps) => {
  const pathSegments = window.location.pathname.toLowerCase().split("/");
  const closeDrawer = () => setOpenMobileDrawer(false);
  const navigation = (
    <nav aria-label="Admin navigation" className="space-y-1 p-3">
      {navigationItems.map(({ label, path }) => {
        const isSelected = pathSegments[2] === path;
        return (
          <Link
            key={path}
            to={`/admin/${path}`}
            onClick={closeDrawer}
            aria-current={isSelected ? "page" : undefined}
            className={`block rounded-md px-3 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${isSelected ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-slate-100"}`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <aside className="fixed bottom-0 left-0 top-16 z-20 hidden w-48 border-r border-slate-200 bg-white sm:block">
        {navigation}
      </aside>
      <Dialog
        open={openMobileDrawer}
        onClose={closeDrawer}
        className="relative z-50 sm:hidden"
      >
        <div className="fixed inset-0 bg-slate-950/40" aria-hidden="true" />
        <div className="fixed inset-0 flex">
          <DialogPanel className="flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <DialogTitle className="font-semibold text-slate-900">
                Navigation
              </DialogTitle>
              <button
                type="button"
                aria-label="Close navigation"
                onClick={closeDrawer}
                className="rounded-md p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <XMarkIcon aria-hidden="true" className="size-5" />
              </button>
            </div>
            {navigation}
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default AdminDrawer;
