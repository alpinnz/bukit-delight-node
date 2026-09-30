/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch } from "react-redux";
import Actions from "../../../actions";
import icons from "../../../assets/icons";
import formatters from "../../../helpers/formatters";

type MenuCard = {
  id?: string;
  name: string;
  image: string;
  price: number;
  promo: number;
  favorite?: number;
};

type MenuListProps = {
  data?: MenuCard[];
};

const MenuList = ({ data = [] }: MenuListProps) => {
  const dispatch = useDispatch();
  const onPress = (menu: MenuCard) => {
    dispatch(Actions.Cart.selectedAdd(menu));
    dispatch(Actions.Cart.dialogMenuOpen());
  };

  return (
    <div className="m-1">
      <div className="grid grid-cols-2 sm:grid-cols-3">
        {data.map((menu) => {
          return (
            <div key={menu.id ?? menu.name}>
              <button
                type="button"
                aria-label={`Pilih ${menu.name}`}
                onClick={() => onPress(menu)}
                className="block w-full text-left focus-visible:outline-2 focus-visible:outline-indigo-600"
              >
                <div className="relative m-1 h-[259px] rounded-[9px] bg-[#FFFFFF9E] p-2">
                  <div
                    role="img"
                    aria-label={menu.name}
                    className="relative h-[166px] w-full rounded-lg bg-center bg-cover bg-no-repeat"
                    style={{ backgroundImage: `url(${menu.image})` }}
                  >
                    {menu.favorite && menu.favorite > 0 ? (
                      <div className="absolute -bottom-[17px] right-0 content-center">
                        <img src={icons.star} alt="" />
                      </div>
                    ) : (
                      <div />
                    )}
                  </div>

                  <div className="p-1">
                    <p className="truncate text-black">{menu.name}</p>
                    <div className="absolute inset-x-0 bottom-0 px-2 pb-1">
                      <div className="flex">
                        {menu.promo > 0 ? (
                          <div className="flex">
                            <p className="mr-2 text-lg font-semibold text-brand-teal line-through">
                              {formatters.formatCompactPrice(menu.price)}
                            </p>
                            <p className="text-lg font-semibold text-brand-success">
                              {formatters.formatCompactPrice(menu.price - menu.promo)}
                            </p>
                          </div>
                        ) : (
                          <div className="w-2/5">
                            <p className="text-lg font-semibold text-brand-teal">
                              {formatters.formatCompactPrice(menu.price)}
                            </p>
                          </div>
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
    </div>
  );
};

export default MenuList;
