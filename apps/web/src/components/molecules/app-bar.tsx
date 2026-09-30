import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

type AppBarProps = {
  height?: 60 | 61;
  routeName?: string;
  title?: string;
};

const AppBar = ({ height = 61, routeName, title }: AppBarProps) => (
  <div className="fixed inset-x-0 top-0 z-30 bg-surface-customer text-center">
    <div
      className={`grid grid-cols-[1fr_4fr_1fr] items-center justify-items-center ${height === 60 ? "h-[60px]" : "h-[61px]"}`}
    >
      <Link
        to={routeName || "/"}
        aria-label="Back"
        className="rounded p-2 text-black"
      >
        <ArrowLeftIcon aria-hidden="true" className="size-5" />
      </Link>
      <h1 className="text-base font-medium text-black">{`${title}`}</h1>
      <span />
    </div>
  </div>
);

export default AppBar;
