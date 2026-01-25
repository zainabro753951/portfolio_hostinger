import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { checkAuth } from "../Queries/SecureRoute";
import { loginAdmin, logoutAdmin } from "../features/authSlice";
import ThemeReloader from "../components/ThemeReloader";

const AuthLoader = ({ children }) => {
  const dispatch = useDispatch();
  const { data, isError, isSuccess, isLoading, isFetching } = checkAuth();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (isError) {
      dispatch(logoutAdmin());
      setVerified(true); // verification finished, even if failed
    } else if (isSuccess && data?.admin) {
      dispatch(loginAdmin({ isAuth: true, ...data.admin }));
      setVerified(true); // verification finished successfully
    }
  }, [isError, isSuccess, data, dispatch]);

  // ✅ Render children only after verification
  if (!verified) {
    return <ThemeReloader />; // spinner or loader
  }

  return children;
};

export default AuthLoader;
