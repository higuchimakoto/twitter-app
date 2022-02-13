import React from 'react'
import { css } from '@emotion/react'
import { Auth } from './components/Auth'
import { useRecoilState } from 'recoil'
import { authState } from './states/authState'
import { useEffect } from 'react'
import { auth } from './firebase'
import { Feed } from './components/Feed'

const App: React.FC = () => {
    const [user, setUser] = useRecoilState(authState)
    console.log('👉 user', user)
    useEffect(() => {
        const unSub = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                setUser({ id: authUser.uid })
            } else {
                setUser({ id: '' })
            }
        })
        return () => {
            unSub()
        }
    }, [setUser])
    return (
        <>
            {user.id ? (
                <div css={cssApp}>
                    <Feed />
                </div>
            ) : (
                <Auth />
            )}
        </>
    )
}

const cssApp = css`
    .app {
        display: flex;
        height: 100vh;
        padding: 30px 80px;
        background-color: #444447;
    }
`
export default App
