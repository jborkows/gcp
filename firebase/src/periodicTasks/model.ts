import { Temporal } from '@js-temporal/polyfill';
import { type } from 'os';

export type User = {
    id: string,
    name: string
}

const possibleRuleTypes = ["EACH_DAY", "ONCE_PER_N_DAYS"] as const;
export type RuleType = typeof possibleRuleTypes[number];


export interface RuleTemplate {
    type: RuleType,
    description: () => string,
    nextExecution: (date: Temporal.PlainDate) => Temporal.PlainDate
}

export const CannotConstructNEachDay = {} as const

export class EachDay implements RuleTemplate {
    type: 'EACH_DAY';
    description: () => string = () => "Każdego dnia"
    nextExecution: (date: Temporal.PlainDate) => Temporal.PlainDate = (date: Temporal.PlainDate) => date.add({ days: 1 })
}


export type DaysNumber = number
export class EachNDay implements RuleTemplate {
    howMany: DaysNumber;
    constructor(howMany: DaysNumber) {
        this.howMany = howMany
    }
    type: 'ONCE_PER_N_DAYS';
    description: () => string = () => `Każdego ${this.howMany} dnia`
    nextExecution: (date: Temporal.PlainDate) => Temporal.PlainDate = (date: Temporal.PlainDate) => date.add({ days: this.howMany })
}


export const safeEachNDay = (howMany: DaysNumber): EachDay | typeof CannotConstructNEachDay => {
    if (howMany <= 0) {
        return CannotConstructNEachDay
    } else {
        return new EachNDay(howMany);
    }
}

export type Rule = EachDay | EachNDay

export interface TaskState {
    readonly id:PeriodicTaskId,
    readonly name: string,
    readonly ruleDescription: string,
    readonly nextExecution: Temporal.PlainDate
    readonly lastExecution: { at:Temporal.PlainDate , by:User} | null
}


export type PeriodicTaskId = string