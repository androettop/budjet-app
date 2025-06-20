import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./main.css";
import { grey } from "@mui/material/colors";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
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
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DialogManager>
        <App />
      </DialogManager>
    </ThemeProvider>
  </StrictMode>,
);
