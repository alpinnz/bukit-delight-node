import Text from "../../../../components/atoms/text";
import { useSelector } from "react-redux";

type CartLine = {
  total_promo?: number | string;
  total_price?: number | string;
};
type CustomerCartState = { Cart: { data: CartLine[] } };

const CustomerCartSummary = () => {
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
              <Text className="text-black" align="left">
                Harga Awal
              </Text>
            </div>
            <div className="w-3/5 text-right">
              <Text
                variant="h6"
                className="text-black line-through"
                align="right"
              >
                {promo + total}
              </Text>
            </div>
          </div>
          <div className="flex w-full px-1">
            <div className="w-[30%] text-left">
              <Text className="text-brand-success" align="left">
                Promo
              </Text>
            </div>
            <div className="w-[70%] text-right">
              <Text className="text-brand-success" align="right">
                {promo}
              </Text>
            </div>
          </div>
        </>
      )}
      <div className="flex w-full px-1">
        <div className="w-[30%] text-left">
          <Text className="text-black" align="left">
            Total
          </Text>
        </div>
        <div className="w-[70%] text-right">
          <Text variant="h4" className="text-black" align="right">
            {total}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default CustomerCartSummary;
