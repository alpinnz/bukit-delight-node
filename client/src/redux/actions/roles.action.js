export const UPDATE = (roles) => {
  return {
    type: "Roles/UPDATE",
    payload: roles,
  };
};

const RolesAction = {
  UPDATE,
};
export default RolesAction;
