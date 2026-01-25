import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import ScrollToTop from "./components/ScrollToTop";
import allRoutes from "./Routes/routes";
import { adminRoutes } from "./Routes/admin.route";

import DHomePage from "./pages/admin/Layout/DHomePage";
import ProtectedRoute from "./context/ProtectedRoute";
import Login from "./pages/admin/Login";
import AppInitializer from "./components/AppInitializer";
import MetaUpdater from "./components/MetaUpdater";
import AuthLoader from "./context/AuthLoader";
import AdminDataInitializer from "./components/AdminDataInitializer";
import DHomeCards from "./pages/admin/DHome/components/DHomeCards";

const App = () => {
  const { isAuth } = useSelector((state) => state.adminAuth);

  return (
    <>
      <ScrollToTop />
      <MetaUpdater />

      <AppInitializer>
        <Routes>
          {/* 🌍 PUBLIC WEBSITE */}
          <Route
            path="/*"
            element={
              <Routes>
                {allRoutes.map(({ path, element }, idx) => (
                  <Route key={idx} path={path} element={element} />
                ))}
              </Routes>
            }
          />

          {/* 🔑 ADMIN LOGIN (public) */}
          <Route
            path="/admin/login"
            element={isAuth ? <Navigate to="/admin" /> : <Login />}
          />

          {/* 🔒 ADMIN PROTECTED AREA */}
          <Route
            path="/admin"
            element={
              <AuthLoader>
                <ProtectedRoute>
                  <AdminDataInitializer>
                    <DHomePage />
                  </AdminDataInitializer>
                </ProtectedRoute>
              </AuthLoader>
            }
          >
            <Route index element={<DHomeCards />} /> {/* default child */}
            {adminRoutes.map(({ path, elem }, idx) => (
              <Route key={idx} path={path} element={elem} />
            ))}
          </Route>
        </Routes>
      </AppInitializer>
    </>
  );
};

export default App;
