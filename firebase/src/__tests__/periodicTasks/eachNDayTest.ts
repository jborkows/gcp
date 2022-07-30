import { Temporal } from "@js-temporal/polyfill";
import { CannotConstructNEachDay, safeEachNDay, RuleTemplate } from "../../periodicTasks";

describe("Each N day template", () => {


    [-1, -2, 0].forEach(invalidHowMany => {
        it(`should not allow to construct object with ${invalidHowMany} howMany days`, () => {
            const result = safeEachNDay(invalidHowMany)
            expect(result).toBe(CannotConstructNEachDay)
        })
    });

    const aDate = Temporal.PlainDate.from("2022-05-14")
    const testCases: Array<[number, string]> = [[1, "2022-05-15"], [2, "2022-05-16"], [3, "2022-05-17"]]

    testCases.forEach(validHowMany => {
        const [howMany, expectedCalculatedDate] = validHowMany
        it(`should  allow to construct object with ${validHowMany} howMany days`, () => {
            const result = safeEachNDay(howMany)
            expect(result).not.toBe(CannotConstructNEachDay)

            if (result === CannotConstructNEachDay) {
                fail("Should be result")
            }
            const rule = result as RuleTemplate
            const nextExecution = rule.nextExecution(aDate)
            expect(nextExecution.toString()).toEqual(expectedCalculatedDate)

        })
    });

});