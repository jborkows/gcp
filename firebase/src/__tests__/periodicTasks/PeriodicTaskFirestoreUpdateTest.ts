import { RulesTestEnvironment, } from "@firebase/rules-unit-testing"
import { Temporal } from "@js-temporal/polyfill";
import { Repository,TaskState } from "../../periodicTasks";
import { Helper, testEnvInitialization, sampleCreation } from "./helpers";

describe("Testing db", () => {
    const projectId = "demo-periodic-update"
    let testEnv: RulesTestEnvironment
    let helper: Helper

    beforeAll(async () => {
        testEnv = await testEnvInitialization(projectId)
        helper = new Helper(testEnv)
    })

    test(`update`, async () => {
        const repo: Repository = helper.writer();
        const dto = sampleCreation();
        const taskId = await repo.create(dto)
        let found = await repo.findById(taskId);
        let nextExecution = Temporal.PlainDate.from("2022-02-01")
        let lastOne = Temporal.PlainDate.from("2022-01-01")
        const updated = {
            ...found,
            nextExecution: nextExecution,
            lastExecution: { at: lastOne, by: { id: "1111", name: 'aaaaa' }, comment: "done" }

        }
        await repo.update(taskId, updated)
        let gotData = await repo.findById(taskId);
        expect(gotData.nextExecution.toString()).toEqual(nextExecution.toString())
        expect(gotData.lastExecution.at.toString()).toEqual(lastOne.toString())
        expect(gotData.lastExecution.by.id).toEqual("1111")
        expect(gotData.lastExecution.by.name).toEqual("aaaaa")
        expect(gotData.lastExecution.comment).toEqual("done")


    });

    const delayer = (miliseconds:number) => new Promise(resolve=>setTimeout(()=>resolve("done"), miliseconds))
    const retryable = async <T>(howMany:number, action:()=>Promise<T>, condition:(t:T)=>boolean):Promise<T> => {
        while(howMany-- > 0){
            let actionResult = await action()
            if(condition(actionResult)){
                return actionResult
            }
            await delayer(100)
        }
        throw new Error("Condition was not met")
    }

    test(`changes listener`, async () => {
        const repo: Repository = helper.writer();
        const dto = sampleCreation();
        const taskId = await repo.create(dto)
        let found = await repo.findById(taskId);
        let nextExecution = Temporal.PlainDate.from("2022-02-01")
        let lastOne = Temporal.PlainDate.from("2022-01-01")
        const updated = {
            ...found,
            nextExecution: nextExecution,
            lastExecution: { at: lastOne, by: { id: "1111", name: 'aaaaa' }, comment: "done" }

        }
        let wasCalledWith:Array<TaskState> = []
        repo.onData((data)=>wasCalledWith = data)
        await repo.update(taskId, updated)
        retryable(2, async ()=>wasCalledWith, elements => elements.some(elem => elem.id == taskId))
        let gotData = wasCalledWith.filter(elem => elem.id == taskId)[0];
        expect(gotData.nextExecution.toString()).toEqual(nextExecution.toString())
        expect(gotData.lastExecution.at.toString()).toEqual(lastOne.toString())
        expect(gotData.lastExecution.by.id).toEqual("1111")
        expect(gotData.lastExecution.by.name).toEqual("aaaaa")


    });


    afterEach(async () => {
        if (!testEnv) {
            return;
        }
        testEnv.clearFirestore()
    });

    afterAll(async () => {
        await testEnv.cleanup()
    })
})

