import {
  selectTheme,
  getTheme,
} from "@/stores/themeSlice";
import { useAppSelector } from "@/stores/hooks";
import { useLocation } from "react-router-dom";

function Main() {
  const theme = useAppSelector(selectTheme);
  const Component = getTheme(theme).component;

  const { search } = useLocation();

  return (
    <div>
      <Component />
    </div>
  );
}

export default Main;
