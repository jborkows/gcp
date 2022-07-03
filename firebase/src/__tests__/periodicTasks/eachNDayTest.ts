import { Temporal } from "@js-temporal/polyfill";
import { CannotConstructNEachDay, EachNDay, safeEachNDay } from "../../periodicTasks/model";

describe("Each N day template", () => {


    [-1,-2,0].forEach(invalidHowMany => {
        it(`should not allow to construct object with ${invalidHowMany} howMany days`,()=>{
            const result = safeEachNDay(invalidHowMany)
            expect(result).toBe(CannotConstructNEachDay)
        })
    });
    
    [1, 2, 3].forEach(validHowMany => {
        it(`should  allow to construct object with ${validHowMany} howMany days`,()=>{
            const result = safeEachNDay(validHowMany)
            expect(result).not.toBe(CannotConstructNEachDay)
            if(result instanceof EachNDay){
                expect(result.howMany).toBe(validHowMany)   
            }else{
                fail("Should be result")
            }
        })
    });

    it("next execution",()=>{
        const aDate = Temporal.PlainDate.from("2022-05-14")
        const eachNDay = safeEachNDay(5) as EachNDay
        const nextExecution = eachNDay.nextExecution(aDate)
        console.log(nextExecution.toLocaleString())
        expect(nextExecution.toLocaleString()).toEqual(Temporal.PlainDate.from("2022-05-19").toLocaleString())
    })
    
});