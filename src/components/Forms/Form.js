import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CardContent from '@mui/material/CardContent';
import { auth, db } from "../../FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import rightSvg from '../../images/c1.svg';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import Department from './Department';
import Faculty from './Faculty';
import Student from './Student';
import NoticeBoard from './NoticeBoard';


const theme = createTheme();

export default function Achievement() {
    const navigate = useNavigate();
    const [form, setForm] = useState("department");
    const [show, setShow] = useState(false);
    const [role, SetRole] = useState("");

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                // BELOW CODE TO CHECK WHETHER USER IS ADMIN OR NOT
                // IF ADMIN THEN SHOW DEPARTMENTAL ACTIVITY AND FACULTY ACHIEVEMENT ELSE SHOW ONLY STUDENT ACHIEVEMNT
                const docdata = doc(db, `Users`, user.uid);
                const data = await getDoc(docdata);
                if (data.data().role === "Admin" || data.data().role === "Team Member") {
                    SetRole("Admin");
                }
                else if (data.data().role === "Student") {
                    SetRole("Student");
                }
            }
            else {
                navigate("/signIn");
            }
        })
    }, [])


    const handleChangeF = (event) => {
        setForm(event.target.value);
    };

    return (
        <div>
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="sm" sx={{ pt: 3 }}>
                    {
                        role === "Admin" ?
                            <Card sx={{ minWidth: 275 }}>
                                <CardContent>
                                    <FormControl variant="outlined" fullWidth>
                                        <InputLabel id="demo-simple-select-standard-label">Your Role</InputLabel>
                                        <Select labelId="demo-simple-select-standard-label" id="catagory" value={form} onChange={(e) => { setForm(e.target.value) }} label="Achievement Catagory">
                                            <MenuItem value={'department'}>DEPARTMENTAL ACTIVITIES</MenuItem>
                                            <MenuItem value={'student'}>STUDENT'S ACHIEVEMENT</MenuItem>
                                            <MenuItem value={'faculty'}>FACULTY'S ACHIVEMENT</MenuItem>
                                            <MenuItem value={'noticeBoard'}>NOTICE BOARD EVENTS</MenuItem>
                                        </Select>
                                    </FormControl>
                                </CardContent>
                            </Card>
                            : <> </>
                    }
                </Container>
                {
                    role === "Student" ? 
                        <Box
                            sx={{
                                marginTop: 2,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Box sx={{ flexGrow: 1 }}>
                                <Grid container spacing={5}>
                                    <Grid item xs={12} sm={6}>
                                        <Student />
                                    </Grid>
                                    <Grid item xs={12} sm={6} sx={{ display: { xs: 'none', sm: 'block' } }}>
                                        <img src={rightSvg} alt='contact' style={{ width: '100%', height: '100%' }}></img>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                        : <> </>
                }
                {
                    !form ? <></> :
                        form === "department" && (role === "Admin" || role === "Team Member") ?
                            <Department /> :
                            form === "faculty" ?
                                <Faculty /> :
                                form === "student" ?
                                    <Student /> :
                                    form === "noticeBoard" ?
                                        <NoticeBoard /> : <></>
                }

            </ThemeProvider>
            <ToastContainer position="top-center" className="p-3">
                <Toast bg="primary" onClose={() => setShow(false)} show={show} delay={10000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">React JS</strong>
                        <small className="text-muted">just now</small>
                    </Toast.Header>
                    <Toast.Body>Data Successfully added.</Toast.Body>
                </Toast>
            </ToastContainer>
        </div >
    );
}
