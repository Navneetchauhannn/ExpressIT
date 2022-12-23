import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { NavLink, useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from "../FirebaseConfig.js";
import { collection, getDocs, query, where } from "firebase/firestore";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
// import side from './1.png';
import Footer from './HomePageComponents/Footer';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

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

function SignInSide() {
  const navigate = useNavigate();
  const [email, SetEmail] = useState("");
  const [error, SetError] = useState("");
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (email && values.password) {
      try {
        // if (Role === "Admin") {
        let q;
        q = query(userDataCollectionRef, where('email', '==', email));
        const data = await getDocs(q);
        const userData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        if (data.docs.length === 0) {
          console.log("NO access");
          throw new Error("Error: Invalid Credential");
        } else if (userData[0].role === 'Admin') {
          localStorage.setItem("1111", "111");
        } else if (userData[0].role === 'Team Member') {
          localStorage.setItem("1111", "101");
        } else if (userData[0].role === 'Student') {
          localStorage.setItem("1111", "011");
        }
        else {
          console.log("No Role");
        }
        try {
          await signInWithEmailAndPassword(auth, email, values.password);
          SetEmail("");
          navigate("/");
        }
        catch (err) {
          SetError(err.message);
          console.log(err.message);
        }
      }
      catch (error) {
        SetError(error.message)
        console.log(error)
      }
    }
    else {
      SetError("Please fill mandatory fields");
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);
        console.log("Sended");
      }
      catch (error) {
        console.log("Error");
      }
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7}
          sx={{
            // backgroundImage: `url(${side})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">Sign in</Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <FormControl sx={{ m: 1 }} fullWidth variant="outlined">
                <TextField margin="normal" required onChange={(e) => { SetEmail(e.target.value) }} id="email" label="Email Address" name="email" autoComplete="email" autoFocus />
              </FormControl>
              {/* <TextField margin="normal" required onChange={(e) => { SetPassword(e.target.value) }} fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" />
             */}

              <FormControl sx={{ m: 1 }} fullWidth variant="outlined">
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
              <FormControl sx={{ m: 1 }} variant="outlined">
                <Button
                  type="submit"
                  style={{ backgroundColor: "purple" }}
                  variant="contained"
                  sx={{ mb: 2 }}
                >
                  Sign In
                </Button>
                <Button
                  style={{ backgroundColor: "purple" }}
                  variant="contained"
                  sx={{ mb: 2 }}
                  onClick={(e) => { resetPassword(e) }}
                >
                  Reset password
                </Button>
              </FormControl>
              <FormControl sx={{ display: 'block', ml: 1 }}>
                <NavLink to={'/signUp'}>
                  Don't have an account? Sign Up
                </NavLink>
              </FormControl>
              {/* <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="demo-simple-select-helper-label">Role</InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={Role}
                  label="Role"
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={'Admin'}>Admin</MenuItem>
                  <MenuItem value={'Team Member'}>Team Member</MenuItem>
                  <MenuItem value={'Student'}>Student</MenuItem>
                </Select>
              </FormControl>
            <FormControlLabel control={<Checkbox value="remember" color="primary" />}
              label="Remember me" /> <br/>
               */}
              {<span style={{ color: "red" }}>{error}</span>} <br />

              <Grid container>
                <Grid item>

                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Footer />
    </ThemeProvider>
  );
}

export default SignInSide;