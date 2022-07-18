import { Temporal } from '@js-temporal/polyfill';

export type User = {
    id: string,
    name: string
}

const possibleRuleTypes = ["EACH_DAY", "ONCE_PER_N_DAYS"] as const;
export type RuleType = typeof possibleRuleTypes[number];


export interface RuleTemplate {
    type: RuleType,
    description: () => string,
    nextExecution: (date: Temporal.PlainDate) => Temporal.PlainDate,
    equals(other: any): boolean 
}

export const CannotConstructNEachDay = { message: "Just cannot"} as const

export class EachDay implements RuleTemplate {
    type: 'EACH_DAY';
    description: () => string = () => "Każdego dnia"
    nextExecution: (date: Temporal.PlainDate) => Temporal.PlainDate = (date: Temporal.PlainDate) => date.add({ days: 1 })

    equals(other: any): boolean {
        return other instanceof EachDay
    }
}


export type DaysNumber = number
export class EachNDay implements RuleTemplate {
    howMany: DaysNumber;
    constructor(howMany: DaysNumber) {
        this.howMany = howMany
    }
    type:  'ONCE_PER_N_DAYS';
    description: () => string = () => `Każdego ${this.howMany} dnia`
    nextExecution: (date: Temporal.PlainDate) => Temporal.PlainDate = (date: Temporal.PlainDate) => date.add({ days: this.howMany })

    equals(other: any): boolean {
        return other instanceof EachNDay && this.howMany === other.howMany
    }
}


export const safeEachNDay = (howMany: DaysNumber): Rule | typeof CannotConstructNEachDay => {
    if (howMany <= 0) {
        return CannotConstructNEachDay
    } else {
        if(howMany > 1){
            return new EachNDay(howMany);
        }else{
            return new EachDay()
        }
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