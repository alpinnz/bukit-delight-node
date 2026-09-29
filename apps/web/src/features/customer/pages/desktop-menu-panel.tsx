import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import Actions from "../../../actions";
import Icons from "../../../assets/icons";
import LoadingCustom from "../../../components/common/loading.custom";
import Convert from "../../../helpers/convert";
import TextCustom from "../../../components/common/text.custom";
import type { AppDispatch } from "../../../store";

type DesktopMenu = {
  _id: string;
  name: string;
  image: string;
  price: number;
  promo: number;
  favorite?: boolean | number;
  id_category: { _id: string };
};
type CustomerDesktopMenuState = {
  Menus: { loading: boolean; data: DesktopMenu[] };
  Cart: { selected: { menu: DesktopMenu } };
};

const MENUS_PER_PAGE = 6;

const DesktopMenuList = ({ menus }: { menus: DesktopMenu[] }) => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedMenu = useSelector(
    (state: CustomerDesktopMenuState) => state.Cart.selected.menu,
  );

  return (
    <div className="grid h-[75vh] grid-cols-1 gap-2 overflow-y-auto p-2 sm:grid-cols-2 lg:grid-cols-3">
      {menus.map((menu) => {
        const isSelected = selectedMenu?._id === menu._id;

        return (
          <div key={menu._id}>
            <button
              type="button"
              aria-label={`Pilih ${menu.name}`}
              onClick={() => dispatch(Actions.Cart.selectedAdd(menu))}
              className="w-full text-left focus-visible:outline-2 focus-visible:outline-indigo-600"
            >
              <div
                className={`relative mx-[0.5vw] my-[0.5vh] h-[35.5vh] w-full rounded-[20px] p-2 shadow-[-4px_-4px_6px_rgba(255,255,255,0.04),_4px_4px_7px_rgba(0,0,0,0.05)] ${isSelected ? "bg-brand-primary" : "bg-brand-soft"}`}
              >
                <div
                  role="img"
                  aria-label={menu.name}
                  className="relative h-[22vh] w-full rounded-[15px] bg-[position:50%_50%] bg-cover bg-no-repeat"
                  style={{ backgroundImage: `url(${menu.image})` }}
                >
                  {menu.favorite ? (
                    <div className="absolute -bottom-[17px] right-0 content-center">
                      <img src={Icons.star} alt="Favorit" />
                    </div>
                  ) : null}
                </div>
                <div className="p-1">
                  <TextCustom className="text-black">{menu.name}</TextCustom>
                  <div className="absolute inset-x-0 bottom-0 px-2 pb-2">
                    <div className="flex">
                      {menu.promo > 0 ? (
                        <div className="flex items-center">
                          <TextCustom
                            className="mr-4 text-brand-teal line-through"
                            align="left"
                            variant="h5"
                          >
                            {Convert.Price(menu.price)}
                          </TextCustom>
                          <TextCustom
                            className="text-brand-success"
                            align="left"
                            variant="h5"
                          >
                            {Convert.Price(menu.price - menu.promo)}
                          </TextCustom>
                        </div>
                      ) : (
                        <TextCustom
                          className="w-2/5 text-brand-teal"
                          align="left"
                          variant="h5"
                        >
                          {Convert.Price(menu.price)}
                        </TextCustom>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
};

const CustomerDesktopMenuPanel = () => {
  const { categoryId } = useParams<{ categoryId?: string }>();
  const { pathname } = useLocation();
  const isHomePage = pathname === "/customer/home";
  const menusState = useSelector(
    (state: CustomerDesktopMenuState) => state.Menus,
  );
  const [page, setPage] = useState(1);
  const filteredMenus = menusState.data.filter((menu) =>
    isHomePage
      ? menu.promo > 0 || Boolean(menu.favorite)
      : menu.id_category?._id === categoryId,
  );
  const pageCount = Math.max(
    1,
    Math.ceil(filteredMenus.length / MENUS_PER_PAGE),
  );
  const pages = Array.from({ length: pageCount }, (_, pageIndex) =>
    filteredMenus.slice(
      pageIndex * MENUS_PER_PAGE,
      (pageIndex + 1) * MENUS_PER_PAGE,
    ),
  );

  useEffect(() => {
    setPage(1);
  }, [categoryId, isHomePage]);

  if (menusState.loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <LoadingCustom />
      </div>
    );
  }

  return (
    <div className="relative h-[80vh]">
      <DesktopMenuList menus={pages[page - 1] ?? []} />
      <div className="flex h-[5vh] w-full items-center justify-center">
        <nav aria-label="Menu pages" className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="rounded p-2 text-slate-700 hover:bg-black/5 disabled:opacity-40"
          >
            <ChevronLeftIcon aria-hidden="true" className="size-5" />
          </button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                aria-current={pageNumber === page ? "page" : undefined}
                aria-label={`Page ${pageNumber}`}
                onClick={() => setPage(pageNumber)}
                className={`size-9 rounded text-sm ${pageNumber === page ? "bg-indigo-700 text-white" : "text-slate-700 hover:bg-black/5"}`}
              >
                {pageNumber}
              </button>
            ),
          )}
          <button
            type="button"
            aria-label="Next page"
            disabled={page >= pageCount}
            onClick={() =>
              setPage((current) => Math.min(pageCount, current + 1))
            }
            className="rounded p-2 text-slate-700 hover:bg-black/5 disabled:opacity-40"
          >
            <ChevronRightIcon aria-hidden="true" className="size-5" />
          </button>
        </nav>
      </div>
    </div>
  );
};

const CustomerDesktopMenuContent = () => (
  <div className="relative h-[80vh] bg-brand-accent">
    <CustomerDesktopMenuPanel />
  </div>
);

export default CustomerDesktopMenuContent;
