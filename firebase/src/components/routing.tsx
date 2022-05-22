import { NextRouter, useRouter } from "next/router"
import { useEffect } from "react"
import { AuthenticationState } from "../authentication/auth-slice"
import { useAuthentication } from "../authentication/hooks"

export type MenuItem = {
    url: string,
    title: string,
    needsAuth: boolean
}

export const menuItems: Array<MenuItem> = [
    { url: "", title: "Strona główna", needsAuth: false },
    { url: "periodicTasks", title: "Zadania", needsAuth: true }
]

export const canDisplay = () => {
    const router = useRouter()
    const auth = useAuthentication()
    const path = router.asPath

    useEffect(() => {
        if (canDisplayPath(router, auth)) {
            return;
        }

        router.push("/login")

    }, [path, auth])
}

export const canDisplayPath = (router: NextRouter, auth: AuthenticationState) => {

    function needsAuth(path: string) {
        return menuItems.filter(menu => "/" + menu.url === path).some(menu => menu.needsAuth)
    }
    if (auth.authenticated) {
        return true
    }
    return !needsAuth(router.asPath)

}


