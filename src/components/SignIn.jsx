import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import googleIcon from '../icons/google.svg'
import facebookIcon from '../icons/facebook.svg'
import md5 from "md5"; 
import {signUserFailure, signUserStart, signUserSuccess} from '../slice/auth'
import AuthService from '../service/auth'
import { useSelector, useDispatch} from 'react-redux'

import { Divider } from '@mui/material';
import ValidationError from './validationError';
const defaultTheme = createTheme();

export default function Signin() {

  const dispatch = useDispatch()
  const {isLoading, loggedIn} = useSelector(state => state.auth)
  const navigate = useNavigate()

  const [signError, setSignError] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data?.get('firstName')
    const email = data?.get('email')
    const key = data?.get('username')
    const secret = data?.get('password')
    if(name == '' || email == '' || key == '' || secret == '' ){
      setSignError(true)
    }else{

      dispatch(signUserStart())
      // const method = "POST";
      // const url = "/signup";
      // const secretKey = `${method}${url}${secret}`
      // const sign = md5(secretKey);
      const user = {name: name, email: email, key: key, secret: secret}

      try {
        const response = await AuthService.userRegister(user)
        console.log(response);
        dispatch(signUserSuccess(response.data))
        navigate('/panel')
      } catch (error) {
        dispatch(signUserFailure(error.response.data.message))
        console.log(error)
      }
      // console.log(user)
  }
  };

  return (
    <ThemeProvider theme={defaultTheme} >
      <Container component="main" maxWidth="xs" sx={{
        padding: "1rem 2rem"
      }}>
        <CssBaseline />
        <Box
          p={3}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: '#fff',
            boxShadow: "4px 4px 10px 0px rgba(34, 60, 80, 0.2)",
            borderRadius: 1
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <ValidationError />
          {/* <h1 style={{color: 'red'}}>{signError}</h1> */}
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Button
              type="button"
              fullWidth
              variant="outlined"
              
              sx={{ mt: 3, mb: 2, bgcolor: "#fff", color: "black" }}
            >
              <img src={googleIcon} alt="" /> Contiune with Google
            </Button>
            <Button
              type="button"
              fullWidth
              variant="outlined"
              
              sx={{ mb: 2, bgcolor: "#fff", color: "black" }}
            >
              <img src={facebookIcon} alt="" /> Contiune with Facebook
            </Button>
            <Divider>or</Divider>
            <Grid container spacing={1} sx={{mt: 1}}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="Your name"
                  autoFocus
                  sx={{
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Enter your email"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Your username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              
              sx={{ mt: 3, mb: 2, bgcolor: "#6200EE" }}
            >
              {isLoading ? 'loading...' : 'Register'}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
              Already signed in?<Link to="/signup">Go to sign up.</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}