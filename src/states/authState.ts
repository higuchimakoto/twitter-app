import { atom } from 'recoil'
import { User } from '../types/user'

export const authState = atom<User>({
    key: 'authState',
    default: {
        id: '',
        photoUrl: '',
        displayName: '',
    },
    dangerouslyAllowMutability: true,
})
