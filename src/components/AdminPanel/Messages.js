import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import { collection, getDocs, deleteDoc, getDoc, orderBy, doc, updateDoc, where, limit, query } from "firebase/firestore";
import { auth, db } from "../../FirebaseConfig";
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CheckboxListSecondary() {

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
  
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClickClose = () => {
    setOpenDialog(false);
  };

  //tab
  const [value, setValue] = React.useState(0);

  const handleChange2 = (event, newValue) => {
    setValue(newValue);
  };
  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }


  const [checked, setChecked] = useState([]);
  const [mchecked, setmChecked] = useState([]);
  const [messages, setMessages] = useState([]);
  const [requests, setRequests] = useState([]);
  const [newMassages, setNewMessages] = useState([]);
  const userDataCollectionRefContactData = collection(db, "Contacts");
  const userDataCollectionRef = collection(db, "Users");
  const [action, setAction] = useState("");

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  const handleToggle2 = (value) => () => {
    const currentIndex = mchecked.indexOf(value);
    const newChecked = [...mchecked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setmChecked(newChecked);
  };

  const handleChange = async () => {
    if (action === 'a') {
      let i = checked.length - 1;
      while (i >= 0) {
        let curr = checked[i];
        console.log(curr)
        let docRef = doc(db, "Users", curr.id)
        await updateDoc(docRef, { role: "Team Member" });
        docRef = doc(db, "Contacts", curr.id)
        await updateDoc(docRef, { marked: true });
        
        // let messageData = doc(db, `Contacts`, curr.id);
        // try {
        //   await deleteDoc(messageData);
        //   console.log("Data deleted successfully");
        // } catch(e) {
        //   console.log(e);
        // }
        i--;
      }
      handleClick()
      getContactData();
      setChecked([])
    } else if (action === 'md') {
      console.log(mchecked.length);
      let i = 0;
      while (i < mchecked.length) {
        const messageData = doc(db, `Contacts`, mchecked[i]);
        await updateDoc(messageData, { marked: true });
        mchecked.splice(0,1)
        i++;
      }
      getContactData();
      handleClick()
    } else if (action === 'r') {
      let i = 0;
      while (i < checked.length) {
        const messageData = doc(db, `Contacts`, checked[i].id);
        await updateDoc(messageData, { marked: true });
        checked.splice(0,1)
        i++;
      }
      handleClick()
      getContactData();
      
    } else {
      console.log("wrong button clicked");
    }
  }

  const getContactData = async () => {
    try {
      console.log("contact data");
      const data = await getDocs(userDataCollectionRefContactData);
      setMessages(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })).filter(dataa => dataa.join === false && dataa.marked === true));
      setNewMessages(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })).filter(dataa => dataa.join === false && dataa.marked === false));
      setRequests(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })).filter(dataa => dataa.join === true && dataa.marked===false));
    } catch (er) {
      console.log(er);
    }
  }

  useEffect(() => {
    getContactData();
  }, []);


  return (
    <Box>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange2} textColor="secondary"
        indicatorColor="secondary" aria-label="basic tabs example">
            <Tab label="Requests" {...a11yProps(0)} />
            <Tab label="Messages" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <List dense sx={{ width: '100%', maxWidth: 1000, bgcolor: 'background.paper' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Team Join Requests
            </Typography>
            {requests.map((contact) => {
              const labelId = `checkbox-list-secondary-label-${contact.id}`;
              return (
                <><ListItem alignItems="flex-start" secondaryAction={
                  <Checkbox
                    edge="end"
                    onChange={handleToggle(contact)}
                    checked={checked.indexOf(contact) !== -1}
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                }>
                  <ListItemAvatar>
                    <Avatar alt={`Avatar n°${contact + 1}`} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={contact.name + " (" + contact.enrollment + ") - "+contact.date}
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {contact.phone + " - "}
                        </Typography>
                        {contact.message}
                      </React.Fragment>
                    }
                  />
                  {/* {contact.date} */}
                </ListItem>
                  <Divider variant="inset" component="li" /></>
              );
            })}
            {
              requests.length <= 0 ?
                <ListItem>No Requests</ListItem> : <></>
            }
            {
              checked.length > 0 ?
                <Stack direction="row" spacing={2} style={{ marginTop: "15px", marginLeft: "15px" }}>
                  <Button onClick={() => { setAction('a'); handleClickOpen(); }} variant="contained" color="success">
                    Approve
                  </Button>
                  <Button onClick={() => { setAction('r'); handleClickOpen(); }} variant="outlined" color="error">
                    Reject
                  </Button>
                </Stack> : <></>
            }
          </List>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <List sx={{ width: '100%', maxWidth: 1000, bgcolor: 'background.paper' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              New Messages {"(" + newMassages.length + ")"}
            </Typography>
            {newMassages.map((contact) => {
              const labelId = `checkbox-list-secondary-label-${contact.id}`;
              return (
                <><ListItem alignItems="flex-start" secondaryAction={
                  <Checkbox
                    edge="end"
                    onChange={handleToggle2(contact.id)}
                    checked={mchecked.indexOf(contact.id) !== -1}
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                }>
                  <ListItemAvatar>
                    <Avatar alt={`Avatar n°${contact + 1}`} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={contact.name + " (" + contact.enrollment + ")"}
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {contact.phone + " - "}
                        </Typography>
                        {contact.message}
                      </React.Fragment>
                    }
                  />
                </ListItem>
                  <Divider variant="inset" component="li" /></>
              );
            })}
            {
              newMassages.length <= 0 ?
                <ListItem>No Messages</ListItem> : <></>
            }
            {
              mchecked.length > 0 ?
                <Stack direction="row" spacing={2} style={{ marginTop: "15px", marginLeft: "15px" }}>
                  <Button onClick={() => { setAction('md'); handleClickOpen(); }} variant="contained" color="success">
                    Mark as Read
                  </Button>
                </Stack> : <></>
            }
          </List>
          <List sx={{ width: '100%', maxWidth: 1000, bgcolor: 'background.paper' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Readed Messages
            </Typography>
            {messages.map((contact) => {
              const labelId = `checkbox-list-secondary-label-${contact.id}`;
              return (
                <><ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar alt={`Avatar n°${contact + 1}`} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={contact.name + " (" + contact.enrollment + ")"}
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {contact.phone + " - "}
                        </Typography>
                        {contact.message}
                      </React.Fragment>
                    }
                  />
                </ListItem>
                  <Divider variant="inset" component="li" /></>
              );
            })}
            {
              messages.length <= 0 ?
                <ListItem>No Messages</ListItem> : <></>
            }
          </List>
        </TabPanel>
      </Box>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          success!
        </Alert>
      </Snackbar>
      <Dialog
        open={openDialog}
        onClose={handleClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure about this action?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={()=>{handleClickClose()}}>Disagree</Button>
          <Button onClick={()=>{handleChange(); handleClickClose();}} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}