import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { auth, db } from "../../FirebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Dropzone from 'react-dropzone'
import '../index.css';

let myurls = [];
let filas = [];
function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const steps = ['Shipping address'];

const theme = createTheme();

export default function Achievement() {
    const [file, setFile] = useState([]);
    const [date, SetDate] = useState("");
    const [firstname, SetFname] = useState("");
    const [lastname, SetLname] = useState("");
    const [title, SetTitle] = useState("");
    const [description, SetDescription] = useState("");
    const [catagory, setcatagory] = useState("");
    const userDataCollectionRefDocumentData = collection(db, "DocumentData");

    const handleChange = (event) => {
        setcatagory(event.target.value);
    };

    const [activeStep, setActiveStep] = React.useState(0);
    let mydata = {};
    const handleNext = async (event) => {
        event.preventDefault();
        myurls = [];
        await uploadfilesandgeturl();
        console.log(myurls);
        if (firstname && lastname && title && description && catagory) {
            mydata = {
                firstname: firstname,
                lastname: lastname,
                title: title,
                date: date,
                catagory: catagory,
                description: description,
                fileUrl: myurls
            }
            try {
                await addDoc(userDataCollectionRefDocumentData, mydata);
                console.log("Data added Successfully");
            }
            catch (error) {
                console.log(error);
            }
        }
        else {
            window.alert("fill data properly");
        }
    };

    const UploadMyFile = (event) => {
        for (let i = 0; i < event.target.files.length; i++) {
            const newfile = event.target.files[i];
            setFile((prevState) => [...prevState, newfile]);
        }
    }
    console.log(file);
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
                <CssBaseline />
                <AppBar
                    position="absolute"
                    color="default"
                    elevation={0}
                    sx={{
                        position: 'relative',
                        borderBottom: (t) => `1px solid ${t.palette.divider}`,
                    }}
                >
                    <Toolbar>
                        <Typography variant="h6" color="inherit" noWrap>
                            Express IT
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
                    <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                        <Typography component="h1" variant="h4" align="center">
                            Student Achievement
                        </Typography>
                        <React.Fragment>
                            {activeStep === steps.length ? (
                                <React.Fragment>
                                    <Typography variant="h5" gutterBottom>
                                        Thank you for showing interest.
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        We have receive your Achievement,
                                        and will send you an update when your Achievement is verified.
                                    </Typography>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <Box component="form" noValidate onSubmit={handleNext} sx={{ mt: 3 }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField required id="firstName" onChange={(e) => { SetFname(e.target.value) }} name="firstName" label="First name" fullWidth autoComplete="given-name" variant="standard" />
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <TextField required id="lastName" name="lastName" onChange={(e) => { SetLname(e.target.value) }} label="Last name" fullWidth autoComplete="family-name" variant="standard" />
                                            </Grid>
                                            <FormControl variant="standard" sx={{ ml: 2, mt: 2 }} fullWidth>
                                                <InputLabel id="demo-simple-select-standard-label">Achievement Catagory</InputLabel>
                                                <Select labelId="demo-simple-select-standard-label" id="catagory" value={catagory} onChange={handleChange} label="Achievement Catagory">
                                                    <MenuItem value="">
                                                        <em>None</em>
                                                    </MenuItem>
                                                    <MenuItem value={'Sports and Cultural'}>Sports and Cultural</MenuItem>
                                                    <MenuItem value={'Technical Achievement'}>Technical Achievement</MenuItem>
                                                    <MenuItem value={'Internship/Placement'}>Internship/Placement</MenuItem>
                                                    <MenuItem value={'Creative Corner'}>Creative Corner</MenuItem>
                                                    <MenuItem value={'Community outreach and social initiatives'}>Community outreach and social initiatives</MenuItem>
                                                    <MenuItem value={'Other'}>Other</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <Grid item xs={12}>
                                                <TextField required id="title" name="title" onChange={(e) => { SetTitle(e.target.value) }} label="Achievement Title" fullWidth autoComplete="title" variant="standard" />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField required id="description" name="description" onChange={(e) => { SetDescription(e.target.value) }} label="description" fullWidth autoComplete="description" variant="standard" multiline />
                                            </Grid>
                                            <Grid item xs={12} sx={{ mt: 2 }}>
                                                <input type="date" onChange={(e) => { SetDate(e.target.value) }} value={date} id="datein" className="form-control" />
                                                <label className="form-label" htmlFor="titlein">Date <span style={{ color: "red" }}>*</span></label>
                                            </Grid>
                                            <Grid item xs={12} sx={{ mt: 2 }}>
                                                <input type="file" multiple onChange={UploadMyFile} className="form-control" />
                                                <label className="form-label" htmlFor="daysin">Files <span style={{ color: "red" }}>*</span></label>
                                            </Grid>
                                            <Dropzone onDrop={acceptedFiles => setFile((prevState) => [...prevState, acceptedFiles])}>
                                                {({ getRootProps, getInputProps }) => (
                                                    <section className="drag-image">
                                                        <div {...getRootProps()}>
                                                            <input {...getInputProps()} />
                                                            <p>Drag 'n' drop some files here, or click to select files</p>
                                                        </div>
                                                    </section>
                                                )}
                                            </Dropzone>
                                            {
                                                file.length != 0 ?
                                                    <div>
                                                        <span>{file.length + 1} files choosen</span>
                                                    </div> : <h1>0 file choosen</h1>
                                            }
                                            <br />
                                            <Grid item xs={12}>
                                                <FormControlLabel
                                                    control={<Checkbox color="secondary" name="saveAddress" value="yes" />}
                                                    label="Show My Achievement to everyone"
                                                />
                                            </Grid>
                                        </Grid>
                                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                            submit
                                        </Button>

                                    </Box>
                                </React.Fragment>
                            )}
                        </React.Fragment>
                    </Paper>
                    <Copyright />
                </Container>
            </ThemeProvider>
        </body>
    );
}
