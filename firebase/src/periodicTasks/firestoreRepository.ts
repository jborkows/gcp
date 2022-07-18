import { collection, doc, Firestore, FirestoreDataConverter, getDocs, QueryDocumentSnapshot, setDoc } from "firebase/firestore";
import { PeriodicTaskCreation } from "./commands";
import { PeriodicTaskCompletionData } from "./domain";
import { EachDay, EachNDay, PeriodicTaskId, TaskState } from "./model";
import { Repository } from "./service";



const taskStateConverter: FirestoreDataConverter<TaskState> = {
  toFirestore: (any) => {
    throw new Error("Not used")
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: snapshot.id,
      ruleDescription: data.ruleDescription,
      nextExecution: data.nextExecution,
      lastExecution: data.lastExecution
    }
  }
};

export class FirebaseRepository implements Repository {
  private _table: string;

  constructor(readonly firestoreProvider: () => Firestore) {
    this._table = "PeriodicTask"
  }



  async create(p: PeriodicTaskCreation): Promise<PeriodicTaskId> {
    //     name: string,
    //     description: string
    //     rule: Rule
    // readonly nextExecution: Temporal.PlainDate,
    // readonly lastExecution: { at: Temporal.PlainDate, by: User, comment: string | null } | null

    const ruleType = () => {
      if (p.rule instanceof EachNDay) {
        return "EachNDay"
      } else if (p.rule instanceof EachDay) {
        return "EachDay"
      } else {
        throw new Error("Not implemented yet")
      }
    }

    await setDoc(doc(this.firestoreProvider(), this._table, p.name), {
      description: p.description,
      ruleDescription: p.rule.description(),
      ruleType: ruleType(),
      howManyDays: p.rule instanceof EachNDay ? p.rule.howMany : null
    });
    return p.name
  }
  update(id: string, p: PeriodicTaskCompletionData): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async list(): Promise<TaskState[]> {
    const taskStatesRef = collection(this.firestoreProvider(), this._table).withConverter(taskStateConverter);
    const quired = await getDocs(taskStatesRef);
    return quired.docs.map(x=>x.data())
    // const data = asArray(quired)
    // return data;
    // let results:Array<TaskState> = []
    // quired.forEach(result => {
    // results.push(result.data())
    // })
    // return results;
    
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

interface ArrayReady<T> {
  forEach(callback: (result: QueryDocumentSnapshot<T>) => void, thisArg?: unknown): void;
}

export function asArray<T>(obj: ArrayReady<T>): Array<T> {
  let result = new Array<T>()
  //@ts-ignore
  obj.forEach((elem: T) => {
    //@ts-ignore
    result.push(elem.data());
  });
  return result
}