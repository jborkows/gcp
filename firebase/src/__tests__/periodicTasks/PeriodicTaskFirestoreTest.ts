import {
    assertFails,
    assertSucceeds,
    RulesTestEnvironment,
} from "@firebase/rules-unit-testing"
import {  Repository } from "../../periodicTasks";
import { Helper, sampleCreation, testEnvInitialization } from "./helpers";

describe("Testing db", () => {
    const projectId = "demo-periodic"
    let testEnv: RulesTestEnvironment
    let helper: Helper

    beforeAll(async () => {
        testEnv = await testEnvInitialization(projectId)
        helper = new Helper(testEnv)
    })

    test('anonymous user should not be able to  create objects', async () => {
        const repo: Repository = helper.unauthenticatedRepo()
        await assertFails(repo.create(sampleCreation()));
    });

    test('user without claims should not be able to  create objects', async () => {
        const repo: Repository = helper.unauthenticatedRepo()
        await assertFails(repo.create(sampleCreation()));
    });

    test('reader should not create objects', async () => {
        const repo: Repository = helper.unauthenticatedRepo()
        await assertFails(repo.create(sampleCreation()));
    });

    [{ name: "writer", repoFn: ()=>helper.writer() }, { name: "readerWriter", repoFn: ()=>helper.readWriter() }, { name: "admin", repoFn: ()=>helper.admin() }].forEach(conf => {
        test(`${conf.name} should  be able to  create objects`, async () => {
            const repo: Repository = conf.repoFn();
            await assertSucceeds(repo.create(sampleCreation()));
        });
    });

    [
        { name: "unathenticated", repoFn: ()=>helper.unauthenticatedRepo() },
        { name: "no claims", repoFn: ()=>helper.withNoClaims() },
    ].forEach(conf => {
        test(`${conf.name} should not be able to list`, async () => {
            const creationRepo: Repository = helper.writer();
            await creationRepo.create(sampleCreation())
            const repo: Repository = conf.repoFn();
            await assertFails(repo.list());
        });
    });

    [
        { name: "writer", repoFn: ()=>helper.writer() },
        { name: "readerWriter", repoFn: ()=>helper.readWriter() },
        { name: "admin", repoFn: ()=>helper.admin() }
    ].forEach(conf => {
        test(`${conf.name} should be able to list and create objects`, async () => {
            const creationRepo: Repository = conf.repoFn();
            const dto = sampleCreation();
            await creationRepo.create(dto)
            await assertSucceeds(creationRepo.list());
        });
    });

    test(`reader should be able to list but not create objects`, async () => {
        const creationRepo: Repository = helper.reader();
        await assertSucceeds(creationRepo.list());
        const dto = sampleCreation();
        await assertFails(creationRepo.create(dto))
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



