import { useSelector } from "react-redux";
import TableCustom from "../../../../components/common/table.custom";
import CategoryForm from "./form";

type Category = { _id: string; name: string; desc: string; image?: string };
type CategoriesState = { data?: Category[]; loading: boolean };

const CategoryTable = () => {
  const categories = useSelector(
    (state: { Categories: CategoriesState }) => state.Categories,
  );

  if (!categories.data) return null;

  const columns = [
    { id: "name", numeric: false, disablePadding: true, label: "Name" },
    { id: "desc", numeric: false, disablePadding: false, label: "Description" },
    {
      id: "image",
      numeric: false,
      disablePadding: false,
      label: "Image",
      cell: (category: Category) => (
        <img
          height="56px"
          width="76px"
          alt={category.name}
          src={category.image}
        />
      ),
    },
  ];

  return (
    <div>
      <TableCustom
        title="Categories"
        columns={columns}
        rows={categories.data}
        loading={categories.loading}
        add
        update
        remove
        no
      />
      <CategoryForm />
    </div>
  );
};

export default CategoryTable;
