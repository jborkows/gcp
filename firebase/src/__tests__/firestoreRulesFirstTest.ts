import {
    assertFails,
    assertSucceeds,
    initializeTestEnvironment,
    RulesTestEnvironment,
} from "@firebase/rules-unit-testing"
import { setDoc, doc } from "firebase/firestore";
import * as fs from 'fs';
import * as path from 'path';

describe("Testing security rules", () => {
    const projectId = "demo-project-1234"
    let testEnv: RulesTestEnvironment

    beforeEach(async () => {
        const src = path.resolve(__dirname, '..');
        const root = path.resolve(src, '..');
        const firestoreRules = path.resolve(root, "firestore.rules")
        testEnv = await initializeTestEnvironment({
            projectId: projectId,
            firestore: {
                rules: fs.readFileSync(firestoreRules, "utf8"),
            },
        })
    })

    test('anonymous user', async () => {
        const alice = testEnv.unauthenticatedContext();
        const docRef = doc(alice.firestore(), 'notes', 'fires');
        await assertFails(setDoc(docRef, { "text": "Note", }));
    });



    test('user without custom claim', async () => {
        const alice = testEnv.authenticatedContext("alice");
        const docRef = doc(alice.firestore(), 'notes', 'fires');
        await assertFails(setDoc(docRef, { "text": "Note", }));
    });


    test('user with custom claim appUser', async () => {
        const alice = testEnv.authenticatedContext("alice", {appUser:true});
        const docRef = doc(alice.firestore(), 'notes', 'fires');
        await assertSucceeds(setDoc(docRef, { "text": "Note", }));
    });

    afterEach(async () => {
        if (!testEnv) {
            return;
        }
        testEnv.clearFirestore()
    });

})