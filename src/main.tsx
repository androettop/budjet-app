import { createBrowserRouter, RouterProvider } from "react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Layout from "./components/Layout/Layout";
import { pages } from "./helpers/pages";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#a4c242",
    },
    secondary: {
      main: "#b33230",
    },
  },
  shape: {
    borderRadius: 24,
  },
  typography: {
    fontFamily: '"Manrope", sans-serif',
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
});
const router = createBrowserRouter([
  {
    Component: Layout,
    children: pages.map((page) => ({
      index: page.index,
      path: page.path,
      Component: page.Component,
    })),
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
