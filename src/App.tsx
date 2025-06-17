import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { grey } from "@mui/material/colors";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Layout from "./components/Layout/Layout";
import { pages } from "./helpers/pages";
import { useAuthChange } from "./hooks/useAuthChange";
import { UserProvider } from "./hooks/useUserData";
import DialogManager from "./components/DialogMaganer/DialogMaganer";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#a4c242",
    },
    secondary: {
      main: "#b33230",
    },
    background: {
      default: "#060606",
      paper: "#121212",
    },
  },

  shape: {
    borderRadius: 8,
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
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          background: grey[800],
          padding: 2,
        },
        lastButton: {
          borderRadius: 8,
        },
        firstButton: {
          borderRadius: 8,
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          border: "none",
          background: "none !important",
          "&.Mui-selected": {
            background: "#1a1a1a !important",
            color: grey[50],
          },
        },
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

const App = () => {
  const { user, isLoading } = useAuthChange();
  return (
    <UserProvider value={{ user, isLoading }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <DialogManager>
          <RouterProvider router={router} />
        </DialogManager>
      </ThemeProvider>
    </UserProvider>
  );
};

export default App;
