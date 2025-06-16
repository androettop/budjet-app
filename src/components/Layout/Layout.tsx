import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { Logout as LogoutIcon, Menu as MenuIcon } from "@mui/icons-material";
import { useState } from "react";
import { Outlet } from "react-router";
import { pages } from "../../helpers/pages";
import { useNavigate } from "react-router";
import { useUserData } from "../../hooks/useUserData";
import { logout, login } from "../../helpers/login";

const Layout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const user = useUserData();

  const handleNavigation = (path?: string) => {
    navigate(path || "/");
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  const handleLogin = () => {
    login();
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            BudJet
          </Typography>
          {user ? (
            <Grid container spacing={2} alignItems="center">
              <Grid>
                <Avatar src={user.photoURL || undefined} />
              </Grid>

              <Grid>
                <IconButton color="inherit" onClick={() => handleLogout()}>
                  <LogoutIcon />
                </IconButton>
              </Grid>
            </Grid>
          ) : (
            <Button color="inherit" onClick={() => handleLogin()}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {/* Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {pages.map(({ path, Icon, title }) => (
              <ListItem key={path || "home"} disablePadding>
                <ListItemButton onClick={() => handleNavigation(path)}>
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={title} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Container>
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;
