import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { UserProvider } from "./hooks/useUserData";
import { RouterProvider } from "react-router/dom";
import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout/Layout";
import { pages } from "./helpers/pages";
import { useAuthChange } from "./hooks/useAuthChange";

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

const App = () => {
  const user = useAuthChange();
  return (
    <UserProvider value={user}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </UserProvider>
  );
};

export default App;
