import {
    RulesTestEnvironment,
} from "@firebase/rules-unit-testing"
import { fail } from "assert";
import { Repository } from "../../periodicTasks";
import { Helper, testEnvInitialization, sampleCreation } from "./helpers";

describe("Testing db", () => {
    const projectId = "aaaaa"
    let testEnv: RulesTestEnvironment
    let helper: Helper

    beforeAll(async () => {
        testEnv = await testEnvInitialization(projectId)
        helper = new Helper(testEnv)
    })

    test(`if cannot find object -> throw exception`, async () => {
        const creationRepo: Repository = helper.writer();
        const dto = sampleCreation();
        // await creationRepo.create(dto)

        try {
            await creationRepo.findById(dto.name)
            fail("Should not be possible")
        } catch (e) {
            expect(e).toBe('Cannot find object');
        }
    });


    test(`should find one object in multiple entries`, async () => {
        const creationRepo: Repository = helper.writer();
        const dto = sampleCreation();
        await creationRepo.create(dto)
        await creationRepo.create(sampleCreation())
        await creationRepo.create(sampleCreation())
        const found = await creationRepo.findById(dto.name)
        expect(found.rule.equals(dto.rule)).toBeTruthy()
    });

    //create update find

    afterEach(async () => {
        if (!testEnv) {
            return;
        }
        testEnv.clearFirestore()
    });

    afterAll(async () => {
        if (!testEnv) {
            return;
        }
        await testEnv.cleanup()
    })
})

