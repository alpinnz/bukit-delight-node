import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

type CustomerCategory = { _id: string; name: string; image?: string };
type CustomerBookState = { Categories: { data: CustomerCategory[] } };

const CATEGORY_COLOR_CLASSES = [
  "bg-[#BCB686B8]",
  "bg-[#AA2222A3]",
  "bg-[#C8540059]",
  "bg-[#CAC43566]",
  "bg-[#7CAF4E80]",
  "bg-[#BCB686B8]",
];

const CustomerCategoryList = () => {
  const categories = useSelector(
    (state: CustomerBookState) => state.Categories.data,
  );

  if (categories.length === 0) return null;

  return (
    <div className="mx-1">
      <div className="grid grid-cols-2 sm:grid-cols-3">
        {categories.map((category, index) => (
          <div key={category._id}>
            <div className="mx-1 mb-2">
              <Link
                aria-label={`Pilih kategori ${category.name}`}
                to={`/customer/book/${category._id}`}
              >
                <div
                  role={category.image ? "img" : undefined}
                  aria-label={category.image ? category.name : undefined}
                  className="relative h-[200px] w-full rounded-[9px] bg-[#BCB686B8] bg-cover bg-[position:50%_50%] bg-no-repeat"
                  style={
                    category.image
                      ? { backgroundImage: `url(${category.image})` }
                      : undefined
                  }
                >
                  <div
                    className={`absolute inset-x-0 bottom-0 flex h-10 items-center justify-center rounded-b-[9px] rounded-t-[1px] ${CATEGORY_COLOR_CLASSES[index % CATEGORY_COLOR_CLASSES.length]}`}
                  >
                    <span className="text-center text-white">
                      {category.name}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerCategoryList;
