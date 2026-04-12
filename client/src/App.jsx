import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./App.css";
import ScrollToTop from "./components/ScrollToTop";
import { userRoutes } from "./Routes/user.route.jsx";

import MetaUpdater from "./components/MetaUpdater";
import AppInitializer from "./components/AppInitializer";
import Login from "./pages/admin/Login";
import { useSelector } from "react-redux";
import AuthLoader from "./context/AuthLoader";
import ProtectedRoute from "./context/ProtectedRoute";
import AdminDataInitializer from "./components/AdminDataInitializer";
import DHomePage from "./pages/admin/Layout/DHomePage";
import DHomeCards from "./pages/admin/DHome/components/DHomeCards";
import { adminRoutes } from "./Routes/admin.route.jsx";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const { isAuth } = useSelector((state) => state.adminAuth);
  useEffect(() => {
    // Initialize smooth scroll behavior
    const handleScroll = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div className="noise-overlay">
      <ScrollToTop />
      <MetaUpdater />

      <AppInitializer>
        <Routes>
          {/* 🌍 User Routes Here */}
          {userRoutes.map((route, idx) => {
            return (
              <Route key={idx} path={route.path} element={route.element}>
                {route?.children?.map((childRoute) => {
                  return (
                    <>
                      <Route
                        index={childRoute.index}
                        element={childRoute.element}
                      />
                      <Route
                        path={childRoute.path}
                        element={childRoute.element}
                      />
                    </>
                  );
                })}
              </Route>
            );
          })}

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
    </div>
  );
}

export default App;
