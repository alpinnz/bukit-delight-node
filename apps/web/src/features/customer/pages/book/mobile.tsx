import ContainerBase from "../../../../components/common/container.customer.base";
import CustomerCategoryList from "./category-list";

const CustomerBookMobilePage = () => (
  <ContainerBase type="book" title={undefined}>
    <CustomerCategoryList />
  </ContainerBase>
);

export default CustomerBookMobilePage;
