
import { Temporal } from "@js-temporal/polyfill";
import { DoneTask, PeriodicTaskCreation } from "./commands";
import { PeriodicTaskCompletion, PeriodicTaskCompletionData } from "./domain";
import { PeriodicTaskId, TaskState, User } from "./model";


export interface Repository {
    create(p:PeriodicTaskCreation): Promise<PeriodicTaskId>
    update(id:PeriodicTaskId, p:PeriodicTaskCompletionData): Promise<void>
    list():Promise<TaskState[]>;
    findById(id:PeriodicTaskId):Promise<PeriodicTaskCompletionData>
}

export type CreationInput = {
    data:PeriodicTaskCreation
}

export interface UserDataFetcher {
    current: () => Promise<User>
}

class Service {
    constructor(readonly repository:Repository, readonly userDataFetcher:UserDataFetcher){}

    async create(creationInput:CreationInput) {
        const data =  this._translate(creationInput)
        await this.repository.create(data);
        //add activation of task
    }

    async done(id:PeriodicTaskId, description:string | null) {
        const data = this.repository.findById(id)
        const user = this.userDataFetcher.current()
        const entity = new PeriodicTaskCompletion(id, await data)
        const processed = entity.accept(new DoneTask({user:await user, description:description, date:Temporal.Now.plainDateISO()}))
        await this.repository.update(id, processed.data)
    }

    async list():Promise<TaskState[]> {
        return this.repository.list()
    }

    private _translate(creationInput: CreationInput):PeriodicTaskCreation {
        return creationInput.data
    }

    //TODO create list and modify data + user access
}