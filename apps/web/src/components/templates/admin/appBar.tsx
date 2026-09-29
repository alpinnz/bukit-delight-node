import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type { Dispatch, SetStateAction } from "react";
import { useDispatch, useSelector } from "react-redux";
import Actions from "../../../actions";
import type { RootState } from "../../../reducers";
import type { AppDispatch } from "../../../store";

type AppBarAdminProps = {
  openMobileDrawer: boolean;
  setOpenMobileDrawer: Dispatch<SetStateAction<boolean>>;
};

const accountMenuClass =
  "absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none";
const menuItemClass =
  "block w-full px-4 py-2 text-left text-sm text-slate-700 data-focus:bg-slate-100";

const AppBarAdmin = ({
  openMobileDrawer,
  setOpenMobileDrawer,
}: AppBarAdminProps) => {
  const account = useSelector(
    (state: RootState) => state.Authentication.account,
  );
  const dispatch = useDispatch<AppDispatch>();
  const logout = () => dispatch(Actions.Authentication.onLogout());

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center gap-3 bg-white px-4 shadow-sm sm:px-6">
      <button
        type="button"
        aria-label={openMobileDrawer ? "Close navigation" : "Open navigation"}
        aria-expanded={openMobileDrawer}
        onClick={() => setOpenMobileDrawer((isOpen) => !isOpen)}
        className="rounded-md p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-indigo-600 sm:hidden"
      >
        {openMobileDrawer ? (
          <XMarkIcon aria-hidden="true" className="size-6" />
        ) : (
          <Bars3Icon aria-hidden="true" className="size-6" />
        )}
      </button>
      <h1 className="text-lg font-semibold text-slate-900">Bukit Delight</h1>
      <div className="flex-1" />
      <div className="relative hidden sm:block">
        <Menu>
          <MenuButton
            aria-label="Notifications"
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-indigo-600"
          >
            <BellIcon aria-hidden="true" className="size-5" />
          </MenuButton>
          <MenuItems className={accountMenuClass}>
            <MenuItem>
              <span className={menuItemClass}>Notifications</span>
            </MenuItem>
            <MenuItem>
              <span className={menuItemClass}>1</span>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
      {account && (
        <div className="relative">
          <Menu>
            <MenuButton className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-indigo-600">
              {account.username}
            </MenuButton>
            <MenuItems className={accountMenuClass}>
              <MenuItem>
                <button
                  type="button"
                  onClick={logout}
                  className={menuItemClass}
                >
                  Logout
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      )}
      <div className="relative sm:hidden">
        <Menu>
          <MenuButton
            aria-label="More options"
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-indigo-600"
          >
            <EllipsisVerticalIcon aria-hidden="true" className="size-6" />
          </MenuButton>
          <MenuItems className={accountMenuClass}>
            <MenuItem>
              <span className={menuItemClass}>Notifications</span>
            </MenuItem>
            {account && (
              <MenuItem>
                <button
                  type="button"
                  onClick={logout}
                  className={menuItemClass}
                >
                  Logout
                </button>
              </MenuItem>
            )}
          </MenuItems>
        </Menu>
      </div>
    </header>
  );
};

export default AppBarAdmin;
