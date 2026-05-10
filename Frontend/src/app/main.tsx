import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "@/index.css";
import { Provider } from "react-redux";
import { store } from "@/store";
import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <Toaster position="top-right" />
    </BrowserRouter>
  </Provider>
);
