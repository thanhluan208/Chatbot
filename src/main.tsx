import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import LanguageProvider from "./Providers/LangProvider.tsx";
import { QueryClient, QueryClientProvider } from "react-query";
import AuthenticationProvider from "./Providers/AuthenticationProvider.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthenticationProvider>
      <LanguageProvider>
        <App />
        <ToastContainer />
      </LanguageProvider>
    </AuthenticationProvider>
  </QueryClientProvider>
);
