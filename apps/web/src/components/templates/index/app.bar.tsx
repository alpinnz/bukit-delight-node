import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Actions from "../../../actions";
import Convert from "../../../helpers/convert";
import type { RootState } from "../../../reducers";
import type { AppDispatch } from "../../../store";

type AppBarIndexProps = { title: string };

const AppBarIndex = ({ title }: AppBarIndexProps) => {
  const account = useSelector(
    (state: RootState) => state.Authentication.account,
  );
  const dispatch = useDispatch<AppDispatch>();

  return (
    <header className="flex min-h-16 items-center gap-4 bg-indigo-700 px-4 text-white sm:px-6">
      <h1 className="flex-1 text-lg font-semibold">{title}</h1>
      <Link
        to="/customer"
        className="rounded-md px-3 py-2 text-sm font-medium hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
      >
        Customer
      </Link>
      {account ? (
        <div className="relative">
          <Menu>
            <MenuButton className="rounded-md px-3 py-2 text-sm font-medium hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white">
              {account.username}
            </MenuButton>
            <MenuItems className="absolute right-0 z-50 mt-2 w-48 rounded-md bg-white py-1 text-slate-700 shadow-lg ring-1 ring-black/5 focus:outline-none">
              <MenuItem>
                <Link
                  to={`/${account.role}`}
                  className="block px-4 py-2 text-sm data-focus:bg-slate-100"
                >
                  {Convert.Capitals(account.role)}
                </Link>
              </MenuItem>
              <MenuItem>
                <button
                  type="button"
                  onClick={() => dispatch(Actions.Authentication.onLogout())}
                  className="block w-full px-4 py-2 text-left text-sm data-focus:bg-slate-100"
                >
                  Logout
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      ) : (
        <Link
          to="/login"
          className="rounded-md px-3 py-2 text-sm font-medium hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
        >
          Login
        </Link>
      )}
    </header>
  );
};

export default AppBarIndex;
