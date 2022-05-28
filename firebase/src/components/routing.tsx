import { NextRouter, useRouter } from "next/router"
import { useEffect, useState } from "react"
import { AuthenticationState } from "../authentication/auth-slice"
import { Role, useAuthentication, useRoles } from "../authentication/hooks"

export type MenuItemVisibility = "ALWAYS_HIDDEN" | "DISPLAYABLE"

export type MenuItem = {
    url: string,
    title: string,
    isAllowed: (roles: Array<Role>) => boolean,
    menuItemVisibility: MenuItemVisibility
}

export const periodicTaskReader = (roles: Array<Role>):boolean => {
    return roles.includes("admin") || roles.includes("user")
}

export const menuItems: Array<MenuItem> = [
    { url: "", title: "Strona główna", isAllowed: () => true , menuItemVisibility:"DISPLAYABLE"},
    { url: "login", title: "Logowanie", isAllowed: () => true , menuItemVisibility:"ALWAYS_HIDDEN"},
    { url: "noPrivs", title: "Brak uprawnień", isAllowed: () => true, menuItemVisibility:"ALWAYS_HIDDEN"},
    { url: "periodicTasks", title: "Zadania", isAllowed: periodicTaskReader ,menuItemVisibility:"DISPLAYABLE"}
]

type RESOLUTION = "NEEDS_LOGIN" | "LOGGED_LACK_OF_PRIVS" | "OK"
export type RedirectTo = {
    url:string
}
export type RedirectionPolicy = RedirectTo | "DontRedirect"
export const canDisplay = ():RedirectionPolicy => {
    const router = useRouter()
    const auth = useAuthentication()
    const roles = useRoles()
    const path = router.asPath
    const [redirectionPolicy,setPolicy] = useState<RedirectionPolicy>("DontRedirect")

    useEffect(() => {
        const decision = canDisplayPath(router, auth, roles)
        switch (decision) {

        }
        if (decision == "OK") {
            setPolicy("DontRedirect")
            return;
        } else if (decision == "NEEDS_LOGIN") {
            setPolicy({url:"/login"})
        } else if (decision == "LOGGED_LACK_OF_PRIVS") {
            setPolicy({url:"/noPrivs"})
        } else {
            throw new Error("TODO")
        }
    }, [path, auth, roles])
    return redirectionPolicy
}


const canDisplayPath = (router: NextRouter, auth: AuthenticationState, roles: Array<Role>): RESOLUTION => {
    const canAccessBasedOnRoles = menuItems.filter(menu => "/" + menu.url === router.asPath).some(menu => menu.isAllowed(roles))
    if (canAccessBasedOnRoles) {
        return "OK"
    }
    if (auth.authenticated) {
        return "LOGGED_LACK_OF_PRIVS"
    } else {
        return "NEEDS_LOGIN"
    }
}
