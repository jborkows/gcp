import { DocumentData } from "@firebase/firestore-types";
import { Temporal } from "@js-temporal/polyfill";
import * as firestore from "firebase/firestore";
import { PeriodicTaskCreation } from "./commands";
import { PeriodicTaskCompletionData } from "./domain";
import * as model from "./model";
import { Repository } from "./service";

type LastExecution =  { at: Temporal.PlainDate, by: model.User, comment: string | null } | null
const lastExecutionFromData = (data:DocumentData):LastExecution => {
  if (!data.lastExecution) {
    return null;
  }

  const userFrom = (): model.User => ({
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

const ruleFromData = (data:DocumentData): model.Rule => {
  // ruleType
  if (data.ruleType == "EachDay") {
    return model.safeEachNDay(1) as model.Rule
  } else if (data.ruleType == "EachNDay") {
    const safe = model.safeEachNDay(data.howManyDays)
    if (safe == model.CannotConstructNEachDay) {
      throw new Error(`Invalid data for ${data.id} ${JSON.stringify(data)}`)
    } else {
      return safe as model.Rule;
    }
  } else {
    throw new Error(`Invalid data for ${data.id} ${JSON.stringify(data)}`)
  }

}

const taskStateConverter: firestore.FirestoreDataConverter<model.TaskState> = {
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

const ruleType = (rule: model.Rule) => {
  if (rule instanceof model.EachNDay) {
    return "EachNDay"
  } else if (rule instanceof model.EachDay) {
    return "EachDay"
  } else {
    throw new Error("Not implemented yet")
  }
}

export class FirebaseRepository implements Repository {
  private _table: string;

  constructor(readonly firestoreProvider: () => firestore.Firestore) {
    this._table = "PeriodicTask"
  }
  

  async create(p: PeriodicTaskCreation): Promise<model.PeriodicTaskId> {
    await firestore.setDoc(firestore.doc(this.firestoreProvider(), this._table, p.name), {
      description: p.description,
      ruleDescription: p.rule.description(),
      ruleType: ruleType(p.rule),
      howManyDays: p.rule instanceof model.EachNDay ? p.rule.howMany : null
    });
    return p.name
  }

  update(id: string, p: PeriodicTaskCompletionData): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async list(): Promise<model.TaskState[]> {
    const taskStatesRef = firestore.collection(this.firestoreProvider(), this._table).withConverter(taskStateConverter);
    const quired = await firestore.getDocs(taskStatesRef);
    return quired.docs.map(x => x.data())
  }

  onData(fn: (data: model.TaskState[]) => void) {
    throw new Error("Method not implemented.");
  }

  async findById(id: string): Promise<PeriodicTaskCompletionData> {
    const docRef = firestore.doc(this.firestoreProvider(), this._table, id);
    const docSnap = await firestore.getDoc(docRef);
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
  forEach(callback: (result: firestore.QueryDocumentSnapshot<T>) => void, thisArg?: unknown): void;
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