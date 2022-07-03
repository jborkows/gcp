import { Temporal } from "@js-temporal/polyfill";
import { EachDay } from "../../periodicTasks/model";

describe("Each day template", () => {
    it("next execution",()=>{
        const aDate = Temporal.PlainDate.from("2022-05-14")
        const eachDay = new EachDay()
        const nextExecution = eachDay.nextExecution(aDate)
        expect(nextExecution.toLocaleString()).toEqual(Temporal.PlainDate.from("2022-05-15").toLocaleString())
    })
    
});