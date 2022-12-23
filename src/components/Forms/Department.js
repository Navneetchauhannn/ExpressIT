import React, { useState, useEffect } from 'react';
import { Controller, useForm } from "react-hook-form";
import CssBaseline from '@mui/material/CssBaseline';
import ProgressBar from 'react-bootstrap/ProgressBar';
import AppBar from '@mui/material/AppBar';
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
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
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

export default function Department() {
  const { handleSubmit, reset, control } = useForm();
  const [file, setFile] = useState([]);
  const [catagory, setcatagory] = useState("");
  const [UploadProgress, SetUploadProgress] = useState(0);
  const userDataCollectionRefDocumentData = collection(db, "DocumentData");
  const [publisherName, SetPublisherName] = React.useState("");
  const [publisherEmail, SetPublisherEmail] = React.useState("");

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

  const onSubmit = async (data) => {
    if (catagory !== "OTHER") {
      data.catagory = catagory;
    }
    data.uploads = 'Department';
    data.publishername = publisherName;
    data.publisheremail = publisherEmail;
    data.highlight = 'False';
    
    if (data.firstname && data.lastname && data.title && data.description && data.fecultyCord && data.studentCord && data.participant && data.sem && data.place) {
      myurls = [];
    await uploadfilesandgeturl();
    data.fileUrl = myurls;
    
      try {
        await addDoc(userDataCollectionRefDocumentData, data);
        handleClick()
        resetForm();
          setTimeout(()=>{SetUploadProgress(0)},2000);

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
      firstname:'',
      lastname:'',
      title:'',
      duration:'',
      place:'',
      description:'',
      date:'',
      remarks:'',
      fecultyCord:'',
      studentCord:'',
      participant:'',
      sem:''
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
    <body style={{backgroundColor:'azure'}}>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="sm" sx={{ pb: 3 }}>
          <Paper variant="outlined" sx={{ my: { xs: 3, }, p: { xs: 2, md: 3 } }}>
            <Typography component="h1" variant="h4" align="center">
              Department Activities
            </Typography>
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
                            size='small'
                            fullWidth
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
                      <FormControl size='small' fullWidth>
                        <InputLabel id="demo-simple-select-standard-label">Type of an Event</InputLabel>
                        <Select labelId="demo-simple-select-standard-label" id="catagory" value={catagory} onChange={(e) => { setcatagory(e.target.value) }} label="Achievement Catagory">
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={'ISTE'}>ISTE</MenuItem>
                          <MenuItem value={'NBA ACCEDITATION'}>NBA ACCEDITATION</MenuItem>
                          <MenuItem value={'EXPERT TALK'}>EXPERT TALK</MenuItem>
                          <MenuItem value={'INDUSTRY VISIT'}>INDUSTRY VISIT</MenuItem>
                          <MenuItem value={'WEBINAR/SEMINAR'}>WEBINAR/SEMINAR</MenuItem>
                          <MenuItem value={'OTHER'}>OTHER</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    {
                      !catagory ? <></> :
                        catagory === "OTHER" ?
                          <Grid item xs={12}>
                            <Controller
                              name={"catagory"}
                              control={control}
                              render={({ field: { onChange, value } }) => (
                                <TextField
                                  name="catagory"
                                  required
                                  size='small'
                                  fullWidth
                                  id="catagory"
                                  label="Type of an Event"
                                  onChange={onChange}
                                  value={value}
                                />
                              )}
                            />
                          </Grid>
                          : <></>
                    }
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
                            label="Name/Topic of an Event"
                            onChange={onChange}
                            value={value}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name={"fecultyCord"}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <TextField
                            autoComplete="fecultyCord"
                            name="fecultyCord"
                            required
                            size='small'
                            fullWidth
                            id="fecultyCord"
                            label="Feculty Cordinator"
                            onChange={onChange}
                            value={value}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name={"studentCord"}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <TextField
                            autoComplete="studentCord"
                            name="studentCord"
                            required
                            size='small'
                            fullWidth
                            id="studentCord"
                            label="Student Cordinator"
                            onChange={onChange}
                            value={value}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name={"participant"}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <TextField
                            autoComplete="participant"
                            name="participant"
                            required
                            size='small'
                            fullWidth
                            id="participant"
                            label="No. of Participant"
                            onChange={onChange}
                            value={value}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name={"sem"}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <TextField
                            autoComplete="sem"
                            name="sem"
                            required
                            size='small'
                            fullWidth
                            id="sem"
                            label="Target Semester"
                            onChange={onChange}
                            value={value}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name={"place"}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <TextField
                            autoComplete="place"
                            name="place"
                            required
                            size='small'
                            fullWidth
                            id="place"
                            label="Place of an Event"
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
                            size='small'
                            multiline
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
                        name={"remarks"}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <TextField
                            name="remarks"
                            required
                            fullWidth
                            multiline
                            minRows={3}
                            id="remarks"
                            size='small'
                            label="remarks"
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
                            size='small'
                            required
                            fullWidth
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
                      <Button onClick={()=>{resetForm()}}>Clear</Button>
                    </Grid>
                    <Grid item xs={12}>
                      <ProgressBar animated now={UploadProgress} variant="success" label={`Data uploaded ${UploadProgress}%`} />
                    </Grid>
                  </Grid>
                </Box>
              </React.Fragment>
            </React.Fragment>
          </Paper>
        </Container>
      </ThemeProvider>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Uploaded Successfully
        </Alert>
      </Snackbar>
    </body>
  );
}