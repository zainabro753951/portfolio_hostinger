import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { QueryClientProvider } from "@tanstack/react-query";
import SocketProvider from "./socket/SocketProvider";
import DeleteEntry from "./context/DeleteEntry";
import { HelmetProvider } from "react-helmet-async";
import { queryClient } from "./queryClient.js";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const isDev = import.meta.env.VITE_REACT_ENV === "development";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <SocketProvider>
            <DeleteEntry>
              <HelmetProvider>
                <App />
              </HelmetProvider>
            </DeleteEntry>
          </SocketProvider>
          {isDev && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
);
