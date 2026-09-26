import ContainerBase from "../../../../components/common/container.customer.base";
import CustomerCategoryList from "./category-list";

const CustomerBookMobilePage = () => (
  <ContainerBase type="book" navigationActive={1} title={undefined}>
    <CustomerCategoryList />
  </ContainerBase>
);

export default CustomerBookMobilePage;
