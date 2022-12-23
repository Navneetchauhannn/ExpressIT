import React, { useState, useEffect, forwardRef } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';

import { auth, db } from "../../FirebaseConfig";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, getDocs, query, orderBy, doc, deleteDoc } from "firebase/firestore";

import ProgressBar from 'react-bootstrap/ProgressBar';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';


const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

export default function InteractiveList() {

  // written by me
  const userDataCollectionRefMagazineData = collection(db, "MagazineData");
  const [MagazineShow, SetMagazineShow] = useState(false);
  const [title, SetTitle] = useState("");
  const [publisherName, SetPublisherName] = useState("");
  const [date, setDate] = useState("");
  const [publisherEmail, SetPublisherEmail] = useState("");
  const [UploadProgress, SetUploadProgress] = useState(0);
  const [file, setFile] = useState();
  const [magazineData, setMagazineData] = useState([]);
  const [message, setMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [id, setId] = useState("");

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClickClose = () => {
    setOpenDialog(false);
  };


  const [open, setOpen] = useState(false);
  const handleClick = (message) => {
    setMessage(message)
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

  const handleFile = (event) => {
    console.log(event.target.files[0]);
    setFile(event.target.files[0]);
  }

  const uploadfile = () => {
    return new Promise((resolve, reject) => {
      const storage = getStorage();
      const storageRef = ref(storage, `LDCE/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

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
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            resolve(downloadURL);
          });
        }
      );
    })
  }


  let MagazineData = {};
  const UploadMagazine = async (e) => {
    e.preventDefault();
    let getFileUploadedPath = [];
    getFileUploadedPath.push(await uploadfile());
    if (title) {
      MagazineData = {
        title: title,
        date: date,
        fileUrl: getFileUploadedPath,
        publishername: publisherName,
        publisheremail: publisherEmail
      }
      try {
        await addDoc(userDataCollectionRefMagazineData, MagazineData);
        handleClick("Uploaded Sucessfully")
        getMagazineData();
        setDate("");
        setTimeout(()=>{
          SetUploadProgress(0);
        },2000);
        SetMagazineShow(false);
      }
      catch (error) {
        console.log(error);
      }
    }
    else {
      window.alert("fill data properly");
    }

  }

  // to get files 
  const getMagazineData = async () => {
    try {
      let q = query(userDataCollectionRefMagazineData, orderBy("date", "desc"));
      const data = await getDocs(q);
      setMagazineData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    } catch (e) {
      console.log(e);
    }
  }

  const deleteMagazine = async (id) => {
    const docdata = doc(db, "MagazineData", id);
    try {
      await deleteDoc(docdata);

      handleClick("Deleted Sucessfully")
      // console.log(message)
      getMagazineData()
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getMagazineData();
  }, [])

  //by me ends

  return (
    <>
      <div className="px-md-5" style={{ padding: "0 30px" }}>
        <h2 className="pb-2 pt-6">
          Archives Folder
          <div className="line"></div>
        </h2>
        <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <List dense={false}>
                {magazineData.map((data) => {
                  return (

                    <ListItem
                      secondaryAction={
                        <IconButton onClick={(e) => { e.preventDefault(); setId(data.id); handleClickOpen(); }} edge="end" aria-label="delete">
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <Button href={data.fileUrl}>
                        <ListItemAvatar >
                          <Avatar>
                            <FolderIcon />
                          </Avatar>
                        </ListItemAvatar>
                      </Button>
                      <ListItemText
                        primary={data.title}
                        secondary={data.date}
                      />
                    </ListItem>
                    // </ListItemButton>
                  )
                })
                }
              </List>
              <Button onClick={() => { SetMagazineShow(true) }}>Upload Magazine</Button>
            </Grid>
          </Grid>
          <Snackbar open={open} autoHideDuration={6000} onClose={() => { handleClose(); }}>
            <Alert onClose={() => { handleClose(); }} severity="success" sx={{ width: '100%' }}>
              {message}
            </Alert>
          </Snackbar>

        </Box>
      </div>
      {MagazineShow ?
        <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
          <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
            <Typography component="h1" variant="h4" align="center">
              Upload Recent Magazine Issue
            </Typography>
            <React.Fragment>
              <React.Fragment>
                <Box component="form" noValidate sx={{ mt: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField required id="title" fullWidth onChange={(e) => { SetTitle(e.target.value) }} name="title" label="Title" autoComplete="given-name" variant="outlined" size='small' />
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 0.5 }}>
                      <TextField type="date" name="date" size='small' required id="datein" onChange={(e)=>{setDate(e.target.value)}} value={date}/> <br/>
                      <span>Launch Date.</span> <br />
                    </Grid>
                    <Grid size='small' item xs={12} sx={{ mt: 0 }}>
                      <input type="file" className="form-control" onChange={(e) => { handleFile(e) }} />
                      <label className="form-label" htmlFor="daysin">File <span style={{ color: "red" }}>*</span></label> <br />
                      <span style={{ color: "red" }}>Only file with the pdf extenstion is allowed.</span> <br />
                    </Grid>
                    <Grid container spacing={2}> <br />
                      <Grid item xs={12} sx={{ ml: 2 }} >
                        <TextField size='small' fullWidth id="institute" label="Publisher's name" value={publisherName} disabled={true} />
                      </Grid>
                      <Grid item xs={12} sx={{ ml: 2 }}>
                        <TextField size='small' fullWidth label="Publisher's email" value={publisherEmail} disabled={true} />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Button type="submit" size='small' onClick={(e) => { UploadMagazine(e) }} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                    Upload
                  </Button>
                  <Button type="submit" size='small' onClick={() => { SetMagazineShow(false) }} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                    Cancel
                  </Button>
                  <ProgressBar animated now={UploadProgress} variant="success" label={`Data uploaded ${UploadProgress}%`} />
                </Box>
              </React.Fragment>
            </React.Fragment>
          </Paper>

        </Container>
        : <> </>
      }
      <Dialog
        open={openDialog}
        onClose={handleClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure? Want to delete this Item"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => { handleClickClose() }}>Disagree</Button>
          <Button onClick={() => { deleteMagazine(id); handleClickClose(); }} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}