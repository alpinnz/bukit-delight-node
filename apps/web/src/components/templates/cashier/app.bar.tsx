import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import Actions from "../../../actions";
import type { RootState } from "../../../reducers";
import type { AppDispatch } from "../../../store";

type AppBarKasirProps = { title: string };

const AppBarKasir = ({ title }: AppBarKasirProps) => {
  const account = useSelector(
    (state: RootState) => state.Authentication.account,
  );
  const dispatch = useDispatch<AppDispatch>();
  const logout = () => dispatch(Actions.Authentication.onLogout());
  const menuItems =
    "absolute right-0 z-50 mt-2 w-48 rounded-md bg-white py-1 text-slate-700 shadow-lg ring-1 ring-black/5 focus:outline-none";

  return (
    <header className="flex min-h-14 items-center gap-3 bg-brand-primary px-4 text-white">
      <h1 className="flex-1 text-lg font-semibold">{title}</h1>
      <div className="relative">
        <Menu>
          <MenuButton
            aria-label="Notifications"
            className="rounded-md p-2 hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-white"
          >
            <BellIcon aria-hidden="true" className="size-5" />
          </MenuButton>
          <MenuItems className={menuItems}>
            <MenuItem>
              <span className="block px-4 py-2 text-sm data-focus:bg-slate-100">
                Notifications
              </span>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
      {account && (
        <div className="relative">
          <Menu>
            <MenuButton className="rounded-md px-3 py-2 text-sm font-medium hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-white">
              {account.username}
            </MenuButton>
            <MenuItems className={menuItems}>
              <MenuItem>
                <button
                  type="button"
                  onClick={logout}
                  className="block w-full px-4 py-2 text-left text-sm data-focus:bg-slate-100"
                >
                  Logout
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      )}
    </header>
  );
};

export default AppBarKasir;
