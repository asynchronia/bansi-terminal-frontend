import useAuth from "../../hooks/useAuth";

const RequirePermission = ({ module, permission, children }) => {
  const { auth } = useAuth();

  return (
    <>
      {
        permission
          ? auth?.permissions && auth.permissions.find(permission => permission.module === module)?.operations.includes(permission)
            ? children
            : null
          : auth?.permissions && auth.permissions.find(permission => permission.module === module)?.operations.length
            ? children
            : null
      }

    </>
  );
}

export default RequirePermission;