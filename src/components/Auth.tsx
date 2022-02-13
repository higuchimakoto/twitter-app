import React, { useEffect } from 'react'
import { useAuthStyles } from '../styles/useAuthStyles'

import { Avatar, Button, CssBaseline, Grid, Paper, TextField, Typography } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { auth, provider, storage } from '../firebase'
import { useState } from 'react'
import { EmailOutlined } from '@material-ui/icons'
import { SetterOrUpdater, useSetRecoilState } from 'recoil'
import { authState } from '../states/authState'
import { User } from '../types/user'

export const Auth = () => {
    const classes = useAuthStyles()
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [avatarImage, setAvatarImage] = useState<File | null>(null)
    const setAuthUser = useSetRecoilState(authState)

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
                                <span>Forgot password?</span>
                            </Grid>
                            <Grid item>
                                <span onClick={() => setIsLogin(!isLogin)}>
                                    {isLogin ? 'Create new account ?' : 'Back to login'}
                                </span>
                            </Grid>
                        </Grid>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={signInGoogle}
                        >
                            SignIn With Google
                        </Button>
                    </form>
                </div>
            </Grid>
        </Grid>
    )
}
