import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import { Box, Button, Card, CardActions, CardContent, FormControl, Grid, InputBase, InputLabel, Modal, Stack, TextField, Typography } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { alpha, styled } from '@mui/material/styles';
import createIcon from '../icons/plus.svg'
import { useDispatch, useSelector } from 'react-redux';
import md5 from 'md5';
import { startGetData, getDataSucces, getDataFailure, addDataSucces, addDataStart } from '../slice/book';
import AuthService from '../service/auth';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import closeSvg from '../icons/close.svg'

const defaultTheme = createTheme();

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 2,
    m: 0,
    borderRadius: 1
};

const lableStyle = {
   position: 'realitive',
   top: ".5rem"
}

const BookList = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const dispatch = useDispatch()
    const { data } = useSelector(state => state.books)
    const formik = useFormik({
        initialValues: {
            isbn: "",
            title: "",
            author: "",
            cover: "",
            published: "",
            pages: "",
        },
        validationSchema: Yup.object({
            isbn: Yup.string()
                .required("Isbn is required")
                .min(3, "Min length is 3")
                .max(20, "Max length is 20"),
            title: Yup.string().required("Title is required"),
            cover: Yup.string()
                .required("Cover is required")
                .min(4, "Min length is 4"),
            author: Yup.string()
                .required("Author is required")
                .min(2, "Min length is 8")
                .max(20, "Max lenght is 20"),
            published: Yup.string()
                .required("Published required")
                .min(2, "Min length is 8")
                .max(5, "Max lenght is 20"),
            pages: Yup.string()
                .required("Pages required")
                .min(2, "Min length is 8")
                .max(5, "Max lenght is 20"),
        }),
        onSubmit: async (values, helpers) => {
            console.log(values)
            dispatch(addDataStart())
            try {
                const keys = {
                    isbn: values.isbn,
                    title: values.title,
                    cover: values.cover,
                    author: values.author,
                    published: values.published,
                    pages: values.pages
                }

                const key = localStorage.getItem('Key')
                const sign = localStorage.getItem('Sign')
                const method = "POST";
                const url = "/books";
                const secretKey = `${method}${url}${JSON.stringify(keys)}${sign}`
                const secret = md5(secretKey);
                const bookData = { key: key, sign: secret }

                const response = await AuthService.bookCreate(bookData, keys)
                setOpen(false)
                dispatch(addDataSucces(response))
                console.log(response)
                // console.log(keys)
            } catch (error) {

            }
        }
    })

    useEffect(() => {
        const getAllBooks = async () => {
            const key = localStorage.getItem('Key')
            const sign = localStorage.getItem('Sign')
            const method = "GET";
            const url = "/books";
            const secretKey = `${method}${url}${sign}`
            const secret = md5(secretKey);
            const keys = { key: key, sign: secret }
            dispatch(startGetData())
            try {
                const response = await AuthService.bookGet(keys)
                console.log(response);
                dispatch(getDataSucces(response.data))
            } catch (error) {
                dispatch(getDataFailure(error?.response?.data.message))
                console.log(error)
            }
            console.log(keys)
        }
        getAllBooks()
    }, []);

    const handleCreateBook = async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const isbn = data?.get('isbn')
        const title = data?.get('title')
        const cover = data?.get('cover')
        const author = data?.get('author')
        const published = data?.get('published')
        const pages = data?.get('pages')
        const keys = {
            isbn: isbn,
            title: title,
            cover: cover,
            author: author,
            published: published,
            pages: pages
        }
        const key = localStorage.getItem('Key')
        const sign = localStorage.getItem('Sign')
        const method = "POST";
        const url = "/books";
        const secretKey = `${method}${url}${JSON.stringify(keys)}${sign}`
        const secret = md5(secretKey);
        const bookData = { key: key, sign: secret }
        console.log(keys)
        try {
            const response = await AuthService.bookCreate(bookData, keys)
            dispatch(addDataSucces(response))
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <ThemeProvider theme={defaultTheme} >
                <NavBar />
                <Box pt={10} sx={{ position: "realitive", margin: "auto", maxWidth: "1068px", width: "90%" }}>
                    <Stack
                        sx={{
                            display: "flex",
                            justifyContent: { xs: "none", md: "space-between" },
                        }}
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={{ xs: 1, sm: 2, md: 4 }}
                    >
                        <Typography sx={{ color: "#fff", fontSize: "36px" }}>
                            You’ve got <span style={{ color: "#6200EE" }}>7 book</span>
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <TextField sx={{ bgcolor: "#fff"}} p={2} fullWidth placeholder='Enter your name' id="published" />
                            <Button px={2} py={2} variant="contained" sx={{ bgcolor: "#6200EE", padding: '10px 25px' }} onClick={handleOpen}><img src={createIcon} />Create</Button>
                        </Box>
                    </Stack>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        sx={{ maxWidth: 345, position: "realitive", margin: "auto" }}
                        disableScrollLock
                        enableScroll
                    >
                        <Box sx={style}>
                            <Box component="form" onSubmit={formik.handleSubmit} noValidate>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    spacing={2}
                                    pt={2}
                                    sx={lableStyle}
                                >
                                    <Typography>Create a book</Typography>
                                    <Button onClick={handleClose} p={0}><img src={closeSvg} alt="" /></Button>
                                </Stack>
                                <Grid>
                                    <Grid item xs={12} pt={0}>
                                        <InputLabel shrink htmlFor="isbn" sx={lableStyle}>
                                            Isbn
                                        </InputLabel>
                                        <TextField
                                            fullWidth
                                            placeholder='Enter your isbn'
                                            id="isbn"
                                            helperText={formik.touched.isbn && formik.errors.isbn}
                                            error={formik.touched.isbn && formik.errors.isbn}
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            variant="outlined"
                                            // sx={inputStyle}
                                        />
                                    </Grid>
                                    <Grid item xs={12} pt={0}>
                                        <InputLabel shrink htmlFor="title" sx={lableStyle}>
                                            Title
                                        </InputLabel>
                                        <TextField
                                            fullWidth
                                            placeholder='Enter your title'
                                            id="title"
                                            helperText={formik.touched.title && formik.errors.title}
                                            error={formik.touched.title && formik.errors.title}
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} pt={0}>
                                        <InputLabel shrink htmlFor="author" sx={lableStyle}>
                                            Author
                                        </InputLabel>
                                        <TextField
                                            fullWidth
                                            placeholder='Enter your author'
                                            id="author"
                                            helperText={formik.touched.author && formik.errors.author}
                                            error={formik.touched.author && formik.errors.author}
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} pt={0}>
                                        <InputLabel shrink htmlFor="cover" sx={lableStyle}>
                                            Cover
                                        </InputLabel>
                                        <TextField
                                            fullWidth
                                            placeholder='Enter your cover'
                                            id="cover"
                                            helperText={formik.touched.cover && formik.errors.cover}
                                            error={formik.touched.cover && formik.errors.cover}
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} pt={0}>
                                        <InputLabel shrink htmlFor="published" sx={lableStyle}>
                                            Published
                                        </InputLabel>
                                        <TextField
                                            fullWidth
                                            placeholder='Enter your published'
                                            id="published"
                                            type="number"
                                            helperText={formik.touched.published && formik.errors.published}
                                            error={formik.touched.published && formik.errors.published}
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            variant="outlined"
                                            
                                        />
                                    </Grid>
                                    <Grid item xs={12} pt={0}>
                                        <InputLabel shrink htmlFor="pages" sx={lableStyle}>
                                            Pages
                                        </InputLabel>
                                        <TextField
                                            fullWidth
                                            placeholder='Enter your pages'
                                            id="pages"
                                            type="number"
                                            helperText={formik.touched.pages && formik.errors.pages}
                                            error={formik.touched.pages && formik.errors.pages}
                                            onBlur={formik.handleBlur} onChange={formik.handleChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={.5} columns={16}>
                                    <Grid item xs={8} pt={0}>
                                        <Button
                                            // type="submit"
                                            fullWidth
                                            variant="outlined"
                                            sx={{ mt: 3, mb: 2, color: "#6200EE", border: "1px solid #6200EE" }}
                                            onClick={handleClose}
                                        >
                                            Close
                                        </Button>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            sx={{ mt: 3, mb: 2, bgcolor: "#6200EE" }}
                                        >
                                            Submit
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Modal>
                    <Typography sx={{ color: "#fff" }}>Your task today</Typography>
                    <Grid container spacing={1} pt={2} item xs={12} sx={{ gap: "1rem" }}>
                        {data == undefined ? <h1 style={{ color: "#6200EE" }}>You don't have any Book</h1> :
                            <>
                                {data.map((dat) => {
                                    return (
                                        <Card sx={{ maxWidth: 345 }}>
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="div">
                                                    {dat.book.isbn}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Lizards are a widespread group of squamate reptiles, with over 6,000
                                                    species, ranging across all continents except Antarctica
                                                </Typography>
                                            </CardContent>
                                            <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
                                                <Typography>{dat.book.published}</Typography>
                                                <Box px={2} py={2} sx={{ bgcolor: "#EFE6FD", height: "15px", borderRadius: "10px", display: "flex", alignItems: "center", gap: "6px", }}>
                                                    <Typography>{dat.book.pages}</Typography>
                                                </Box>
                                            </CardActions>
                                        </Card>
                                    )
                                })}
                            </>
                        }
                    </Grid>
                </Box>
            </ThemeProvider>
        </>
    )
}

export default BookList