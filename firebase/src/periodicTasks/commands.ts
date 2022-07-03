import { Temporal } from "@js-temporal/polyfill"
import { PeriodicTaskId, Rule, User } from "./model"


export type PeriodicTaskCreation = {
    name: string,
    description: string
    rule: Rule
}

interface DoneTaskData {
    readonly user: User,
    readonly date: Temporal.PlainDate,
    readonly description: string | null
}

export class DoneTask {
    constructor(readonly data: DoneTaskData) { }
}


export type Command = PeriodicTaskCreation | DoneTask
export type EntityCommand = Exclude<Command, PeriodicTaskCreation>




