import React, { useEffect } from 'react'
import { useAuthStyles } from '../styles/useAuthStyles'
import { css } from '@emotion/react'

import {
    Avatar,
    Box,
    Button,
    CssBaseline,
    Grid,
    IconButton,
    Modal,
    Paper,
    TextField,
    Typography,
} from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { auth, provider, storage } from '../firebase'
import { useState } from 'react'
import { AccountCircle, Camera, EmailOutlined, SendOutlined } from '@material-ui/icons'
import { useSetRecoilState } from 'recoil'
import { authState } from '../states/authState'

const getModalStyle = () => {
    const top = 50
    const left = 50

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    }
}

export const Auth = () => {
    const classes = useAuthStyles()
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [avatarImage, setAvatarImage] = useState<File | null>(null)
    const setAuthUser = useSetRecoilState(authState)
    const [openModal, setOpenModal] = useState(false)
    const [resetEmail, setResetEmail] = useState('')

    const sendResetEmail = async (e: React.MouseEvent<HTMLElement>) => {
        await auth
            .sendPasswordResetEmail(resetEmail)
            .then(() => {
                setOpenModal(false)
                setResetEmail('')
            })
            .catch((err) => {
                alert(err.message)
                setResetEmail('')
            })
    }

    const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        // nullまたはundifinedではないと通知する
        if (e.target.files![0]) {
            setAvatarImage(e.target.files![0])
            e.target.value = ''
        }
    }

    const signInEmail = async () => {
        await auth.signInWithEmailAndPassword(email, password)
    }

    const signUpEmail = async () => {
        const authUser = await auth.createUserWithEmailAndPassword(email, password)
        let url = ''
        if (avatarImage) {
            const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
            const N = 16
            const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
                .map((n) => S[n % S.length])
                .join('')
            const fileName = randomChar + '_' + avatarImage.name
            await storage.ref(`avatars/${fileName}`).put(avatarImage)
            url = await storage.ref('avatars').child(fileName).getDownloadURL()
        }
        await authUser.user?.updateProfile({
            displayName: username,
            photoURL: url,
        })
        setAuthUser({
            displayName: username,
            photoUrl: url,
        })
    }

    const signInGoogle = async () => {
        await auth.signInWithPopup(provider).catch((err) => alert(err.message))
    }

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        {isLogin ? 'Login' : 'Register'}
                    </Typography>
                    <form className={classes.form} noValidate>
                        {!isLogin && (
                            <>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    autoComplete="username"
                                    autoFocus
                                    value={username}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setUsername(e.target.value)
                                    }}
                                />
                                <Box textAlign="center">
                                    <IconButton>
                                        <label>
                                            <AccountCircle
                                                fontSize="large"
                                                css={avatarImage ? login_addIconLoaded : login_addIcon}
                                            />
                                            <input css={login_hiddenIcon} type="file" onChange={onChangeImageHandler} />
                                        </label>
                                    </IconButton>
                                </Box>
                            </>
                        )}
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        />
                        <Button
                            disabled={
                                isLogin
                                    ? !email || password.length < 6
                                    : !username || !email || password.length < 6 || !avatarImage
                            }
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            startIcon={<EmailOutlined />}
                            onClick={
                                isLogin
                                    ? async () => {
                                          try {
                                              await signInEmail()
                                          } catch (err: any) {
                                              alert(err.message)
                                          }
                                      }
                                    : async () => {
                                          try {
                                              await signUpEmail()
                                          } catch (err: any) {
                                              alert(err.message)
                                          }
                                      }
                            }
                        >
                            {isLogin ? 'Login' : 'Register'}
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <span css={login_reset} onClick={() => setOpenModal(true)}>
                                    Forgot password?
                                </span>
                            </Grid>
                            <Grid item>
                                <span css={login_toggleMode} onClick={() => setIsLogin(!isLogin)}>
                                    {isLogin ? 'Create new account ?' : 'Back to login'}
                                </span>
                            </Grid>
                        </Grid>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            startIcon={<Camera/>}
                            className={classes.submit}
                            onClick={signInGoogle}
                        >
                            SignIn With Google
                        </Button>
                    </form>
                    <Modal open={openModal} onClose={() => setOpenModal(false)}>
                        <div style={getModalStyle()} className={classes.modal}>
                            <div css={login_modal}>
                                <TextField
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    type="email"
                                    name="email"
                                    label="Reset E-mail"
                                    value={resetEmail}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setResetEmail(e.target.value)}
                                />
                                <IconButton onClick={sendResetEmail}>
                                    <SendOutlined />
                                </IconButton>
                            </div>
                        </div>
                    </Modal>
                </div>
            </Grid>
        </Grid>
    )
}

const login_toggleMode = css`
    cursor: pointer;
    color: #0000ff;
`

const login_modal = css`
    text-align: center;
`

const login_reset = css`
    cursor: pointer;
`

const login_hiddenIcon = css`
    text-align: center;
    display: none;
`

const login_addIcon = css`
    cursor: pointer;
    color: gray;
`

const login_addIconLoaded = css`
    cursor: pointer;
    color: whitesmoke;
`
