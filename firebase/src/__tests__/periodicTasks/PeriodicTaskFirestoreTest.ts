import {
    assertFails,
    assertSucceeds,
    initializeTestEnvironment,
    RulesTestContext,
    RulesTestEnvironment,
} from "@firebase/rules-unit-testing"
import { setDoc, doc, collection } from "firebase/firestore";
import * as fs from 'fs';
import * as path from 'path';
import { EachDay, FirebaseRepository, PeriodicTaskCreation, Repository } from "../../periodicTasks";

describe("Testing db", () => {
    const projectId = "demo-periodic"
    let testEnv: RulesTestEnvironment


    beforeAll(async () => {
        const src = path.resolve(__dirname, '..');
        const root = path.resolve(path.resolve(src, '..'), "..");
        const firestoreRules = path.resolve(root, "firestore.rules")
        testEnv = await initializeTestEnvironment({
            projectId: projectId,
            firestore: {
                rules: fs.readFileSync(firestoreRules, "utf8"),
            },
        })

    })

    const repositoryCreator = (context: RulesTestContext): Repository => {
        //@ts-ignore
        return new FirebaseRepository(() => context.firestore());
    }

    const unauthenticatedRepo = ()=>{
        const notLogged: RulesTestContext = testEnv.unauthenticatedContext();
        return repositoryCreator(notLogged);
    }

    const withNoClaims = ()=>{
        const context: RulesTestContext = testEnv.authenticatedContext("Bob");
        return repositoryCreator(context);
    }
    
    const withClaims = (claimName:string[])=>{
        const context: RulesTestContext = testEnv.authenticatedContext("Bob", {userRoles: [...claimName]});
        return repositoryCreator(context);
    }

    const reader = ()=>withClaims(["reader"])
    const writer = ()=>withClaims(["writer"])
    const readWriter = ()=>withClaims(["writer", "reader"])
    const admin = ()=>withClaims(["admin"])

    function sampleCreation(): PeriodicTaskCreation {
        return { name: "T1", description: "Description", rule: new EachDay() };
    }

    test('anonymous user should not be able to  create objects', async () => {
        const repo: Repository = unauthenticatedRepo()
        await assertFails(repo.create(sampleCreation()));
    });

    test('user without claims should not be able to  create objects', async () => {
        const repo: Repository = unauthenticatedRepo()
        await assertFails(repo.create(sampleCreation()));
    });

    test('reader should not create objects', async () => {
        const repo: Repository = unauthenticatedRepo()
        await assertFails(repo.create(sampleCreation()));
    });

    [{name:"writer", repoFn:writer}, {name:"readerWriter", repoFn:readWriter}, {name:"admin", repoFn:admin}].forEach(conf => {
        test(`${conf.name} should  be able to  create objects`, async () => {
            const repo: Repository = conf.repoFn();
            await assertSucceeds(repo.create(sampleCreation()));
        });
    });

    [
        {name:"unathenticated", repoFn:unauthenticatedRepo},
        {name:"no claims", repoFn:withNoClaims},
        ].forEach(conf => {
        test(`${conf.name} should not be able to list`, async () => {
            const creationRepo: Repository = writer();
            await creationRepo.create(sampleCreation())
            const repo: Repository = conf.repoFn();
            await assertFails(repo.list());
        });
    });

    [
        {name:"writer", repoFn:writer},
        {name:"readerWriter", repoFn:readWriter},
         {name:"reader", repoFn:reader},
         {name:"admin", repoFn:admin}
        ].forEach(conf => {
        test(`${conf.name} should  be able to list objects`, async () => {
            const creationRepo: Repository = writer();
            await creationRepo.create(sampleCreation())
            const repo: Repository = conf.repoFn();
            await assertSucceeds(repo.list());
        });
    });


    //TODO update test for users
    //TODO serialization of rules



    //     test('anonymous user should not be able to list objects', async () => {
    //         const notLogged = testEnv.unauthenticatedContext();
    //         import { collection, doc, setDoc } from "firebase/firestore"; 

    // const citiesRef = collection(db, "cities")

    //         const docRef = doc(notLogged.firestore(), repo.table, 'sth');
    //         await assertFails(setDoc(docRef, { "text": "Note", }));
    //     });


    // test('user without custom claim', async () => {
    //     const alice = testEnv.authenticatedContext("alice");
    //     const docRef = doc(alice.firestore(), 'notes', 'fires');
    //     await assertFails(setDoc(docRef, { "text": "Note", }));
    // });


    // test('user with custom claim appUser', async () => {
    //     const alice = testEnv.authenticatedContext("alice", {appUser:true});
    //     const docRef = doc(alice.firestore(), 'notes', 'fires');
    //     await assertSucceeds(setDoc(docRef, { "text": "Note", }));
    // });

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

