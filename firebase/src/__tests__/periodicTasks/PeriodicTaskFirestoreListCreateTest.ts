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

