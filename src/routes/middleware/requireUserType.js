import useAuth from "../../hooks/useAuth";

const RequireUserType = ({ userType, children }) => {
  const { auth } = useAuth();

  return (
    <>
      {
        userType === auth.userType ? children : null
      }
    </>
  );
}

export default RequireUserType;