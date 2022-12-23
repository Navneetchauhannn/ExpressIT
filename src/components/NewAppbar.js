import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
// import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import Drawer from '@mui/material/Drawer';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import './appbar.css';

//firebase
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../FirebaseConfig.js";

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const drawerWidth = 240;

export default function PrimarySearchAppBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };


  const container = window !== undefined ? () => window().document.body : undefined;


  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [WhetherUserExist, SetWhetherUserExist] = useState(false);
  const [userName, setUserName] = useState("");
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const status = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        SetWhetherUserExist(true);
        let username = user.displayName.split(" ");
        setUserName(username[0]);
        setRole(localStorage.getItem("1111"));
      }
      else {
        // navigate("/signIn");
        SetWhetherUserExist(false);
      }
    })
  }
  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('1111');
    setRole("");
    navigate('/');
  }
  const login = () => {
    navigate("/signin");
  }

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  let navItems;
  if (role === '111') {
    navItems = ['Home', 'Contact', 'Archives', 'AddActivity', 'AdminPanel'];
  } else {
    navItems = ['Home', 'Contact', 'Archives', 'AddActivity'];
  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        ExpressIT
      </Typography>
      <Divider />
      <List >
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton onClick={() => { navigate(`/${item}`) }} sx={{ textAlign: 'center' }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );



  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={() => { handleMenuClose() }}
    >
      <MenuItem onClick={() => { handleMenuClose(); navigate('/myprofile') }}>Profile</MenuItem>
      <MenuItem onClick={() => { logout(); handleMenuClose() }} >Log Out</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={() => { handleMobileMenuClose() }}
    >
    </Menu>
  );

  useEffect(() => {
    status();
  }, [WhetherUserExist, role]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" color='inherit' >
        <Toolbar >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
            <Typography variant="h6" sx={{ ml: 1 }}>
              Express IT
            </Typography>
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Express IT
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <NavLink className='mynavitem' id={location.pathname === "/" ? "activenav" : ""} to='/'>Home</NavLink>&nbsp;&nbsp;&nbsp;
            <NavLink className='mynavitem' id={location.pathname === "/contact" ? "activenav" : ""} to="/contact">Contact Us</NavLink> &nbsp;&nbsp;&nbsp;
            <NavLink className='mynavitem' id={location.pathname === "/archives" ? "activenav" : ""} to="/archives">Archives</NavLink> &nbsp;&nbsp;&nbsp;
            {
              role === "111" || role === "101" ?
                <><NavLink className='mynavitem' id={location.pathname === "/adminpanel" ? "activenav" : ""} to="/adminpanel">Admin Panel</NavLink> &nbsp;&nbsp;&nbsp;</> : <></>
            }
            {
              WhetherUserExist ? <><NavLink className='mynavitem' id={location.pathname === "/addactivity" ? "activenav" : ""} to="/addactivity">Add Activity</NavLink> &nbsp;&nbsp;&nbsp;</> : <></>
            }
          </Box>
          <div id='profile' >
            {
              WhetherUserExist ?
                <>
                  <>
                    <Button variant='contained' id='mynavlink' onClick={handleProfileMenuOpen} style={{ backgroundColor: 'purple' }}><AccountCircle style={{ marginRight: "2px" }} /><span id="username">{userName}</span></Button></>
                  <IconButton  onClick={handleProfileMenuOpen} id="mobile"><AccountCircle /></IconButton>
                </>
                :
                <Button id='mynavlink2' onClick={login} style={{ backgroundColor: 'purple' }} variant='contained' >LogIn</Button>
            }
          </div>
        </Toolbar>
      </AppBar>
      {
        location.pathname !== '/adminpanel' ? <Toolbar /> : <></>
      }
      {/*  */}
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
PrimarySearchAppBar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};