import { useAppSelector, useAppDispatch } from '../app/hooks'


export const useAuthentication = ()=>{
    const state = useAppSelector(state => state.authenticationSliceReducer)
    return state
}

