import TextCustom from "../../../../components/common/text.custom";
import { useSelector } from "react-redux";

type CartLine = {
  total_promo?: number | string;
  total_price?: number | string;
};
type CustomerCartState = { Cart: { data: CartLine[] } };

const CustomerCartRecipe = () => {
  const lines = useSelector((state: CustomerCartState) => state.Cart.data);
  const promo = lines.reduce(
    (total, line) => total + Number(line.total_promo ?? 0),
    0,
  );
  const total = lines.reduce(
    (amount, line) => amount + Number(line.total_price ?? 0),
    0,
  );

  return (
    <div className="my-2 rounded-lg bg-[#FFFFFF66] p-1">
      {promo > 0 && (
        <>
          <div className="flex w-full px-1">
            <div className="w-2/5 text-left">
              <TextCustom className="text-black" align="left">
                Harga Awal
              </TextCustom>
            </div>
            <div className="w-3/5 text-right">
              <TextCustom
                variant="h6"
                className="text-black line-through"
                align="right"
              >
                {promo + total}
              </TextCustom>
            </div>
          </div>
          <div className="flex w-full px-1">
            <div className="w-[30%] text-left">
              <TextCustom className="text-brand-success" align="left">
                Promo
              </TextCustom>
            </div>
            <div className="w-[70%] text-right">
              <TextCustom className="text-brand-success" align="right">
                {promo}
              </TextCustom>
            </div>
          </div>
        </>
      )}
      <div className="flex w-full px-1">
        <div className="w-[30%] text-left">
          <TextCustom className="text-black" align="left">
            Total
          </TextCustom>
        </div>
        <div className="w-[70%] text-right">
          <TextCustom variant="h4" className="text-black" align="right">
            {total}
          </TextCustom>
        </div>
      </div>
    </div>
  );
};

export default CustomerCartRecipe;
