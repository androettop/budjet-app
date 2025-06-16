import {
  CopyAll,
  Home as HomeIcon,
  Login as LoginIcon,
  Palette as PaletteIcon,
} from "@mui/icons-material";
import DialogSandboxPage from "../pages/DialogSandboxPage";
import FirebaseSandboxPage from "../pages/FirebaseSandboxPage";
import HomePage from "../pages/HomePage";
import ThemeSandboxPage from "../pages/ThemeSandboxPage";
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
  {
    path: "/dialog",
    Component: DialogSandboxPage,
    title: "Dialog sandbox",
    Icon: CopyAll,
  },
];
