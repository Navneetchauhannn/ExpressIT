import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { NavLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../FirebaseConfig.js";
import { collection, setDoc, doc } from "firebase/firestore";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


import Footer from '../HomePageComponents/Footer';
import Appbar from '../NewAppbar';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

function SignUp() {
  const [firstname, SetFname] = useState("");
  const [lastname, SetLname] = useState("");
  const [email, SetEmail] = useState("");
  const [enrollment, setEnrollment] = useState("");
  const [phone, SetPhone] = useState();
  const [password, SetPassword] = useState("");
  const [privatekey, SetPrivatekey] = useState("");
  const [error, SetError] = useState("");
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const userDataCollectionRef = collection(db, "Users");

  const [values, setValues] = React.useState({
    password: '',
    showPassword: false,
  });
  const handleChangePass = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  

  let myAdminData = {};

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        navigate("/");
      }
    })
  }, [])

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (role === "Admin") {
      if (firstname && lastname && email && phone && values.password && privatekey) {
        myAdminData = {
          firstname: firstname,
          lastname: lastname,
          college: "LD College of Engineering",
          email: email,
          privatekey: privatekey,
          role: role
        }
        try {
          const userr = await createUserWithEmailAndPassword(auth, email, values.password);
          updateProfile(userr.user, { displayName: firstname + " " + lastname });
          try {
            await setDoc(doc(userDataCollectionRef, userr.user.uid), myAdminData);
            console.log("Data added successfuly to firestore");
          }
          catch (error) {
            SetError(error.message);
          }
          console.log(firstname, lastname, email, phone, password, privatekey);
          localStorage.setItem("1111", "111");
          SetFname(""); SetLname(""); SetEmail("");  SetPhone(""); SetPrivatekey("");
        }
        catch (error) {
          SetError(error.message);
        }
      }
      else {
        SetError("Please fill mandatory fields");
        console.log("i executed")
      }
    }
    else if (role === "Team Member") {
      if (firstname && lastname && enrollment && email && phone && values.password && privatekey) {
        myAdminData = {
          firstname: firstname,
          lastname: lastname,
          college: "LD College of Engineering",
          enrollment: enrollment,
          email: email,
          privatekey: privatekey,
          role: role
        }
        try {
          const userr = await createUserWithEmailAndPassword(auth, email, values.password);
            updateProfile(userr.user, { displayName: firstname + " " + lastname });
          try {
            await setDoc(doc(userDataCollectionRef, userr.user.uid), myAdminData);
            console.log("Data added successfuly to firestore");
          }
          catch (error) {
            SetError(error.message);
          }
          console.log(firstname, lastname, email, phone, password, privatekey);
          localStorage.setItem("1111", "101");
          SetFname(""); SetLname(""); SetEmail(""); SetPhone(""); SetPrivatekey("");
        }
        catch (error) {
          SetError(error.message);
        }
      }
      else {
        SetError("Please fill mandatory fields");
      }
    }
   else {
      SetError("Please fill mandatory fields");
      console.log(firstname)
    }
  };


  return (
    <ThemeProvider theme={theme}>
      <Appbar/>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField size="small" autoComplete="given-name" value={firstname} onChange={(e) => { SetFname(e.target.value) }} name="firstName" required fullWidth id="firstName" label="First Name" autoFocus />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField size="small" required fullWidth id="lastName" onChange={(e) => { SetLname(e.target.value) }} label="Last Name" name="lastName" autoComplete="family-name" />
              </Grid>
              <Grid item xs={12} sm={12}>
                <FormControl fullWidth  size="small">
                  <InputLabel id="demo-simple-select-helper-label">Role</InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={role}
                    label="Role"
                    onChange={handleChange}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={'Admin'}>Admin</MenuItem>
                    <MenuItem value={'Team Member'}>Team Member</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField size="small" required fullWidth id="email" onChange={(e) => { SetEmail(e.target.value) }} label="Email Address" name="email" autoComplete="email" />
              </Grid>
              <Grid item xs={12}>
                <TextField size="small" required fullWidth id="phone" label="Phone No" onChange={(e) => { SetPhone(e.target.value) }} name="phone" autoComplete="phone" />
              </Grid>
              <Grid item xs={12}>
              <FormControl  fullWidth variant="outlined" size="small">
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={values.showPassword ? 'text' : 'password'}
                  value={values.password}
                  onChange={handleChangePass('password')}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {values.showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
              </Grid>

              {
                !role ? <> </> :
                  role === "Team Member" ?
                    <>
                      <Grid item xs={12}>
                      <TextField size="small" required fullWidth id="enrollment" onChange={(e) => { setEnrollment(e.target.value) }} label="Enrollment Number" name="enrollment" autoComplete="enrollment" />
                    </Grid>
                    </>
                    : <> </>
              }
              <Grid item xs={12} >
                        <TextField size="small" fullWidth id="institute" value="LD College of Engineering" disabled={true} />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField size="small" required fullWidth name="privatekey" onChange={(e) => { SetPrivatekey(e.target.value) }} label="Private Key" type="password" id="PrivateKey" />
                      </Grid>
              {<Grid item xs={12}>
                <span style={{ color: "red" }}> {error} </span>
              </Grid>}
              <Button
                type="submit"
                fullWidth
                size="small"
                style={{backgroundColor:"purple"}}
                variant="contained"
                sx={{ mt: 3, mb: 2, ml: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <NavLink to={'/signIn'}>
                    Already have an account? Sign in
                  </NavLink>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider >
  );
}

export default SignUp;
