import { memo, useMemo, useEffect, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./App.css";

import ScrollToTop from "./components/ScrollToTop";
import MetaUpdater from "./components/MetaUpdater";
import AppInitializer from "./components/AppInitializer";
import Login from "./pages/admin/Login";
import AuthLoader from "./context/AuthLoader";
import ProtectedRoute from "./context/ProtectedRoute";
import AdminDataInitializer from "./components/AdminDataInitializer";
import DHomePage from "./pages/admin/Layout/DHomePage";
import DHomeCards from "./pages/admin/DHome/components/DHomeCards";
import { userRoutes } from "./Routes/user.route.jsx";
import { adminRoutes } from "./Routes/admin.route.jsx";

gsap.registerPlugin(ScrollTrigger);

// ⚡ Throttle utility
const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

function App() {
  // 🎯 Ultra-selective auth check
  const isAuth = useSelector((state) => state.adminAuth?.isAuth, shallowEqual);
  const location = useLocation();

  // 🚀 Throttled ScrollTrigger refresh
  useEffect(() => {
    if (typeof window === "undefined") return;

    const throttledRefresh = throttle(() => {
      ScrollTrigger.refresh();
    }, 150);

    window.addEventListener("resize", throttledRefresh, { passive: true });

    return () => {
      window.removeEventListener("resize", throttledRefresh);
      ScrollTrigger.getAll()
        .filter((st) => st.vars?.id?.startsWith("app-"))
        .forEach((st) => st.kill());
    };
  }, []);

  // 🎯 Memoized login element
  const loginElement = useMemo(
    () => (isAuth ? <Navigate to="/admin" replace /> : <Login />),
    [isAuth],
  );

  return (
    <div className="noise-overlay">
      <ScrollToTop />
      <MetaUpdater />

      <AppInitializer>
        <Suspense fallback={{}}>
          <Routes location={location}>
            {/* 🌍 User Routes - Spread directly, not as array */}
            {userRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element}>
                {route?.children?.map((childRoute) => (
                  <Route
                    key={`${route.path}-${childRoute.path || "index"}`}
                    index={childRoute.index}
                    path={childRoute.path}
                    element={childRoute.element}
                  />
                ))}
              </Route>
            ))}

            {/* 🔑 Admin Login - Bina kisi data fetch ke */}
            <Route path="/admin/login" element={loginElement} />

            {/* 🔒 Admin Protected */}
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
              <Route index element={<DHomeCards />} />
              {adminRoutes.map(({ path, elem }) => (
                <Route key={path} path={path} element={elem} />
              ))}
            </Route>

            {/* 🔄 Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AppInitializer>
    </div>
  );
}

export default memo(App, () => true);
