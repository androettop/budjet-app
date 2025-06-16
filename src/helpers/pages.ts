import {
  Home as HomeIcon,
  Login as LoginIcon,
  Palette as PaletteIcon,
} from "@mui/icons-material";
import HomePage from "../pages/HomePage";
import ThemeSandboxPage from "../pages/ThemeSandboxPage";
import FirebaseSandboxPage from "../pages/FirebaseSandboxPage";
import type { Page } from "../types/pages";

export const pages: Page[] = [
  {
    index: true,
    Component: HomePage,
    title: "Home",
    Icon: HomeIcon,
  },
  {
    path: "/theme",
    Component: ThemeSandboxPage,
    title: "Theme sandbox",
    Icon: PaletteIcon,
  },
  {
    path: "/firebase",
    Component: FirebaseSandboxPage,
    title: "Firebase sandbox",
    Icon: LoginIcon,
  },
];
