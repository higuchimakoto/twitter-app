import { makeStyles } from '@material-ui/core'

export const useAuthStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage:
            'url(https://images.unsplash.com/photo-1611162618479-ee3d24aaef0b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80)',
        backgroundRepeat: 'no-repeat',
        backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 1),
    },
    modal: {
        outlined: 'none',
        position: 'absolute',
        width: 400,
        borderRadius: 10,
        backgroundColor: 'white',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(10),
    },
}))
