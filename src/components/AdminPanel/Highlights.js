import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import { CardActionArea } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { collection, writeBatch, getDocs, query, where, orderBy, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import Modal from 'react-bootstrap/Modal';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import './style.css'


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const theme = createTheme();

const Album = () => {

    const userDataCollectionRefDocumentData = collection(db, "DocumentData");
    const batch = writeBatch(db);
    const [HighlightedData, SetHighlightedData] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [modalData, setModalData] = useState();
    const [role, setRole] = useState("");

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



    const temp = (data) => {
        setModalData(data);
        console.log("yessss");
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
                    <h4>{modalData.highlightTitle}</h4>
                    <p>
                        {modalData.highlightDesc}
                    </p>
                    {
                        role === "111" ?
                            <Button onClick={() => { handleClickOpen() }}>Remove from Highlight</Button>
                            : <></>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <span >{modalData.catagory}</span>
                    <Button onClick={props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    const GetHighlightedData = async () => {
        let q;
        q = query(userDataCollectionRefDocumentData, where('highlight', '==', "True"), orderBy("date", "desc"));
        const data = await getDocs(q);
        SetHighlightedData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        ChangeToOutDated(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }

    const ChangeToOutDated = async (myid) => {
        let docdata;
        let i;
        const fixedLength = 4;
        if (myid.length > fixedLength) {
            i = myid.length;
            while (i > fixedLength) {
                docdata = doc(db, `DocumentData`, myid[i - 1].id);
                batch.update(docdata, { highlight: "OutDated" });
                i--;
            }
            batch.commit();
        }
    }

    const ChangeToOutDatedExplicitly = async (id) => {
        const docdata = doc(db, `DocumentData`, id);
        await updateDoc(docdata, { highlight: "OutDated" });
        console.log("OutDated done");
    }

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                setRole(localStorage.getItem("1111"));
            }
            else {
                // navigate("/signIn");
            }
        })
        GetHighlightedData()
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <main>
                <Typography variant="h4" sx={{ m: 6, mb: 7 }} >
                    Highlights
                    <div className="line"></div>
                </Typography>
                <Container style={{ backgroundColor: 'azure' }} sx={{ pb: 4 }} >
                    <Grid container spacing={6} >
                        {HighlightedData.map((curdata) => (
                            <Grid item key={curdata.id} xs={12} sm={6} md={3}>
                                <Card sx={{
                                    maxWidth: 500,
                                    ':hover': {
                                        boxShadow: 10,
                                    }
                                }}>
                                    <CardActionArea onClick={() => { temp(curdata); setModalShow(true); }}>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={curdata.fileUrl[0]}
                                            alt="green iguana"
                                        />
                                        <CardContent>
                                            <Typography className="HighlightClass" gutterBottom variant="h5" component="div">
                                                {curdata.highlightTitle}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {curdata.date}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                    {
                                        role === "111" ?
                                            <CardActions>
                                                <Button onClick={() => { temp(curdata); handleClickOpen(); }} size="small" color="primary">
                                                    Remove
                                                </Button>
                                            </CardActions> : <></>
                                    }
                                </Card>
                            </Grid>
                        ))}
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
                    {"Are you sure? Want to remove from highlight?"}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={() => { handleClose() }}>Disagree</Button>
                    <Button onClick={() => { ChangeToOutDatedExplicitly(modalData.id); handleClose(); handleClick(); }} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={openSnack} autoHideDuration={6000} onClose={() => { handleClickClose() }}>
                <Alert onClose={() => { handleClickClose() }} severity="success" sx={{ width: '100%' }}>
                    Removed from Highlight!
                </Alert>
            </Snackbar>
        </ThemeProvider>
    );
}

export default Album;