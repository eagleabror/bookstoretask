import React from 'react';
import { createTheme, ThemeProvider, Avatar, Button, CssBaseline, TextField, Grid, Box, Typography, Container, CircularProgress, Divider } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { signUserStart, signUserSuccess, signUserFailure } from '../slice/auth'
import AuthService from '../service/auth'
import { useFormik } from 'formik';
import * as Yup from 'yup'
import googleIcon from '../icons/google.svg'
import facebookIcon from '../icons/facebook.svg'

const defaultTheme = createTheme();

export default function Signin() {

  const { isLoading } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      username: '',
      password: ''
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Name is required")
        .min(5, "Min length is 5")
        .max(15, "Max length is 15"),
      email: Yup.string()
        .required("Email is required")
        .email("Invalid email"),
      username: Yup.string()
        .required("Username is required")
        .min(5, "Min length is 5")
        .max(15, "Max length is 15"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Min length is 6")
        .max(15, "Max length is 15"),
    }),
    onSubmit: async (values) => {

      dispatch(signUserStart())

      const user = {
        name: values.name,
        email: values.email,
        key: values.username,
        secret: values.password
      }

      try {
        const response = await AuthService.userRegister(user)
        dispatch(signUserSuccess(response.data))
        navigate('/panel')
      } catch (error) {
        dispatch(signUserFailure(error.response.data.message))
      }
    }
  })

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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}></Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
            <Button
              type="button"
              fullWidth
              variant="outlined"
              sx={{ mt: 3, mb: 2, bgcolor: "#fff", color: "black" }}
            >
              <img src={googleIcon} alt="" />
              Contiune with Google
            </Button>
            <Button
              type="button"
              fullWidth
              variant="outlined"
              sx={{ mb: 2, bgcolor: "#fff", color: "black" }}
            >
              <img src={facebookIcon} alt="" /> 
              Contiune with Facebook
            </Button>
            <Divider>or</Divider>
            <Grid container spacing={1} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  required
                  fullWidth
                  id="name"
                  label="Your name"
                  helperText={formik.touched.name && formik.errors.name}
                  error={formik.touched.name && formik.errors.name}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="email"
                  required
                  fullWidth
                  id="email"
                  label="Enter your email"
                  helperText={formik.touched.email && formik.errors.email}
                  error={formik.touched.email && formik.errors.email}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  required
                  fullWidth
                  id="username"
                  label="Your username"
                  helperText={formik.touched.username && formik.errors.username}
                  error={formik.touched.username && formik.errors.username}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="new-password"
                  required
                  fullWidth
                  id="password"
                  label="Password"
                  type="password"
                  helperText={formik.touched.password && formik.errors.password}
                  error={formik.touched.password && formik.errors.password}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"

              sx={{ mt: 3, mb: 2, bgcolor: "#6200EE" }}
            >
              {isLoading ? <CircularProgress sx={{ color: "white" }} /> : "Register"}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item >
                Already signed in?<Link to="/signup">Go to sign up.</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}