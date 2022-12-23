import React, { useState, useEffect } from 'react';
import { Controller, useForm } from "react-hook-form";
import ProgressBar from 'react-bootstrap/ProgressBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { auth, db } from "../../FirebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


let myurls = [];

const theme = createTheme();

export default function Student() {
    const { handleSubmit, reset, control } = useForm();
    const [file, setFile] = useState([]);
    const [catagory, setcatagory] = useState("");
    const [UploadProgress, SetUploadProgress] = useState(0);
    const [publisherName, SetPublisherName] = React.useState("");
    const [publisherEmail, SetPublisherEmail] = React.useState("");
    const userDataCollectionRefDocumentData = collection(db, "DocumentData");
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log(user);
                SetPublisherName(user.displayName);
                SetPublisherEmail(user.email);
            }
            // else {
            //     navigate("/signIn");
            // }
        })
    }, [])

    const onSubmit = async (data) => {
        data.catagory = catagory;
        data.uploads = 'Student';
        data.publishername = publisherName;
        data.publisheremail = publisherEmail;
        data.highlight = 'False';
        if (data.firstname && data.lastname && data.title && data.description && data.catagory) {
            myurls = [];
            await uploadfilesandgeturl();
            data.fileUrl = myurls;
            try {
                await addDoc(userDataCollectionRefDocumentData, data);
                handleClick()
                resetForm();
                setTimeout(() => { SetUploadProgress(0) }, 2000);
            }
            catch (error) {
                console.log(error);
            }
        }
        else {
            window.alert("fill data properly");
        }
    };

    const resetForm = () => {
        setcatagory("");
        reset({
            firstname: '',
            lastname: '',
            title: '',
            duration: '',
            place: '',
            description: '',
            date: '',
            enrollment: '',
        });
    }

    const UploadMyFile = (event) => {
        for (let i = 0; i < event.target.files.length; i++) {
            const newfile = event.target.files[i];
            setFile((prevState) => [...prevState, newfile]);
        }
    }
    const uploadfilesandgeturl = () => {
        return new Promise((resolve, reject) => {
            uploadfile(0, file, resolve, reject);
        })
    }

    const uploadfile = (counter, file, resolve, reject) => {
        if (myurls.length === file.length) {
            return;
        }
        const storage = getStorage();
        const storageRef = ref(storage, `LDCE/${file[counter].name}`);
        const uploadTask = uploadBytesResumable(storageRef, file[counter]);
        uploadTask.on('state_changed',
            (snapshot) => {
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
                console.log("rejected rejected rejected");
                reject();
                return;
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log("i executed");
                    myurls.push(downloadURL);
                    if (counter == file.length - 1) {
                        resolve();
                        return;
                    }
                    uploadfile(counter + 1, file, resolve, reject);
                });
            }
        );
    }

    return (
        <body>
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="sm" sx={{ pb: 3 }}>
                    <h2 style={{ paddingTop: "10px" }}>
                        Student Achievement
                        <div className="line"></div>
                    </h2>
                    <React.Fragment>
                        <React.Fragment>
                            <Box sx={{ mt: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Controller
                                            name={"firstname"}
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <TextField
                                                    autoComplete="firstname"
                                                    name="firstName"
                                                    required
                                                    fullWidth
                                                    size='small'
                                                    id="firstName"
                                                    label="First Name"
                                                    onChange={onChange}
                                                    value={value}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Controller
                                            name={"lastname"}
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <TextField
                                                    autoComplete="lastname"
                                                    name="lastname"
                                                    required
                                                    fullWidth
                                                    size='small'
                                                    id="lastname"
                                                    label="Last Name"
                                                    onChange={onChange}
                                                    value={value}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Controller
                                            name={"enrollment"}
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <TextField
                                                    autoComplete="enrollment"
                                                    name="enrollment"
                                                    required
                                                    size='small'
                                                    fullWidth
                                                    id="enrollment"
                                                    label="Enrollment No."
                                                    onChange={onChange}
                                                    value={value}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl size='small' fullWidth>
                                            <InputLabel id="demo-simple-select-outlined-label">Achievement Catagory</InputLabel>
                                            <Select labelId="demo-simple-select-outlined-label" id="catagory" value={catagory} onChange={(e) => { setcatagory(e.target.value) }} label="Achievement Catagory">
                                                <MenuItem value="">
                                                    None
                                                </MenuItem>
                                                <MenuItem value={'Sports and Cultural'}>Sports and Cultural</MenuItem>
                                                <MenuItem value={'Technical Achievement'}>Technical Achievement</MenuItem>
                                                <MenuItem value={'Internship/Placement'}>Internship/Placement</MenuItem>
                                                <MenuItem value={'Creative Corner'}>Creative Corner</MenuItem>
                                                <MenuItem value={'Community outreach and social initiatives'}>Community outreach and social initiatives</MenuItem>
                                                <MenuItem value={'Other'}>Other</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Controller
                                            name={"title"}
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <TextField
                                                    autoComplete="title"
                                                    name="title"
                                                    required
                                                    size='small'
                                                    fullWidth
                                                    id="title"
                                                    title='Please fill out this field.'
                                                    label="Title of Achievement"
                                                    onChange={onChange}
                                                    value={value}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Controller
                                            name={"description"}
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <TextField
                                                    name="description"
                                                    required
                                                    fullWidth
                                                    multiline
                                                    size='small'
                                                    minRows={3}
                                                    id="description"
                                                    label="Description"
                                                    onChange={onChange}
                                                    value={value}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Controller
                                            name={"date"}
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <TextField
                                                    type="date"
                                                    name="date"
                                                    required
                                                    fullWidth
                                                    size='small'
                                                    id="datein"
                                                    onChange={onChange}
                                                    value={value}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField type="file" multiple onChange={UploadMyFile} className="form-control" />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button onClick={handleSubmit(onSubmit)} variant="contained" >
                                            submit
                                        </Button>
                                    </Grid>
                                    <Grid item xs={6} display='flex' justifyContent="flex-end">
                                        <Button onClick={() => { resetForm() }}>Clear</Button>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ProgressBar animated now={UploadProgress} variant="success" label={`Data uploaded ${UploadProgress}%`} />
                                    </Grid>
                                </Grid>
                            </Box>
                        </React.Fragment>
                    </React.Fragment>
                </Container>
            </ThemeProvider>
            <Snackbar open={open} autoHideDuration={6000} onClose={() => { handleClose() }}>
                <Alert onClose={() => { handleClose() }} severity="success" sx={{ width: '100%' }}>
                    Uploaded Successfully
                </Alert>
            </Snackbar>
        </body>
    );
}