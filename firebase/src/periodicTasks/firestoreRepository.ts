import { DocumentData } from "@firebase/firestore-types";
import { Temporal } from "@js-temporal/polyfill";
import * as firestore from "firebase/firestore";
import { onSnapshot, query, TaskState, updateDoc } from "firebase/firestore";
import { PeriodicTaskCreation } from "./commands";
import { PeriodicTaskCompletionData } from "./domain";
import * as model from "./model";
import { Repository } from "./service";

type LastExecution = { at: Temporal.PlainDate, by: model.User, comment: string | null } | null
const lastExecutionFromData = (data: DocumentData): LastExecution => {
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

const nextExecutionFromData = (data: DocumentData): Temporal.PlainDate | null => {
  const day = data.nextExecution
  if (!day) {
    return null;
  }
  return Temporal.PlainDate.from(day);
}

const ruleFromData = (data: DocumentData): model.Rule => {
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
      ruleDescription: data.ruleDescription,
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

  async update(id: string, p: PeriodicTaskCompletionData): Promise<void> {
    const docRef = firestore.doc(this.firestoreProvider(), this._table, id);
    await updateDoc(docRef, {
      nextExecution: p.nextExecution ? (p.nextExecution).toString() : null,
      lastExecution: !p.lastExecution ? null : acceptableByFirestore(p.lastExecution)
    });
  }

  async list(): Promise<model.TaskState[]> {
    const taskStatesRef = this.listAllQueryRef();
    const quired = firestore.getDocs(taskStatesRef);
    const data = await quired;
    return data.docs.map(x => x.data())
  }


  async onData(fn: (data: model.TaskState[]) => void) {
    const q = query(this.listAllQueryRef())
    onSnapshot(q, (querySnapshot) => {
      const elements: Array<model.TaskState> = []
      querySnapshot.forEach((doc) => {
        elements.push(doc.data());
      });
      fn(elements);
    });
  }

  private listAllQueryRef(): firestore.Query<model.TaskState> {
    return firestore.collection(this.firestoreProvider(), this._table).withConverter(taskStateConverter);
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

function acceptableByFirestore(lastExecution: { at: Temporal.PlainDate; by: model.User; comment: string; }) {
  return {
    at: lastExecution.at.toString(),
    id: lastExecution.by.id,
    name: lastExecution.by.name,
    comment: lastExecution.comment
  }
}
