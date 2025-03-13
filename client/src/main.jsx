import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import StripeProvider from "./config/StripeProvider.jsx";
import { HelmetProvider } from "react-helmet-async";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StripeProvider>
    <QueryClientProvider client={queryClient}>
      <StrictMode>
        <BrowserRouter>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </BrowserRouter>
      </StrictMode>
    </QueryClientProvider>
  </StripeProvider>
);
