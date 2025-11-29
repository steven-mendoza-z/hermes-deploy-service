import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import { useAppState } from "./context/AppStateContext";
import { routes } from "./routes";

import MainLayout from "./widgets/layouts/MainLayout";
import MobileLayout from "./widgets/layouts/MobileLayout";
import AuthLayout from "./widgets/layouts/AuthLayout";

import Signup from "./widgets/pages/Signup";
import Login from "./widgets/pages/Login";
// import BottombarLayout from "./widgets/layouts/BottombarLayout"; // si no lo usas, puedes borrar

const Servers = lazy(() => import("./widgets/pages/logged/Servers"));
const Images = lazy(() => import("./widgets/pages/logged/Images"));
const Repos = lazy(() => import("./widgets/pages/logged/Repos"));
const Apps = lazy(() => import("./widgets/pages/logged/Apps"));
const Settings = lazy(() => import("./widgets/pages/logged/Settings"));

function getAllPaths(key) {
  return Object.values(routes).map((langRoutes) => langRoutes[key]);
}

// (Opcional) si no usas RouteGroup en ningún sitio, puedes borrarlo
export function RouteGroup({ paths, element, fallback = <div></div> }) {
  const location = useLocation();
  const { setForm } = useAppState();

  useEffect(() => {
    setForm(""); // ← si sigues usando RouteGroup, también lo resetea aquí
  }, [location, setForm]);

  return (
    <>
      {paths.map((path) => (
        <Route
          key={path}
          path={path}
          element={<Suspense fallback={fallback}>{element}</Suspense>}
        />
      ))}
    </>
  );
}

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();
  const { setForm } = useAppState();

  // 🔹 Cada vez que cambia la ruta, reseteamos el form a ""
  useEffect(() => {
    setForm("");        // 👈 aquí está lo que pediste
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const Layout = isMobile ? MobileLayout : MainLayout;

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route
          path={"/signup"}
          element={
            <Suspense fallback={<div></div>}>
              <Signup />
            </Suspense>
          }
        />
        <Route
          path={"/login"}
          element={
            <Suspense fallback={<div></div>}>
              <Login />
            </Suspense>
          }
        />
      </Route>

      <Route element={<Layout />}>
        {getAllPaths("servers").map((path) => (
          <Route
            key={path}
            path={path}
            element={
              <Suspense fallback={<div></div>}>
                <Servers />
              </Suspense>
            }
          />
        ))}

        {getAllPaths("images").map((path) => (
          <Route
            key={path}
            path={path}
            element={
              <Suspense fallback={<div></div>}>
                <Images />
              </Suspense>
            }
          />
        ))}

        {getAllPaths("repositories").map((path) => (
          <Route
            key={path}
            path={path}
            element={
              <Suspense fallback={<div></div>}>
                <Repos />
              </Suspense>
            }
          />
        ))}

        {getAllPaths("apps").map((path) => (
          <Route
            key={path}
            path={path}
            element={
              <Suspense fallback={<div></div>}>
                <Apps />
              </Suspense>
            }
          />
        ))}

        {getAllPaths("settings").map((path) => (
          <Route
            key={path}
            path={path}
            element={
              <Suspense fallback={<div></div>}>
                <Settings />
              </Suspense>
            }
          />
        ))}

        <Route
          path="*"
          element={<Navigate to={getAllPaths("servers")[0]} replace />}
        />
      </Route>
    </Routes>
  );
}

export default App;
