import { memo, useMemo, useEffect, Suspense, lazy } from "react";
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

// 🎯 Skeleton Loader Component
const AppSkeleton = memo(() => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "#0a0a0f",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
    }}
  >
    <div
      style={{
        width: 48,
        height: 48,
        border: "3px solid rgba(139, 92, 246, 0.2)",
        borderTopColor: "#8b5cf6",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}
    />
    <style>{`
      @keyframes spin { to { transform: rotate(360deg); } }
    `}</style>
  </div>
));
AppSkeleton.displayName = "AppSkeleton";

function App() {
  const isAuth = useSelector((state) => state.adminAuth?.isAuth, shallowEqual);
  const location = useLocation();

  // 🚀 Throttled ScrollTrigger refresh
  useEffect(() => {
    if (typeof window === "undefined") return;

    const throttledRefresh = throttle(() => {
      ScrollTrigger.refresh();
    }, 200);

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

  // 🎯 Memoized user routes to prevent re-renders
  const userRoutesElements = useMemo(
    () =>
      userRoutes.map((route) => (
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
      )),
    [],
  );

  // 🎯 Memoized admin routes
  const adminRoutesElements = useMemo(
    () =>
      adminRoutes.map(({ path, elem }) => (
        <Route key={path} path={path} element={elem} />
      )),
    [],
  );

  return (
    <div className="noise-overlay">
      <ScrollToTop />
      <MetaUpdater />

      <AppInitializer>
        <Suspense fallback={<AppSkeleton />}>
          <Routes location={location}>
            {/* 🌍 User Routes */}
            {userRoutesElements}

            {/* 🔑 Admin Login */}
            <Route path="/admin/login" element={loginElement} />

            {/* 🔒 Admin Protected Routes */}
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
              {adminRoutesElements}
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
