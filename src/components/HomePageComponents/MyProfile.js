import React, { useState, useEffect } from "react";
// Firebase imports starts
import { auth, db } from "../../FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where, orderBy, doc, getDoc, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
// Firebase imports ends

// import Modal and button from bootstrap starts
import Modal from 'react-bootstrap/Modal';
import Button from "@mui/material/Button";
// import Modal and button from bootstrap ends

import { CardActionArea } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Divider from '@mui/material/Divider';

import img from '../../images/profile.png';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Footer from './Footer';

import nodata from '../../images/NoData.svg';


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const theme = createTheme();


function MyProfile() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [lastSignInTime, setLastSignInTime] = useState("");
    const [providerId, setProviderId] = useState("");
    const [userRole, setRole] = useState("");
    const [userUploadedDocumentData, setUserUploadedDocumentData] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [modalData, setModalData] = useState();
    const userDataCollectionRefDocumentData = collection(db, "DocumentData");


    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [openSnack, setOpenSnack] = React.useState(false);

    const handleClick = () => {
        setOpenSnack(true);
    };

    const handleClickClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnack(false);
    };


    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log(user);
                setUserName(user.displayName);
                setUserEmail(user.email);

                setLastSignInTime(new Date(user.metadata.lastSignInTime).toLocaleString(undefined, { timeZone: 'Asia/Kolkata' }));
                setProviderId(user.providerId);
                const docdata = doc(db, `Users`, user.uid);
                const data = await getDoc(docdata);
                console.log(data.data().role);
                if (data.data().role === "Admin") {
                    // console.log("Access allowed to Admin");
                    setRole("Admin");
                }
                else if (data.data().role === "Team Member") {
                    // console.log("Access allowed to team member");
                    setRole("Team Member");
                }
                else if (data.data().role === "Student") {
                    setRole("Student");
                }
                // getUserUploadedData();
            }
            else {
                navigate("/signIn");
            }
        })

    }, [])

    const getUserUploadedData = async () => {
        console.log(userEmail);
        let q;
        q = query(userDataCollectionRefDocumentData, orderBy("date", "desc"), where("publisheremail", "==", userEmail));
        const data = await getDocs(q);
        setUserUploadedDocumentData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        console.log(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))

    };

    if (providerId) {
        getUserUploadedData();
        setProviderId("");
    }
    else {
        console.log("No");
    }


    // console.log(userUploadedDocumentData)

    const temp = (data) => {
        setModalData(data);
    }

    function MyVerticallyCenteredModal(props) {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {modalData.firstname + " " + modalData.lastname}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>{modalData.title} - {modalData.catagory}</h4>
                    <p>
                        {modalData.description}
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    return (
        <div>
            <div  >
                {/* <h2 className="pb-2 pt-6">
                    My Profile
                    <div className="line"></div>
                    {userName + " - " + userRole} <br />
                    {userEmail + " - " + lastSignInTime} <br />
                </h2>

                 */}
                <section style={{ backgroundColor: 'purple' }} >
                    <div className="container py-5 h-100" >
                        <div className="row d-flex justify-content-center align-items-center h-100">
                            <div className="col col-md-9 col-lg-7 col-xl-8">
                                <div className="card" style={{ borderRadius: '15px' }} >
                                    <div className="card-body p-4">
                                        <div className="d-flex text-black">
                                            <div className="flex-shrink-0">
                                                <img src={img} style={{ width: '180px', borderRadius: '10px' }}
                                                    alt="Profile Picture" className="img-fluid"
                                                />
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h5 className="mb-1">{userName + " - " + userRole}</h5>
                                                <h6 className="mb-2 pb-1" style={{ color: '#2b2a2a' }} >{userEmail}</h6>
                                                <h6 className="mb-2 pb-1" style={{ color: '#2b2a2a' }} >Last Login: {lastSignInTime}</h6>
                                                <Divider variant="middle" />
                                                <p className="mb-2 pb-1" style={{ color: '#2b2a2a' }} >somthing about me that somthing about me thatsomthing about me thatsomthing about me thatsomthing about me that</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <main>
                        <Typography variant="h4" sx={{ m: 3 }} >
                            My Posts
                            <div className="line"></div>
                        </Typography>
                        <Container sx={{ m: 3 }} >
                            <Grid container spacing={4}>
                                {userUploadedDocumentData.length !== 0 ?
                                    userUploadedDocumentData.map((curdata) => (
                                        <Grid item key={curdata.id} xs={12} sm={6} md={3}>
                                            <Card sx={{ maxWidth: 500 }}>
                                                <CardActionArea onClick={() => { temp(curdata); setModalShow(true); }}>
                                                    <CardMedia
                                                        component="img"
                                                        height="140"
                                                        image={curdata.fileUrl[0]}
                                                        alt="green iguana"
                                                    />
                                                    <CardContent>
                                                        <Typography gutterBottom variant="h5" component="div">
                                                            {curdata.title}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {curdata.date}
                                                        </Typography>
                                                    </CardContent>
                                                </CardActionArea>
                                                <CardActions>
                                                    <Button onClick={() => { temp(curdata); handleClickOpen(); }} size="small" color="primary">
                                                        Remove
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))
                                    : <div style={{display:"flex", justifyContent:"center"}}>
                                        <img src={nodata} style={{ width: '50%', height: '50%' }}></img> <br/> <br/> 
                                        <span>Not Posted Yet</span>
                                    </div>
                                }
                            </Grid>
                        </Container>
                    </main>
                    {
                        modalShow ?
                            <MyVerticallyCenteredModal show={modalShow} onHide={() => setModalShow(false)} />
                            : <> </>
                    }
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {"Are you sure? Want to remove this record?"}
                        </DialogTitle>
                        {/* <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous
            location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>*/}
                        <DialogActions>
                            <Button onClick={() => { handleClose() }}>Disagree</Button>
                            <Button onClick={() => { handleClose(); handleClick(); }} autoFocus>
                                Agree
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleClickClose}>
                        <Alert onClose={() => { handleClickClose() }} severity="success" sx={{ width: '100%' }}>
                            Removed from Highlight!
                        </Alert>
                    </Snackbar>
                </ThemeProvider>
                {
                    modalShow ?
                        <MyVerticallyCenteredModal show={modalShow} onHide={() => setModalShow(false)} />
                        : <> </>
                }
            </div>
            <Footer />
        </div>
    )
}

export default MyProfile;