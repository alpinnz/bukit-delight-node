import formatters from "../../../../helpers/formatters";
import icons from "../../../../assets/icons";
import { useDispatch } from "react-redux";
import Actions from "../../../../actions";
import type { AppDispatch } from "../../../../store";

type MenuCard = {
  id?: string;
  name: string;
  title?: string;
  image: string;
  price: number;
  promo: number;
  [key: string]: unknown;
};

type HorizontalMenuListProps = {
  data?: MenuCard[];
  title: string;
};

const HorizontalMenuList = ({ data = [], title }: HorizontalMenuListProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const onPress = (menu: MenuCard) => {
    dispatch(Actions.Cart.selectedAdd(menu));
    dispatch(Actions.Cart.dialogMenuOpen());
  };

  return (
    <section className="mx-2">
      <div className="flex items-center">
        <img
          className="mr-1 size-4"
          src={icons.recommended}
          alt="recommended"
        />
        <h2 className="font-medium">{title}</h2>
      </div>
      <div className="flex items-center gap-3 overflow-x-auto py-1">
        {data.map((e) => (
          <button
            type="button"
            key={`${title}-${e.name}`}
            className="block w-[171px] shrink-0 rounded-lg text-left focus-visible:outline-2 focus-visible:outline-indigo-600"
            onClick={() => onPress(e)}
          >
            <img
              className="h-28 w-full rounded-lg object-cover"
              src={e.image}
              alt={e.title || e.name}
            />
            <span className="block truncate pt-2 font-medium text-slate-900">
              {e.name}
            </span>
            {e.promo > 0 ? (
              <span className="flex gap-2 text-sm text-brand-teal">
                <del>{formatters.formatCompactPrice(e.price) || 0}</del>
                <span>{formatters.formatCompactPrice(e.price - e.promo) || 0}</span>
              </span>
            ) : (
              <span className="block text-sm text-brand-teal">
                {formatters.formatCompactPrice(e.price) || 0}
              </span>
            )}
          </button>
        ))}
      </div>
    </section>
  );
};

export default HorizontalMenuList;
