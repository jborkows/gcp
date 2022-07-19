import { Temporal } from "@js-temporal/polyfill";
import { Command, DoneTask, EntityCommand } from "./commands";
import { PeriodicTaskId, Rule, User } from "./model";


export interface PeriodicTaskCompletionData {
    readonly rule: Rule,
    readonly nextExecution: Temporal.PlainDate | null,
    readonly lastExecution: { at: Temporal.PlainDate, by: User, comment: string | null } | null
}

export class PeriodicTaskCompletion {
    constructor(readonly id: PeriodicTaskId, readonly data: PeriodicTaskCompletionData) {
    }

    //TODO add method activate -> it will calculate nextexecution time if it was not already filled
    accept(command: EntityCommand): PeriodicTaskCompletion {
        if (command instanceof DoneTask) {
            return this._doneTask(command);
        }
        return this
    }

    private _doneTask(command: DoneTask): PeriodicTaskCompletion {
        return new PeriodicTaskCompletion(
            this.id,
            {
                rule: this.data.rule,
                nextExecution: this.data.rule.nextExecution(command.data.date),
                lastExecution: { at: command.data.date, by: command.data.user, comment: command.data.description }
            }
        )
    }
}