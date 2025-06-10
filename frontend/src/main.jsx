import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppContextProvider } from "./context/AppContext.jsx";
import { BrowserRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "./components/educator/Navbar.jsx";
import Footer from "./components/educator/Footer.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppContextProvider>
    <Navbar />
<App />
<Footer />

    </AppContextProvider>
  </BrowserRouter>
);
