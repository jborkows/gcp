import { useEffect, useState } from 'react'
import { useAppSelector } from '../app/hooks'
import * as auth from "firebase/auth";

export const useAuthentication = () => {
    const state = useAppSelector(state => state.authenticationSliceReducer)
    return state
}

export type IdToken = string
export type Role = string

export const idToken = async () : Promise<IdToken | null> => await auth.getAuth()!!.currentUser!!.getIdToken()

const fetchRoles = async ():Promise<Array<Role>> => {
    if(!auth.getAuth() || !auth.getAuth()!!.currentUser){
        return []
    }
    const {claims} = await auth.getAuth().currentUser.getIdTokenResult()
    const roles = claims[process.env.NEXT_PUBLIC_USER_PRIVS_CLAIM]
    if((roles instanceof String)){
        return roles.split(",", -1)
    }
    if(!(roles instanceof Array)){
        return []
    }
    return roles
}

export const useRoles = () => {
    const [roles,setRoles] = useState<Array<Role>>([])
    const authentication = useAuthentication()
    useEffect(()=>{
        ( async ()=>{
            if(!authentication.authenticated){
                setRoles([]);
                return;
            }
            const fetched = await fetchRoles()
            setRoles(fetched);
        })()
    }, [authentication.authenticated])
    return roles
}