import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import * as auth from "firebase/auth";

let postActionA
let providersA

if (process.env.NEXT_PUBLIC_MODE === "production") {
  console.log("Using production")
  postActionA = () => { }
  providersA = [
    auth.GoogleAuthProvider.PROVIDER_ID
  ]
} else {
  postActionA = () => {
    const db = getFirestore();
    connectFirestoreEmulator(db, 'localhost', 8080);
    const auth = getAuth();
    connectAuthEmulator(auth, "http://localhost:9099");
  }
  providersA = [
    auth.GoogleAuthProvider.PROVIDER_ID,
    auth.EmailAuthProvider.PROVIDER_ID
  ]
}

export const postAction = postActionA
console.log("Will use providers " + JSON.stringify(providers))
export const providers = providersA