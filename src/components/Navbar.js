import React, { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../FirebaseConfig.js";
// import { FaBookReader } from "@react-icons/all-files/fa/FaBookReader.esm";
import '../index.css'
import LocalLibraryRoundedIcon from '@mui/icons-material/LocalLibraryRounded';
import './index.css';
import { Button } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
function Nabvar() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [WhetherUserExist, SetWhetherUserExist] = useState(false);
    const [userName, setUserName] = useState("");
    const navigate = useNavigate();
    const isMenuOpen = Boolean(anchorEl);
    // profile
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };


    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    //   profile ends

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
            onClose={handleMenuClose}
        >
            <MenuItem onClick={() => { handleMenuClose() }}>Profile</MenuItem>
            <MenuItem onClick={() => { logout(); handleMenuClose() }}>Log Out</MenuItem>
        </Menu>
    );

    const status = () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                SetWhetherUserExist(true);
                let username = user.displayName.split(" ");
                setUserName(username[0]);
            }
            else {
                navigate("/signIn");
                SetWhetherUserExist(false);
            }
        })
    }
    const logout = async () => {
        await signOut(auth);
        localStorage.removeItem('1111');
    }


    const login = () => {
        navigate("/signin");
    }

    useEffect(() => {
        status();
    }, [WhetherUserExist])

    return (
        <>
            <Navbar sticky="top" collapseOnSelect expand="sm" style={{ background: "white", boxShadow: "0 2px 4px 0 rgba(0,0,0,.2)" }}>
                <Container>
                    <Navbar.Brand style={{ position: "relative", right: "30px" }}><LocalLibraryRoundedIcon style={{ color: "purple" }} /><b style={{ marginLeft: "2px" }}>Express IT</b></Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav" style={{ justifyContent: "end", position: "relative", top: "10px" }}>
                        <Nav className="liu active">
                            <NavLink className="mynavlink" to="/home">Home</NavLink> &nbsp;&nbsp;&nbsp;
                            {/* <NavLink to="/oldissues">Old issues</NavLink> &nbsp;&nbsp;&nbsp; */}
                            <NavLink className="mynavlink" to="/contact"
                            >Contact</NavLink> &nbsp;&nbsp;&nbsp;
                            <NavLink className="mynavlink" to="/archives">Archives</NavLink> &nbsp;&nbsp;&nbsp;
                            <NavLink className="mynavlink" to="/achievement">Add Activity</NavLink> &nbsp;&nbsp;&nbsp;
                            {/* <NavLink to="/myactivity">Contact</NavLink> &nbsp;&nbsp;&nbsp; */}
                            <NavLink className="mynavlink" to="/">Team Member</NavLink> &nbsp;&nbsp;&nbsp;
                            {
                                WhetherUserExist ?
                                    <>

                                        <MenuItem onClick={handleProfileMenuOpen}>
                                            <AccountCircle style={{color:"black"}} />
                                            {userName}
                                        </MenuItem> </> :
                                    <div> <button type="submit" style={{ position: "relative", top: "-6px" }} onClick={login} className="btn btn-primary btn-block mb-1"> Login </button> </div>
                            }

                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {renderMenu}
        </>
        // <Box sx={{ flexGrow: 1 }}>
        //     <AppBar position="static">
        //         <Toolbar>
        //             <IconButton
        //                 size="large"
        //                 edge="start"
        //                 color="inherit"
        //                 aria-label="menu"
        //                 sx={{ mr: 2 }}
        //             >
        //                 <MenuIcon />
        //             </IconButton>
        //             <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        //                 News
        //             </Typography>
        //             <NavLink to="/">Home</NavLink> &nbsp;&nbsp;&nbsp;
        //             {/* <NavLink to="/adddocument">Old issues</NavLink> &nbsp;&nbsp;&nbsp; */}
        //                      {/* <NavLink to="/showdocument">About</NavLink> &nbsp;&nbsp;&nbsp;
        //                      <NavLink to="/myactivity">Contact</NavLink> &nbsp;&nbsp;&nbsp;
        //                      <NavLink to="/teammember">Team Member</NavLink> &nbsp;&nbsp;&nbsp; */}
        //                      <Button onClick={login} color="inherit">About</Button>
        //                      <Button onClick={login} color="inherit">Contact</Button>
        //                      <Button onClick={login} color="inherit">Team</Button>
        //                      {
        //                          WhetherUserExist ?
        //                          <Button color="inherit" onClick={logout}>Login</Button> :
        //                          <Button color="inherit" onClick={login}>Login</Button>
        //                      }
        //         </Toolbar>
        //     </AppBar>
        // </Box>
    );
}

export default Nabvar;  