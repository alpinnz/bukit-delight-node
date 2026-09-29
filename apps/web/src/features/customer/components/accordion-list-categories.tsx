import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Convert from "../../../helpers/convert";

type OrderedMenu = {
  name: string;
  price: number | string;
  promo?: number | string;
};
type OrderedItem = {
  quality: number;
  id_menu: OrderedMenu;
  promo?: number | string;
  note?: string | null;
  total_price: number | string;
};
export type OrderedCategory = { name: string; itemOrders: OrderedItem[] };

const OrderedItemView = ({ item }: { item: OrderedItem }) => {
  const hasPromo = Number(item.promo ?? 0) > 0;

  return (
    <div className="flex w-full items-start pb-4">
      <div className="flex w-[10%] justify-start">
        <span className="text-[#333333]">{item.quality}</span>
      </div>
      <div className="w-[60%]">
        <p className="text-[#333333]">{item.id_menu.name}</p>
        {hasPromo ? (
          <div className="flex items-center">
            <span className="w-20 text-xs text-brand-primary line-through">
              {`@${Convert.RpIndonesia(
                Number(item.id_menu.price) - Number(item.id_menu.promo ?? 0),
              )}`}
            </span>
            <span className="text-xs text-brand-primary">
              {`@${Convert.RpIndonesia(item.id_menu.price)}`}
            </span>
          </div>
        ) : (
          <span className="text-xs text-brand-primary">
            {`@${Convert.RpIndonesia(item.id_menu.price)}`}
          </span>
        )}
        {item.note && item.note !== "null" && (
          <p className="text-sm text-[#9da4ba]">{item.note}</p>
        )}
      </div>
      <div className="flex w-[30%] justify-end">
        <span className="text-right text-[#333333]">
          {Convert.RpIndonesia(item.total_price)}
        </span>
      </div>
    </div>
  );
};

const CustomerAccordionListCategories = ({
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
              {category.itemOrders.map((item, itemIndex) => (
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

export default CustomerAccordionListCategories;
