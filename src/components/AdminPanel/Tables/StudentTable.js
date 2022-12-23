import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { collection, getDocs, query, where, orderBy, doc, getDoc, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from "../../../FirebaseConfig";
import FormControl from '@mui/material/FormControl';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { Checkbox } from '@mui/material';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';

import Container2 from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import FormControlLabel from '@mui/material/FormControlLabel';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


//modal libraries
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Modal from 'react-bootstrap/Modal';
import { Form } from 'react-bootstrap';

//modal ends



//export 
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}
//export ends

export function CountButton(props) {
  const data = props.id;
  return (
    <div>
      <Button href='#scroll' onClick={() => { props.getId(data.id) }}>Edit</Button>
    </div>
  );
};

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function ModelFun(props) {

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

  const data = props.id;
  const [modalShow, setModalShow] = React.useState(false)

  const DeleteData = async (id) => {
    const docdata = doc(db, "DocumentData", id);
    try {
      await deleteDoc(docdata);
      console.log("Data deleted successfully");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <Button onClick={() => { setModalShow(true) }} >Details</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure? want to delete this record"}
        </DialogTitle>
        {/* <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous
            location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent> */}
        <DialogActions>
          <Button onClick={() => { handleClose() }}>Disagree</Button>
          <Button onClick={() => { DeleteData(data.id); setModalShow(false); handleClose(); handleClick(); }} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={openSnack} autoHideDuration={6000} onClose={() => { handleClickClose() }}>
        <Alert onClose={() => { handleClickClose() }} severity="success" sx={{ width: '100%' }}>
          Success!
        </Alert>
      </Snackbar>
      {
        modalShow ?
          <Modal
            show={modalShow}
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={() => { setModalShow(false) }}
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter" >
                {data.firstname + " " + data.lastname}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h4><b>{data.title + " - " + data.catagory}</b></h4>
              Date: <b>{data.date}</b>
              <br></br>
              Description: {data.description}
              <br></br>
              {
                data.fileUrl.map((url,index) => {
                  return (
                    <><a target={'_blank'} href={url}>File{index}</a><br></br></>
                  )
                })
              }
            </Modal.Body>
            <Modal.Footer>
              <Button variant='contained' size='small' sx={{ mr: 40 }} onClick={() => { handleClickOpen() }}>Delete</Button>
              <Button onClick={() => { setModalShow(false) }}>Close</Button>
            </Modal.Footer>
          </Modal> : <> </>

      }
    </div>
  );
};


export default function DataTable(props) {
  const [editId, setEditId] = React.useState("");
  const userDataCollectionRefDocumentData = collection(db, "DocumentData");
  const [documentData, setDocumentData] = useState([]);

  // const getDocumentData = async () => {
  //   let q;
  //   q = query(userDataCollectionRefDocumentData, orderBy("date", "desc"));
  //   const data = await getDocs(q);
  //   console.log(data);
  //   setDocumentData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  // }

  // GET ALL DOCUMENT FOR STUDNET DATA (WITHOUT TIMESPAN)
  const getDocumentData = async () => {
    // let q;
    // q = query(userDataCollectionRefDocumentData, orderBy("date", "desc"), where("uploads", "==", "Student"));
    // const data = await getDocs(q);
    // console.log(data);
    // setDocumentData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    setDocumentData(props.documentData);
  }

  const columns = [
    {
      field: 'date',
      headerName: 'Date',
      type: 'string',
      width: 120,
    },
    {
      field: 'enrollment',
      headerName: 'Enrollment',
      width: 120,
    },
    {
      field: 'firstname',
      headerName: 'First name',
      width: 130
    },
    {
      field: 'lastname',
      headerName: 'Last name',
      width: 130
    },
    {
      field: 'catagory',
      headerName: 'Catagory',
      width: 160,
    },
    {
      field: 'title',
      headerName: 'Title',
      width: 180,
    },

    {
      field: 'highlight',
      headerName: 'Highlight',
      width: 90,
    },
    {
      field: 'modal',
      headerName: 'Action',
      width: 110,
      renderCell: (params) => <CountButton id={params.row} getId={getId} />
    },
    {
      field: 'modal1',
      headerName: 'Action',
      width: 110,
      renderCell: (params) => <ModelFun id={params.row} />
    },
  ];
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

  // edit starts

  const [isChecked, setIsChecked] = useState(false);
  const [date, SetDate] = useState("");
  const [firstname, SetFname] = useState("");
  const [lastname, SetLname] = useState("");
  const [title, SetTitle] = useState("");
  const [description, SetDescription] = useState("");
  const [editcatagory, SetEditCatagory] = useState("");
  const [updateDocId, SetId] = useState("");
  const [role, SetRole] = useState("");
  const [name, SetName] = useState("");
  const [DeleteToast, SetDeleteToast] = useState(false);
  const [HighlightToast, SetHighLightToast] = useState(false);
  const [UploadProgress, SetUploadProgress] = useState(0);
  const [Formcatagory, setcatagory] = useState("");
  const [publisherName, SetPublisherName] = useState("");
  const [publisherEmail, SetPublisherEmail] = useState("");
  const [startDate, SetStartDate] = useState("");
  const [endDate, SetEndDate] = useState("");
  const [file, setFile] = useState();
  const [highlightCheck, setHighlightCheck] = useState("");
  const [highlightTitle, setHighlightTitle] = useState("");
  const [highlightDesc, setHighlightDesc] = useState("");

  // const GetDocumentInTimeSpan = async (e) => {
  //   e.preventDefault();
  //   if (startDate === "" && endDate === "") {
  //     alert("please select span")
  //   } else {
  //     let q;
  //     q = query(userDataCollectionRefDocumentData, where('date', '>=', startDate), where('date', '<=', endDate));
  //     const data = await getDocs(q);
  //     console.log(startDate, endDate);
  //     setDocumentData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  //   }
  // }

  // GET DOCUMENT IN TIME SPAN FOR STUDENT DATA
  const GetDocumentInTimeSpan = async (e) => {
    e.preventDefault();
    if (startDate === "" && endDate === "") {
      alert("please select span")
    } else {
      let q;
      q = query(userDataCollectionRefDocumentData, where('date', '>=', startDate), where('date', '<=', endDate), where('uploads', '==', 'Student'));
      const data = await getDocs(q);
      console.log(startDate, endDate);
      setDocumentData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }
  }

  const handleCancleEdit = () => {
    setEditId("");
    SetFname("");
    SetLname("");
    SetTitle("");
    setcatagory("");
    SetDate("");
    SetDescription("");
    setHighlightTitle("");
    setHighlightDesc("");
    setHighlightCheck("");
  }
  const UpdateData = async (id) => {
    let activityDetail = {};
    const docdata = doc(db, `DocumentData`, id);
    const docSnap = await getDoc(docdata);
    activityDetail = docSnap.data();
    console.log(activityDetail);
    SetFname(activityDetail.firstname);
    SetLname(activityDetail.lastname);
    SetTitle(activityDetail.title);
    SetDescription(activityDetail.description);
    SetEditCatagory(activityDetail.catagory);
    SetDate(activityDetail.date);
    SetId(id);
    setHighlightCheck(activityDetail.highlight);
    if (activityDetail.highlight === "True" || activityDetail.highlight === "OutDated") {
      setHighlightTitle(activityDetail.highlightTitle);
      setHighlightDesc(activityDetail.highlightDesc);
    }
  }

  const DeleteData = async (id) => {
    const docdata = doc(db, "DocumentData", id);
    try {
      await deleteDoc(docdata);
      console.log("Data deleted successfully");
      SetDeleteToast(true)
    } catch (error) {
      console.log(error);
    }
  }

  const onUpdateData = async (e) => {
    e.preventDefault();
    const docdata = doc(db, `DocumentData`, updateDocId);
    let obj = {};
    if (highlightCheck !== "True") {
      obj = {
        firstname: firstname,
        lastname: lastname,
        title: title,
        catagory: editcatagory,
        date: date,
        description: description,
        highlight: highlightCheck,
      }
    } else {
      obj = {
        firstname: firstname,
        lastname: lastname,
        title: title,
        catagory: editcatagory,
        date: date,
        description: description,
        highlight: highlightCheck,
        highlightTitle: highlightTitle,
        highlightDesc: highlightDesc,
      }
    }
    try {
      await updateDoc(docdata, Object.assign({}, obj));
      handleClick();
      getDocumentData();
      setEditId("");
      SetFname("");
      SetLname("");
      SetTitle("");
      setcatagory("");
      SetDate("");
      SetDescription("");
      setHighlightTitle("");
      setHighlightDesc("");
      setHighlightCheck("");
    }
    catch (error) {
      console.log(error);
    }
  }
  const getId = (id) => {
    setEditId(id)
    console.log(id)
    UpdateData(id)
  }


  const handleFile = (event) => {
    console.log(event.target.files[0]);
    setFile(event.target.files[0]);
  }


  // modal - show all data in table
  // highlight ristriction
  // use form
  // 

  useEffect(()=>{
    getDocumentData();
  },[])


  return (
    <Container sx={{ py: 1 }} >
      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 2, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField value={startDate} onChange={(e) => { SetStartDate(e.target.value) }} type='date' id="standard-basic" size='small' /> TO
        <TextField value={endDate} onChange={(e) => { SetEndDate(e.target.value) }} type='date' id="standard-basic" size='small' />
        <Button onClick={(e) => { GetDocumentInTimeSpan(e) }} style={{ color: "white", backgroundColor: "purple" }}>TIMESPAN</Button>
        <Button onClick={(e) => { getDocumentData(); SetStartDate(""); SetEndDate("") }} color='secondary' variant='outlined'>RESET</Button>
      </Box>

      <DataGrid
        style={{ height: "450px" }}
        rowsPerPageOptions={[5]}
        rows={documentData.filter(dataa => dataa.uploads === "Student")}
        columns={columns}
        pageSize={5}
        checkboxSelection
        components={{
          Toolbar: CustomToolbar,
        }}
      />
      {
        editId !== "" ? <Grid container spacing={2}>
          <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
            <Paper id="scroll" variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
              <Typography component="h1" variant="h4" align="center">
                Edit Mode
              </Typography>
              <React.Fragment>
                <React.Fragment>
                  <Box component="form" noValidate sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField required id="firstName" onChange={(e) => { SetFname(e.target.value) }} name="firstName" value={firstname} label="First name" fullWidth autoComplete="given-name" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField required id="lastName" name="lastName" onChange={(e) => { SetLname(e.target.value) }} value={lastname} label="Last name" fullWidth autoComplete="family-name" />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-standard-label">Achievement Catagory</InputLabel>
                          <Select labelId="demo-simple-select-standard-label" id="catagory" value={editcatagory} onChange={(e) => { setcatagory(e.target.value) }} label="Achievement Catagory">
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
                      </Grid>
                      <Grid item xs={12}>
                        <TextField required id="title" name="title" onChange={(e) => { SetTitle(e.target.value) }} value={title} label="Achievement Title" fullWidth autoComplete="title" />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField required id="description" name="description" onChange={(e) => { SetDescription(e.target.value) }} value={description} label="description" fullWidth autoComplete="description" multiline />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField type="date" onChange={(e) => { SetDate(e.target.value) }} value={date} id="datein" fullWidth></TextField>
                      </Grid>
                      <Grid item xs={12} >
                        <input type="file" className="form-control" onChange={(e) => { handleFile(e) }} />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={<Checkbox checked={highlightCheck === "True" ? true : false} onChange={() => { highlightCheck === "True" ? setHighlightCheck("False") : setHighlightCheck("True") }} color="secondary" name="saveAddress" value="yes" />}
                          label="Highlight This Achievement"
                        />
                      </Grid>
                      {
                        highlightCheck === "True" || highlightCheck === "OutDated" ? <>
                          <Grid item xs={12}>
                            <TextField required id="htitle" name="htitle" onChange={(e) => { setHighlightTitle(e.target.value) }} value={highlightTitle} label="Highlight Title" fullWidth />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField required id="hdescription" name="hdescription" onChange={(e) => { setHighlightDesc(e.target.value) }} value={highlightDesc} label="Highlight description" fullWidth multiline />
                          </Grid>
                        </> : <></>
                      }
                    
                    <Grid item xs={6}>
                      <Button onClick={(e) => { onUpdateData(e) }} variant="contained" >
                        submit
                      </Button>
                    </Grid>
                    <Grid item xs={6} display='flex' justifyContent="flex-end">
                      <Button onClick={() => { handleCancleEdit() }}>Cancle</Button>
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
        </Grid> : <></>
      }
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Updated Successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
}