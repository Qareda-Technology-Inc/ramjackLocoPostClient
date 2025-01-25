import ScrollToTop from "@/components/Base/ScrollToTop";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider, useSelector, useDispatch } from "react-redux";
import { store } from "./stores/store";
import Router from "./router/route";
import "./assets/css/app.css";
import { LoadingTag } from "@/components/Loading";
import { RootState } from '@/stores/store';
import { useEffect } from "react";
import { setUser } from "@/stores/authSlice";
import 'toastify-js/src/toastify.css';

const App = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.auth.loading);

  useEffect(() => {
    // Check for both token and user data
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch(setUser(user));
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        // Handle invalid stored data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, [dispatch]);

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