import { useAuthentication } from "../authentication/hooks"
import styles from './UserShortInfo.module.css'
import { useRouter } from 'next/router'

export const UserShortInfo = () => {
    const router = useRouter()
    const { authenticated, data } = useAuthentication()

    const redirectToLogin = () => router.push('/login')

    return (
        <div className={styles.UserShortInfo} onClick={() => redirectToLogin()}>
            {authenticated && <p className={styles.username}>{data.username}</p>}
            {authenticated && data.photoUrl && <img className={styles.image} src={data.photoUrl}></img>}
            {!authenticated && <p className={styles.login}>Log in</p>}
        </div>
    )
}