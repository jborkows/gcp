import { DocumentData } from "@firebase/firestore-types";
import { Temporal } from "@js-temporal/polyfill";
import { collection, doc, Firestore, FirestoreDataConverter, getDoc, getDocs, QueryDocumentSnapshot, setDoc, Timestamp } from "firebase/firestore";
import { PeriodicTaskCreation } from "./commands";
import { PeriodicTaskCompletionData } from "./domain";
import { CannotConstructNEachDay, EachDay, EachNDay, PeriodicTaskId, Rule, safeEachNDay, TaskState, User } from "./model";
import { Repository } from "./service";

type LastExecution =  { at: Temporal.PlainDate, by: User, comment: string | null } | null
const lastExecutionFromData = (data:DocumentData):LastExecution => {
  if (!data.lastExecution) {
    return null;
  }

  const userFrom = (): User => ({
    id: data.lastExecution.id,
    name: data.lastExecution.name
  })

  return {
    at: Temporal.PlainDate.from(data.lastExecution.at),
    by: userFrom(),
    comment: data.lastExecution.comment as string
  }
}

const nextExecutionFromData = (data:DocumentData): Temporal.PlainDate | null => {
  const day = data.nextExecution
  if(!day){
    return null;
  }
  return Temporal.PlainDate.from(day);
}

const ruleFromData = (data:DocumentData): Rule => {
  // ruleType
  if (data.ruleType == "EachDay") {
    return safeEachNDay(1) as Rule
  } else if (data.ruleType == "EachNDay") {
    const safe = safeEachNDay(data.howManyDays)
    if (safe == CannotConstructNEachDay) {
      throw new Error(`Invalid data for ${data.id} ${JSON.stringify(data)}`)
    } else {
      return safe as Rule;
    }
  } else {
    throw new Error(`Invalid data for ${data.id} ${JSON.stringify(data)}`)
  }

}

const taskStateConverter: FirestoreDataConverter<TaskState> = {
  toFirestore: (any) => {
    throw new Error("Not used")
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: snapshot.id,
      ruleDescription: ruleFromData(data).description(),
      nextExecution: nextExecutionFromData(data),
      lastExecution: lastExecutionFromData(data)
    }
  }
};

const ruleType = (rule: Rule) => {
  if (rule instanceof EachNDay) {
    return "EachNDay"
  } else if (rule instanceof EachDay) {
    return "EachDay"
  } else {
    throw new Error("Not implemented yet")
  }
}

export class FirebaseRepository implements Repository {
  private _table: string;

  constructor(readonly firestoreProvider: () => Firestore) {
    this._table = "PeriodicTask"
  }

  async create(p: PeriodicTaskCreation): Promise<PeriodicTaskId> {
    await setDoc(doc(this.firestoreProvider(), this._table, p.name), {
      description: p.description,
      ruleDescription: p.rule.description(),
      ruleType: ruleType(p.rule),
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
    return quired.docs.map(x => x.data())
  }

  async findById(id: string): Promise<PeriodicTaskCompletionData> {
    const docRef = doc(this.firestoreProvider(), this._table, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw "Cannot find object"
    }

    const data = docSnap.data()
    return {
      rule: ruleFromData(data),
      nextExecution: nextExecutionFromData(data),
      lastExecution: lastExecutionFromData(data)
    }
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