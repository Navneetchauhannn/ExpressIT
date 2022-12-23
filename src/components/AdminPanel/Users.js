import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

import { auth, db } from "../../FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

import { collection, getDocs } from "firebase/firestore";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function ManageUsers() {
    const navigate = useNavigate();
    const [myAdminData, SetmyAdminData] = useState([]);
    const [myTeamMemberData, SetmyTeamMemberData] = useState([]);
    const userDataCollectionRef = collection(db, "Users");
    const [deleteId, setDeleteId] = useState("");
    const [message, setMessage] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserEmail(user.email);
            }
            else {
                navigate("/signIn");
            }
        })
    }, [])

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [openSnack, setOpenSnack] = React.useState(false);

    const handleClick = (mess) => {
        setMessage(mess);
        setOpenSnack(true);
    };

    const handleClickClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnack(false);
    };

    const DeleteUser = async () => {
        try {
            const res = await fetch("/register", {
                method: "POST",
                headers: { "Content-Type": "application/JSON" },
                body: JSON.stringify({ deleteId })
            });
            if (res.status === 200) {
                handleClick("sucess");
                handleShow();
            } else {
                handleClick("error");
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const handleShow = async () => {
        try {
            const AdminData = await getDocs(userDataCollectionRef);
            SetmyAdminData(AdminData.docs.map((doc) => ({ ...doc.data(), id: doc.id })).filter(dataa => dataa.role === "Admin"))
            SetmyTeamMemberData(AdminData.docs.map((doc) => ({ ...doc.data(), id: doc.id })).filter(dataa => dataa.role === "Team Member"))
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleShow();
    }, [])
    //written by me ends
    return (
        <Container>
            <div className="px-md-1" style={{ padding: "0 5px" }}>
                <h2 className="pt-6">
                   Manage Users
                    <div className="line"></div>
                </h2>
            </div>
            <Row>
                <Col>
                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                        {
                            myAdminData.map((curr) => {
                                return (
                                    <ListItem
                                        key={curr.id} alignItems="flex-start"
                                        secondaryAction={
                                            <IconButton onClick={() => { setDeleteId(curr.id); handleClickOpen(); }} edge="end" aria-label="delete">
                                                {
                                                    curr.email !== userEmail ? <DeleteIcon /> : <> </>
                                                }
                                            </IconButton>
                                        }>
                                        <ListItemAvatar>
                                            <Avatar alt={`Avatar n°${curr + 1}`} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={curr.firstname + " " + curr.lastname}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        sx={{ display: 'inline' }}
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                    >
                                                        {curr.role}-
                                                    </Typography>
                                                    {curr.email}
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                </Col>
                <Col>
                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                        {
                            myTeamMemberData.map((curr) => {
                                return (
                                    <ListItem
                                        key={curr.id} alignItems="flex-start"
                                        secondaryAction={
                                            <IconButton onClick={() => { setDeleteId(curr.id); handleClickOpen(); }} edge="end" aria-label="delete">
                                                {
                                                    curr.email !== userEmail ? <DeleteIcon /> : <> </>
                                                }
                                            </IconButton>
                                        }>
                                        <ListItemAvatar>
                                            <Avatar alt={`Avatar n°${curr + 1}`} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={curr.firstname + " " + curr.lastname}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        sx={{ display: 'inline' }}
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                    >
                                                        {curr.role}-
                                                    </Typography>
                                                    {curr.email}
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                </Col>
            </Row>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >

                <DialogTitle id="alert-dialog-title">
                    {"Are you sure? Want to Delete This User?"}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={() => { handleClose() }}>Disagree</Button>
                    <Button onClick={() => { DeleteUser(); handleClose(); }} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
            {
                message === "" ? <></> :
                    message === "sucess" ?
                        <Snackbar open={openSnack} autoHideDuration={6000} onClose={() => { handleClickClose() }}>
                            <Alert onClose={() => { handleClickClose() }} severity="success" sx={{ width: '100%' }}>
                                Deleted Successfully!
                            </Alert>
                        </Snackbar> :
                        message === "error" ?
                            <Snackbar open={openSnack} autoHideDuration={6000} onClose={() => { handleClickClose() }}>
                                <Alert onClose={() => { handleClickClose() }} severity="error" sx={{ width: '100%' }}>Enable to Delete!</Alert>
                            </Snackbar> : <></>
            }
        </Container>
    );
}

export default ManageUsers;