import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import AppThemeProvider from "./Providers/AppTheme.provider.tsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import AuthenticationProvider from "./Providers/AuthenticationProvider.tsx";
import LanguageProvider from "./Providers/LangProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <AuthenticationProvider>
      <AppThemeProvider>
        <App />
        <ToastContainer />
      </AppThemeProvider>
    </AuthenticationProvider>
  </LanguageProvider>
);
