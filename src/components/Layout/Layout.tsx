import {
  AppBar,
  Avatar,
  Box,
  Button,
  CircularProgress,
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
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { Outlet } from "react-router";
import { pages } from "../../helpers/pages";
import { useNavigate } from "react-router";
import { useUserData } from "../../hooks/useUserData";
import { logout, login } from "../../helpers/login";
import useDbLock from "../../hooks/useDbLock";
import { useAuthLoading } from "../../hooks/useAuthLoading";

const Layout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isDbLocked, lockDb, unlockDb } = useDbLock();
  const isAuthLoading = useAuthLoading();
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

  const righPartRender = () => {
    if (isAuthLoading) {
      return <CircularProgress />;
    } else if (user) {
      return (
        <Grid container spacing={2} alignItems="center">
          <Grid>
            <Tooltip title={isDbLocked ? "Unlock Database" : "Lock Database"}>
              <Button
                color="inherit"
                onClick={isDbLocked ? unlockDb : lockDb}
                startIcon={!isDbLocked ? <LockOpenIcon /> : <LockIcon />}
              >
                {isDbLocked ? "Unlock DB" : "Lock DB"}
              </Button>
            </Tooltip>
          </Grid>
          <Grid>
            <Tooltip title="Log out">
              <IconButton onClick={() => handleLogout()}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid>
            <Avatar src={user.photoURL || undefined} />
          </Grid>
        </Grid>
      );
    } else {
      return <Button onClick={() => handleLogin()}>Log in</Button>;
    }
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
          {righPartRender()}
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
      <Container sx={{ paddingY: 2 }}>
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;
