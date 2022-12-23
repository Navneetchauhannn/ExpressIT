import React, { useState, useEffect } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { auth, db } from "../../FirebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const theme = createTheme();

function NoticeBoard() {
    const [file, setFile] = useState();
    const [date, SetDate] = useState("");
    const [eventName, setEventName] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [show, setShow] = useState(false);
    const [UploadProgress, SetUploadProgress] = useState(0);
    const [publisherName, SetPublisherName] = useState("");
    const [publisherEmail, SetPublisherEmail] = useState("");
    const userDataCollectionRefDocumentData = collection(db, "NoticeboardData");

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                SetPublisherName(user.displayName);
                SetPublisherEmail(user.email);
            }
            // else {
            //     navigate("/signIn");
            // }
        })
    }, [])

    let mydata = {};
    const uploadEventData = async (event) => {
        event.preventDefault();
        const getFileUploadedPath = await uploadfile();
        if (eventName && eventDescription && date) {
            mydata = {
                eventname: eventName,
                date: date,
                eventdescription: eventDescription,
                fileUrl: getFileUploadedPath,
                publishername: publisherName,
                publisheremail: publisherEmail
            }
            try {
                await addDoc(userDataCollectionRefDocumentData, mydata);
                setEventName("");
                setEventDescription("");
                SetDate("");
                setFile("");
                setTimeout(()=>{
                    SetUploadProgress(0);
                },3000)
                setShow(true);
            }
            catch (error) {
                console.log(error);
            }
        }
        else {
            window.alert("fill data properly");
        }
    };

    const uploadfile = () => {
        return new Promise((resolve, reject) => {
            const storage = getStorage();
            const storageRef = ref(storage, `LDCE/${file.name}`);

            const uploadTask = uploadBytesResumable(storageRef, file);

            // Register three observers:
            // 1. 'state_changed' observer, called any time the state changes
            // 2. Error observer, called on failure
            // 3. Completion observer, called on successful completion
            uploadTask.on('state_changed',
                (snapshot) => {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    SetUploadProgress(progress);
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    // Handle unsuccessful uploads
                    console.log("rejected rejected rejected");
                    reject();
                },
                () => {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File available at', downloadURL);
                        resolve(downloadURL);
                    });
                }
            );
        })
    }

    function UploadMyFile(event) {
        console.log(event.target.files[0]);
        setFile(event.target.files[0]);
    }

    return (
        <body>
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="sm" sx={{ mb: 3 }}>
                    <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
                        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                            <Typography component="h1" variant="h4" align="center">
                                Notice Board Activity
                            </Typography>
                            <React.Fragment>
                                <React.Fragment>
                                    <Box component="form" noValidate onSubmit={(e) => { uploadEventData(e) }} sx={{ mt: 3 }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField size="small" required id="eventTitle" onChange={(e) => { setEventName(e.target.value) }} value={eventName} name="eventTitle" label="Event Title" fullWidth variant="outlined" />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField size="small" required id="eventDescription" multiline rows={3} onChange={(e) => { setEventDescription(e.target.value) }} fullWidth value={eventDescription} name="eventDescription" label="Event Description" placeholder='Maximum 250 Characters AND Minimum 240 Characters' />
                                            </Grid>
                                            <Grid size="small" item xs={12} sx={{ mt: 2 }}>
                                                <input type="date" onChange={(e) => { SetDate(e.target.value) }} value={date} id="datein" className="form-control" />
                                                <label className="form-label" htmlFor="titlein">Date <span style={{ color: "red" }}>*</span></label>
                                                <input type="file" onChange={(e) => { UploadMyFile(e) }} className="form-control" />
                                                <label className="form-label" htmlFor="daysin">File <span style={{ color: "red" }}>*</span></label>
                                            </Grid>
                                        </Grid>
                                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                            submit
                                        </Button>
                                        <ProgressBar animated now={UploadProgress} variant="success" label={`Data uploaded ${UploadProgress}%`} />
                                    </Box>
                                </React.Fragment>
                            </React.Fragment>
                        </Paper>
                    </Container>
                </Container>
            </ThemeProvider>
            <ToastContainer position="top-center" className="p-3">
                <Toast bg="primary" onClose={() => setShow(false)} show={show} delay={3000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">Express IT</strong>
                        <small className="text-muted">just now</small>
                    </Toast.Header>
                    <Toast.Body>Data Successfully added.</Toast.Body>
                </Toast>
            </ToastContainer>
        </body>
    );
}

export default NoticeBoard;