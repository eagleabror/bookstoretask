import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import { createTheme, ThemeProvider, Box, Button, Card, CardActions, CardContent, CircularProgress, Grid, InputBase, InputLabel, Modal, Stack, TextField, Typography, Tooltip, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { startGetData, getDataSucces, getDataFailure, addDataSucces, addDataStart, deleteDataStart, deleteDataSucces, editDataStart } from '../slice/book';
import AuthService from '../service/auth';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import md5 from 'md5';
import createIcon from '../icons/plus.svg'
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
                dispatch(getDataSucces(response.data))
            } catch (error) {
                dispatch(getDataFailure(error?.response?.data.message))
            }
        }
        getAllBooks()
    }, []);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const dispatch = useDispatch()
    const { isLoading, data, addStart } = useSelector(state => state.books)
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
        onSubmit: async (values) => {
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
                        dispatch(getDataSucces(response.data))
                    } catch (error) {
                        dispatch(getDataFailure(error?.response?.data.message))
                    }
                }
                getAllBooks()
            } catch (error) {
                dispatch(getDataFailure(error.response.data.message))
                console.log(error)
            }
        }
    })

    const handleDelete = async (id) => {
        const key = localStorage.getItem('Key')
        const sign = localStorage.getItem('Sign')
        const method = "DELETE"
        const url = `/books/${id}` 
        const secretKey = `${method}${url}${sign}`
        const secret = md5(secretKey)
        const keys = { key: key, sign: secret}
        dispatch(deleteDataStart())

        try {
            const response = await AuthService.bookDelete(keys, id)
            dispatch(deleteDataSucces(response))
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
                    dispatch(getDataSucces(response.data))
                } catch (error) {
                    dispatch(getDataFailure(error?.response?.data.message))
                }
            }
            getAllBooks()
        } catch (error) {
            console.log(error)
        }
    } 

    const handleEdit = async (id) => {
        const key = localStorage.getItem('Key')
        const sign = localStorage.getItem('Sign')
        const method = "PATCH"
        const url = `/books/${id}`
        const secretKey = `${method}${url}${sign}`
        const secret = md5(secretKey)
        const keys = { key: key, sign: secret}
        const edit = {
            "status": 2
        }   

        try {
            const response = await AuthService.bookEdit(keys, id, edit)
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <ThemeProvider theme={defaultTheme} >
                <NavBar />
                {isLoading ?
                    <>
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw"}}>
                            <CircularProgress />
                        </Box>
                    </>

                    :

                    <>
                        <Box pt={10} sx={{ position: "realitive", margin: "auto", maxWidth: "1068px", width: "90%" }}>
                            <Stack
                                sx={{
                                    display: "flex",
                                    justifyContent: { xs: "none", md: "space-between" },
                                }}
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={{ xs: 1, sm: 2, md: 4 }}
                            >
                                <Typography sx={{ color: {xs:"#000", md: "#fff"}, fontSize: "36px" }}>
                                    You’ve got <span style={{ color: "#6200EE" }}>{data == null ? '0' : data.length} book</span>
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                    <TextField sx={{ bgcolor: "#fff", border: "none", borderRadius: "none" }} p={2} fullWidth placeholder='Enter your name' id="published" />
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
                                                    {addStart ? <CircularProgress sx={{ color: "white" }} /> : "Submit"}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Box>
                            </Modal>
                            <Typography sx={{ color: {xs:"#6200EE", md: "#fff"} }}>Your task today</Typography>
                            <Grid container spacing={1} pt={2} item xs={12} sx={{ gap: "1rem" }}>
                                {data == undefined || data.length == 0 ? <h1 style={{ color: "#6200EE" }}>You don't have any Book</h1> :
                                    <>
                                        {data.map((dat) => {
                                            return (
                                                <Tooltip
                                                disableFocusListener
                                                sx={{ bgcolor: "transparent" }}
                                                title={
                                                        <>
                                                            <Grid sx={{display: "flex", flexDirection: "column", gap: "1rem"}}>
                                                                <Grid item xs={12}>
                                                                    <IconButton sx={{bgcolor: "red", borderRadius: "none"}} onClick={() => handleDelete(dat.book.id)}>
                                                                        <DeleteIcon sx={{color: "white"}} />
                                                                    </IconButton>
                                                                </Grid>
                                                            </Grid>  
                                                        </>
                                                    }
                                                    placement="right"
                                                >
                                                    <Card sx={{ maxWidth: 345 }}>
                                                        <CardContent>
                                                            <Typography gutterBottom variant="h5" component="div">
                                                                {dat.book.isbn}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {dat.book.title == '' ? "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Explicabo, expedita." : dat.book.title}
                                                            </Typography>
                                                        </CardContent>
                                                        <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
                                                            <Typography>{dat.book.published}</Typography>
                                                            <Box px={2} py={2} sx={{ bgcolor: "#EFE6FD", height: "15px", borderRadius: "10px", display: "flex", alignItems: "center", gap: "6px", }}>
                                                                <Typography>{dat.book.pages}</Typography>
                                                            </Box>
                                                        </CardActions>
                                                    </Card>
                                                </Tooltip>
                                            )
                                        })}
                                    </>
                                }
                            </Grid>
                        </Box>
                    </>
                }
            </ThemeProvider>
        </>
    )
}

export default BookList