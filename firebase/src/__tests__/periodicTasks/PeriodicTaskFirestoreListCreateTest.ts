import {RulesTestEnvironment,} from "@firebase/rules-unit-testing"
import { Repository } from "../../periodicTasks";
import { Helper, testEnvInitialization, sampleCreation } from "./helpers";

describe("Testing db", () => {
    const projectId = "demo-periodic-list-create"
    let testEnv: RulesTestEnvironment
    let helper: Helper

    beforeAll(async () => {
        testEnv = await testEnvInitialization(projectId)
        helper = new Helper(testEnv)
    })

    test(`created object should be listed`, async () => {
        const creationRepo: Repository = helper.writer();
        const dto = sampleCreation();
        await creationRepo.create(dto)
        let found = await creationRepo.list();
        expect(found.length).toBe(1)
        expect(found[0].id).not.toBeNull()
        expect(found[0].name).toBe(dto.name)
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

