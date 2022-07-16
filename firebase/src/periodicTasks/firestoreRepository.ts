import { PeriodicTaskCreation } from "./commands";
import { PeriodicTaskCompletionData } from "./domain";
import { PeriodicTaskId, TaskState } from "./model";
import { Repository } from "./service";
import { doc, Firestore, getFirestore, query, setDoc, collection, getDocs } from "firebase/firestore"; 
import { Auth } from "firebase/auth";
import { getApp } from "firebase/app";



export class FirebaseRepository implements Repository {
    private _table: string;

    constructor(readonly firestoreProvider:()=>Firestore){
        this._table="PeriodicTask"
    }


    async create(p: PeriodicTaskCreation): Promise<PeriodicTaskId> {
    //     name: string,
    //     description: string
    //     rule: Rule
    // readonly nextExecution: Temporal.PlainDate,
    // readonly lastExecution: { at: Temporal.PlainDate, by: User, comment: string | null } | null

        await setDoc(doc(this.firestoreProvider(), this._table , p.name), {
            description: p.description,
          });
        return p.name
    }
    update(id: string, p: PeriodicTaskCompletionData): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async list(): Promise<TaskState[]> {
        const taskStatesRef = collection(this.firestoreProvider(), this._table);
        const quired = await getDocs(taskStatesRef) ;
        return [] as TaskState[]
    }
    findById(id: string): Promise<PeriodicTaskCompletionData> {
        throw new Error("Method not implemented.");
    }


}


// const db = getFirestore(getApp());
// let x = new FirebaseRepository(()=>db)
/*
import { doc, onSnapshot } from "firebase/firestore";

const unsub = onSnapshot(
  doc(db, "cities", "SF"), 
  { includeMetadataChanges: true }, 
  (doc) => {
    // ...
  });


  import { collection, query, where, onSnapshot } from "firebase/firestore";

const q = query(collection(db, "cities"), where("state", "==", "CA"));
const unsubscribe = onSnapshot(q, (querySnapshot) => {
  const cities = [];
  querySnapshot.forEach((doc) => {
      cities.push(doc.data().name);
  });
  console.log("Current cities in CA: ", cities.join(", "));
}, (error)=>{...});
*/