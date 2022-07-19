import {
    assertFails,
    assertSucceeds,
    initializeTestEnvironment,
    RulesTestContext,
    RulesTestEnvironment,
} from "@firebase/rules-unit-testing"
import * as fs from 'fs';
import * as path from 'path';
import { EachDay, FirebaseRepository, PeriodicTaskCreation, Repository } from "../../periodicTasks";

describe("Testing db", () => {
    const projectId = "demo-periodic-list-create"
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
        const firestore = context.firestore()
        // @ts-ignore
        return new FirebaseRepository(() => firestore);
    }

    const withClaims = (claimName: string[]) => {
        const context: RulesTestContext = testEnv.authenticatedContext("Bob", { userRoles: [...claimName], appUser:true });
        return repositoryCreator(context);
    }
    const writer = () => withClaims(["writer"])
    
    function sampleCreation(): PeriodicTaskCreation {
        return { name: "T1", description: "Description", rule: new EachDay() };
    }

  
    test(`created object should be listed`, async () => {
        const creationRepo: Repository = writer();
        const dto = sampleCreation();
        await creationRepo.create(dto)

        
        let found = await creationRepo.list();
        
        expect(found.length).toBe(1)
        expect(found[0].id).not.toBeNull()
        expect(found[0].name).toBe(dto.name)
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

