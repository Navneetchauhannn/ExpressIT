import React, { useState, useEffect } from 'react';
import { Controller, useForm } from "react-hook-form";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import { FormControlLabel } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../FirebaseConfig.js";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import rightSvg from '../../images/c1.svg'

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const theme = createTheme();

export default function JoinTeam() {
    const [id, setId] = useState("");
    const userDataCollectionRefContactData = collection(db, "Contacts");
    const [alert, setAlert] = useState("");
    const { handleSubmit, reset, control } = useForm();

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                setId(user.uid);
            }
        })
    }, [])

    // snack bar functions 
    const [open, setOpen] = React.useState(false);
    const handleClick = (alert) => {
        setAlert(alert);
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };



    const onSubmit = async (data) => {
        if (data.enrollment && data.name && data.message && data.phone) {
            data.marked = false;
            data.date = new Date(Date.now()).toDateString();
            try {
                if (id !== "") {
                    await setDoc(doc(userDataCollectionRefContactData, id), data);
                } else {
                    await addDoc(userDataCollectionRefContactData, data);
                }
                handleClick('sucess');
            }
            catch (error) {
                handleClick('error');
                console.log(error);
            }
        }
        else {
            handleClick('info');
        }
    };

    return (
        <>

            <ThemeProvider theme={theme}>

                <Container component="main">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 5,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Box sx={{ flexGrow: 1 }}>
                            <Grid container spacing={7}>
                                <Grid item xs={12} sm={6} sx={{ ml: { xs: "auto", sm: -6.5 }, mr: { xs: "auto", sm: 6 } }}>
                                    <h2 style={{ paddingTop: "10px" }}>
                                        Contact Us
                                        <div className="line"></div>
                                    </h2>
                                    <Box component="form" noValidate sx={{ mt: 3 }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Controller
                                                    name={"name"}
                                                    control={control}
                                                    render={({ field: { onChange, value } }) => (
                                                        <TextField
                                                            autoComplete="name"
                                                            name="name"
                                                            required
                                                            fullWidth

                                                            id="name"
                                                            label="Your Name"
                                                            onChange={onChange}
                                                            value={value}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>

                                                <Controller
                                                    name={"phone"}
                                                    control={control}
                                                    render={({ field: { onChange, value } }) => (
                                                        <TextField
                                                            required
                                                            fullWidth
                                                            id="phone"

                                                            label="Phone No."
                                                            name="phone"
                                                            autoComplete="phone"
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
                                                            required
                                                            fullWidth
                                                            id="enrollment"

                                                            label="Enrollment Number"
                                                            name="enrollment"
                                                            autoComplete="enrollment"
                                                            onChange={onChange}
                                                            value={value}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>

                                                <Controller
                                                    name={"message"}
                                                    control={control}
                                                    render={({ field: { onChange, value } }) => (
                                                        <TextField
                                                            fullWidth
                                                            id="message"
                                                            label="Message"

                                                            name="message"
                                                            multiline
                                                            onChange={onChange}
                                                            value={value}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            {
                                                id !== "" ? <Grid item xs={12}>

                                                    <Controller
                                                        name={"join"}
                                                        control={control}
                                                        render={({ field: { onChange, value } }) => (
                                                            <FormControlLabel

                                                                control={<Checkbox onChange={onChange} value={value} color="primary" />}
                                                                label="I want to join the team!"
                                                            />
                                                        )}
                                                    />
                                                </Grid> : <></>
                                            }
                                        </Grid>
                                        <Button
                                            variant="contained"
                                            sx={{ mt: 2, mb: 2 }}

                                            onClick={handleSubmit(onSubmit)}
                                        >
                                            Submit
                                        </Button>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6} sx={{ display: { xs: 'none', sm: 'block' } }}>
                                    <img src={rightSvg} alt='contact' style={{ width: '100%', height: '100%' }}></img>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
                <Snackbar open={open} autoHideDuration={6000} onClose={() => { handleClose() }}>
                    {
                        alert === 'sucess' ? <Alert onClose={() => { handleClose() }} severity="success" sx={{ width: '100%' }}>
                            Message sent!
                        </Alert> : alert === 'info' ? <Alert onClose={() => { handleClose() }} severity="info" sx={{ width: '100%' }}>
                            All fields are required
                        </Alert> :
                            <Alert onClose={() => { handleClose() }} severity="error" sx={{ width: '100%' }}>
                                Enable to send
                            </Alert>
                    }
                </Snackbar>
            </ThemeProvider>
        </>
    );
}