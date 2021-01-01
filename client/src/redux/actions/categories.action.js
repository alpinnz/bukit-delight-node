const UPDATE = (categories) => {
  return {
    type: "Categories/UPDATE",
    payload: categories,
  };
};

const CategoriesAction = {
  UPDATE,
};
export default CategoriesAction;
