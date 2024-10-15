import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import EnigmaSideMenu from "@/themes/Enigma/SideMenu";

export const themes = [
  {
    name: "enigma",
    layout: "side-menu",
    component: EnigmaSideMenu,
  },
] as const;

export type Themes = (typeof themes)[number];

interface ThemeState {
  value: {
    name: Themes["name"];
    layout: Themes["layout"];
  };
}

export const getTheme = (search?: {
  name: Themes["name"];
  layout: Themes["layout"];
}) => {
  const searchValues =
    search === undefined
      ? {
          name: localStorage.getItem("theme"),
          layout: localStorage.getItem("layout"),
        }
      : search;

  const result = themes.filter((item) => {
    return (
      item.name === searchValues.name && item.layout === searchValues.layout
    );
  })[0];

  return result || themes[0]; // Provide a fallback value if no match is found
};

const initialState: ThemeState = {
  value: {
    name:
      localStorage.getItem("theme") === null
        ? themes[0].name
        : getTheme()?.name || themes[0].name, // Use fallback if undefined
    layout:
      localStorage.getItem("layout") === null
        ? themes[0].layout
        : getTheme()?.layout || themes[0].layout, // Use fallback if undefined
  },
};


export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Themes["name"]>) => {
      state.value = {
        name: action.payload,
        layout: state.value.layout,
      };

      localStorage.setItem("theme", action.payload);
    },
    setLayout: (state, action: PayloadAction<Themes["layout"]>) => {
      state.value = {
        name: state.value.name,
        layout: action.payload,
      };

      localStorage.setItem("layout", action.payload);
    },
  },
});

export const { setTheme, setLayout } = themeSlice.actions;

export const selectTheme = (state: RootState) => {
  if (localStorage.getItem("theme") === null) {
    localStorage.setItem("theme", "enigma");
  }

  if (localStorage.getItem("layout") === null) {
    localStorage.setItem("layout", "side-menu");
  }

  return state.theme.value;
};

export default themeSlice.reducer;
