import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import formatters from "../../../helpers/formatters";

type OrderedMenu = {
  name: string;
  price: number | string;
  promo?: number | string;
};
type OrderedItem = {
  quality: number;
  menu_id: OrderedMenu;
  promo?: number | string;
  note?: string | null;
  total_price: number | string;
};
export type OrderedCategory = { name: string; items: OrderedItem[] };

const OrderedItemView = ({ item }: { item: OrderedItem }) => {
  const hasPromo = Number(item.promo ?? 0) > 0;

  return (
    <div className="flex w-full items-start pb-4">
      <div className="flex w-[10%] justify-start">
        <span className="text-[#333333]">{item.quality}</span>
      </div>
      <div className="w-[60%]">
        <p className="text-[#333333]">{item.menu_id.name}</p>
        {hasPromo ? (
          <div className="flex items-center">
            <span className="w-20 text-xs text-brand-primary line-through">
              {`@${formatters.formatIndonesianRupiah(
                Number(item.menu_id.price) - Number(item.menu_id.promo ?? 0),
              )}`}
            </span>
            <span className="text-xs text-brand-primary">
              {`@${formatters.formatIndonesianRupiah(item.menu_id.price)}`}
            </span>
          </div>
        ) : (
          <span className="text-xs text-brand-primary">
            {`@${formatters.formatIndonesianRupiah(item.menu_id.price)}`}
          </span>
        )}
        {item.note && item.note !== "null" && (
          <p className="text-sm text-[#9da4ba]">{item.note}</p>
        )}
      </div>
      <div className="flex w-[30%] justify-end">
        <span className="text-right text-[#333333]">
          {formatters.formatIndonesianRupiah(item.total_price)}
        </span>
      </div>
    </div>
  );
};

const OrderCategoryAccordion = ({
  data,
}: {
  data: OrderedCategory[];
}) => {
  return (
    <div className="mb-4 w-full">
      {data.map((category, categoryIndex) => (
        <section
          key={`Accordion-${categoryIndex}`}
          className="border-b border-slate-200"
        >
          <Disclosure>
            <DisclosureButton className="group flex w-full items-center justify-between py-3 text-left text-[15px] font-normal text-slate-900">
              {category.name}
              <ChevronDownIcon
                aria-hidden="true"
                className="size-5 transition-transform group-aria-expanded:rotate-180"
              />
            </DisclosureButton>
            <DisclosurePanel className="block">
              {category.items.map((item, itemIndex) => (
                <OrderedItemView
                  key={`AccordionDetails-${categoryIndex}-${itemIndex}`}
                  item={item}
                />
              ))}
            </DisclosurePanel>
          </Disclosure>
        </section>
      ))}
    </div>
  );
};

export default OrderCategoryAccordion;
