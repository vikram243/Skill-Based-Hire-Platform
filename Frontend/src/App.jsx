/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useDispatch, useSelector } from "react-redux";
import { setUser, logoutUser, setLoading } from "./slices/userSlice";
import api from "./lib/axiosSetup";
import FullPageLoader from "./components/ui/full-page-loader";
import { UIProvider } from "./contexts/ui-context";

const App = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  useEffect(() => {
    const verifyAuth = async () => {
      dispatch(setLoading(true));

      const token = localStorage.getItem("accessToken");
      if (!token) {
        dispatch(logoutUser());
        dispatch(setLoading(false));
        return;
      }

      try {
        const res = await api.get("/api/auth/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(setUser(res?.data?.data?.user));
      } catch (err) {
        localStorage.removeItem("accessToken");
        dispatch(logoutUser());
      } finally {
        dispatch(setLoading(false));
      }
    };

    verifyAuth();
  }, [dispatch]);

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <UIProvider>
      <RouterProvider router={router} />
    </UIProvider>
  );
};

export default App;
