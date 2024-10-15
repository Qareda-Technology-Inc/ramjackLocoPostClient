import ScrollToTop from "@/components/Base/ScrollToTop";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider, useSelector } from "react-redux";  // Import useSelector
import { store } from "./stores/store";
import Router from "./router/route";
import "./assets/css/app.css";
import { LoadingTag } from "@/components/Loading"; // Import GlobalLoader
import { RootState } from '@/stores/store'; // Import RootState to type the useSelector

const App = () => {
  const loading = useSelector((state: RootState) => state.auth.loading); // Get loading state

  return (
    <>
      {loading && <LoadingTag />} 
      <Router />
      <ScrollToTop />
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <Provider store={store}>
      <App /> 
    </Provider>
  </BrowserRouter>
);