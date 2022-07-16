import {  safeEachNDay } from "../../periodicTasks/model";

describe("Two rules which should no be equal", () => {
    [
        [safeEachNDay(1), safeEachNDay(2), "each day vs each 2nd day"],
        [ safeEachNDay(3),  safeEachNDay(2), "each 3rd day vs each 2nd day"],
    ].forEach(testConfig => {
        const [rule1,rule2,description] = testConfig
        it(`comparing ${description}`, ()=>{
           //@ts-ignore
           expect(rule1.equals(rule2)).toBeFalsy();
           //@ts-ignore
           expect(rule2.equals(rule1)).toBeFalsy();
        });
    })
});


describe("Two rules which should  be equal", () => {
    [
        [safeEachNDay(1), safeEachNDay(1), "each day vs each one day"],
        [safeEachNDay(3), safeEachNDay(3), "each 3rd day vs each 3nd day"],
    ].forEach(testConfig => {
        const [rule1,rule2,description] = testConfig
        it(`comparing ${description}`, ()=>{
            //@ts-ignore
            expect(rule1.equals(rule2)).toBeTruthy();
            //@ts-ignore
            expect(rule2.equals(rule1)).toBeTruthy();
        });
    })
});