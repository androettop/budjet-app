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

const Layout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isDbLocked, lockDb, unlockDb } = useDbLock();
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
                <Tooltip
                  title={isDbLocked ? "Unlock Database" : "Lock Database"}
                >
                  <IconButton onClick={isDbLocked ? unlockDb : lockDb}>
                    {!isDbLocked ? <LockOpenIcon /> : <LockIcon />}
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid>
                <Tooltip title="Log out">
                  <IconButton onClick={() => handleLogout()}>
                    <LogoutIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          ) : (
            <Button onClick={() => handleLogin()}>Log in</Button>
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
