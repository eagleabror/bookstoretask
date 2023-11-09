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
import { Divider } from '@mui/material';
import googleIcon from '../icons/google.svg'
import facebookIcon from '../icons/facebook.svg'
import { useDispatch, useSelector } from 'react-redux';
import md5 from 'md5';
import { signUserFailure, signUserStart, signUserSuccess } from '../slice/auth';
import AuthService from '../service/auth';
import { useFormik } from 'formik';
import * as Yup from 'yup'

const defaultTheme = createTheme();

export default function Signup() {

  const dispatch = useDispatch()
  const {isLoading, loggedIn} = useSelector(state => state.auth)
  const navigate = useNavigate()

  // const [signData, setSignData] = useState({})

  const [signError, setSignError] = useState(false)

  const formik = useFormik({
    initialValues: {
      key: '',
      sign: ''
    },
    validationSchema: {
      key: Yup.string()
        .required
    }
  })


  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const key = data?.get('username')
    const sign = data?.get('password')
    
    if(key == '' || sign == '' ){
      setSignError(true)
    }else{

      dispatch(signUserStart())
      const method = "GET";
      const url = "/myself";
      const secretKey = `${method}${url}${sign}`
      const secret = md5(secretKey);
      const user = {key: key, sign: secret}

      try {
        const response = await AuthService.userLogin(user)
        console.log(response);
        dispatch(signUserSuccess(response.data))
        navigate('/panel')
        console.log(user)
      } catch (error) {
        dispatch(signUserFailure(error.response.data.message))
        console.log(error)
      }
      console.log(user)
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
            Sign up
          </Typography>
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
                  autoComplete="username"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Your username"
                  autoFocus
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
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                Don't you have account?<Link to="/">Go to sign in.</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}