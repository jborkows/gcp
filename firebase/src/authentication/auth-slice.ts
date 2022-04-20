import { createSlice, PayloadAction } from '@reduxjs/toolkit'


export interface UserData {
    username: string
    email: string
    photoUrl: string | null
}

// Define a type for the slice state
interface AuthenticationState {
  authenticated: boolean
  data: UserData
}

// Define the initial state using that type
const initialState: AuthenticationState = {
  authenticated: false,
  data: null
}

export const authenticationSlice = createSlice({
  name: 'authentication',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    logged: (state, action: PayloadAction<UserData>) => {
      state.authenticated = true
      state.data = action.payload
    },
    unlogged: (state)=> {
      state.authenticated = false
      state.data = null
    }
  },
})

export const { logged,unlogged } = authenticationSlice.actions
export const authenticationSliceReducer = authenticationSlice.reducer
