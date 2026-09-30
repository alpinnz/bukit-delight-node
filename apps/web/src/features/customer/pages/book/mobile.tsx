import CustomerLayout from "../../../../components/templates/customer/layout";
import CustomerCategoryList from "./category-list";

const CustomerBookMobilePage = () => (
  <CustomerLayout type="book" title={undefined}>
    <CustomerCategoryList />
  </CustomerLayout>
);

export default CustomerBookMobilePage;
