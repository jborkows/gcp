import { Temporal } from "@js-temporal/polyfill";

import * as lib from "../../periodicTasks";
import { EachNDay } from "../../periodicTasks";


describe("Marking as completed", () => {

    const eachDay = new lib.EachDay()
    const userA: lib.User = { id: "some id", name: "AAAA" };
    const userB: lib.User = { id: "some other id", name: "BBBBB" };
    const lastExecutionDate = Temporal.PlainDate.from("2022-01-01")
    
    it("should be able to mark as completed", () => {
        const periodicTasks = new lib.PeriodicTaskCompletion(
            "some id",
            {
                rule: eachDay,
                nextExecution: eachDay.nextExecution(lastExecutionDate),
                lastExecution: {
                    at: lastExecutionDate,
                    by: userA,
                    comment: "AAA"
                }

            }    
        );
        const processed = periodicTasks.accept(new lib.DoneTask({
            user: userB,
            date: Temporal.PlainDate.from("2022-02-01"),
            description: null
        }))

        expect(processed.id).toBe(periodicTasks.id)
    })

    it("marking the data should not modify old entity", () => {
        const nextExecution = eachDay.nextExecution(lastExecutionDate);
        const periodicTasks = new lib.PeriodicTaskCompletion(
            "some id",
            {
                rule: eachDay,
                nextExecution: nextExecution,
                lastExecution: null
            }    
        );
        const executedAt = Temporal.PlainDate.from("2022-02-01");
        const processed = periodicTasks.accept(new lib.DoneTask({
            user: userB,
            date: executedAt,
            description: "AAA"
        }))

        expect(periodicTasks.data.lastExecution).toBeNull()
        expect(periodicTasks.data.nextExecution.toLocaleString()).toEqual(nextExecution.toLocaleString())
    })


    it("marking the data should modify last execution and next execution", () => {
        const rule = new lib.EachNDay(5)
        const spy = jest.spyOn(rule, 'nextExecution');
        const nextExecution = rule.nextExecution(lastExecutionDate);
        const periodicTasks = new lib.PeriodicTaskCompletion(
            "some id",
            {
                rule: rule,
                nextExecution: nextExecution,
                lastExecution: null
            }    
        );
        const executedAt = Temporal.PlainDate.from("2022-02-01");
        const doneTask = new lib.DoneTask({
            user: userB,
            date: executedAt,
            description: "AAA"
        });
        const processed = periodicTasks.accept(doneTask)

        const {data } = processed
        if(data.nextExecution == null){
            fail("Cannot be empty")
        }
        if(data.lastExecution == null){
            fail("Cannot be empty")
        }
        expect(spy).toHaveBeenCalled();
        expect(data.nextExecution.toLocaleString()).not.toEqual(periodicTasks.data.nextExecution.toLocaleString())
        expect(data.lastExecution.at.toLocaleString()).toBe(executedAt.toLocaleString())
        expect(data.lastExecution.by).toEqual(userB)


        // const {} = processed.data

        // expect(periodicTasks.data.lastExecution)
        // expect(periodicTasks.data.nextExecution.toLocaleString()).toEqual(nextExecution.toLocaleString())
    })

});