import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import MessageIcon from '@mui/icons-material/Message';
import ArchiveIcon from '@mui/icons-material/Archive';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { NavLink, useNavigate } from "react-router-dom";
import '../appbar.css';
//list item
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
// list item ends
import Table from './DashboardMainTable';
import Users from './Users';
import Highlights from './Highlights';
import Archieves from './Archieves';
import Messages from './Messages';
import Form from '../Forms/Form';
import NewAppbar from '../NewAppbar';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Button } from '@mui/material';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const mdTheme = createTheme();

function DashboardContent() {
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  // written by me
  const [title, setTitle] = React.useState("Dashboard");
  // written by me ends

  // profile
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

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

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  //profile ends

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        

        <Drawer variant="permanent" open={open}>
          <Toolbar sx={{display:{xs:'none', sm:'block'}}}/>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            {
              open?<><IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton></>:<IconButton onClick={toggleDrawer}>
              <ChevronRight />
            </IconButton>
            }
          </Toolbar>
          <Divider />
          <List component="nav">
            <React.Fragment>
              <ListItemButton
                id={title === "Dashboard" ? "active" : ""}
                onClick={() => { setTitle("Dashboard"); }}
               
              >
                <ListItemIcon  title="dashboard">
                  <DashboardIcon className={title === "Dashboard" ? "iconactive" : ""} />
                </ListItemIcon >
                <ListItemText primary="Dashboard" />
              </ListItemButton>
              <ListItemButton
                id={title === "Acess People" ? "active" : ""}
                onClick={() => { setTitle("Access People"); }}
                
              >
                <ListItemIcon title="team">
                  <PeopleIcon className={title === "Acess People" ? "iconactive" : ""} />
                </ListItemIcon>
                <ListItemText primary="Access people" />
              </ListItemButton>
              <ListItemButton
                id={title === "Highlights" ? "active" : ""}
                onClick={() => { setTitle("Highlights"); }}
               
              >
                <ListItemIcon  title="highlights">
                  <BarChartIcon className={title === "Highlights" ? "iconactive" : ""} />
                </ListItemIcon>
                <ListItemText primary="Highlights" />
              </ListItemButton>
              <ListItemButton
                id={title === "Messages" ? "active" : ""}
                onClick={() => { setTitle("Messages"); }}
                
              >
                <ListItemIcon title="messages">
                  <MessageIcon className={title === "Messages" ? "iconactive" : ""} />
                </ListItemIcon>
                <ListItemText primary="Messages" />
              </ListItemButton>
              <ListItemButton
                id={title === "Archieves" ? "active" : ""}
                onClick={() => { setTitle("Archieves"); }}
                
              >
                <ListItemIcon title="archieves">
                  <ArchiveIcon className={title === "Archieves" ? "iconactive" : ""} />
                </ListItemIcon>
                <ListItemText primary="Archieves" />
              </ListItemButton>
              <ListItemButton
                id={title === "Upload Document" ? "active" : ""}
                onClick={() => { setTitle("Upload Document"); }}
                
              >
                <ListItemIcon title="upload document">
                  <FileUploadIcon  className={title === "Upload Document" ? "iconactive" : ""} />
                </ListItemIcon>
                <ListItemText primary="Upload Document" />
              </ListItemButton>
            </React.Fragment>
            <Divider sx={{ my: 1 }} />
            {/* {secondaryListItems} */}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="false" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Recent Orders */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  {
                    title === "Dashboard" ? <Table /> :
                      title === "Highlights" ? <Highlights /> :
                        title === "Archieves" ? <Archieves /> :
                          title === "Messages" ? <Messages /> :
                            title === "Upload Document" ? <Form /> :
                              <Users />
                  }
                </Paper>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box >
    </ThemeProvider >
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}