import { Home as HomeIcon, Palette as PaletteIcon } from "@mui/icons-material";
import HomePage from "../pages/HomePage";
import SandboxPage from "../pages/SandboxPage";
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
    Component: SandboxPage,
    title: "Theme sandbox",
    Icon: PaletteIcon,
  },
];
