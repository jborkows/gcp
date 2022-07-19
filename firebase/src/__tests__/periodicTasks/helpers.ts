import {
    assertFails,
    assertSucceeds,
    initializeTestEnvironment,
    RulesTestContext,
    RulesTestEnvironment,
} from "@firebase/rules-unit-testing"
import { randomInt } from "crypto";
import * as fs from 'fs';
import * as path from 'path';
import { EachDay, PeriodicTaskCreation, Repository, FirebaseRepository } from "../../periodicTasks";
export async function testEnvInitialization(projectId:string):Promise<    RulesTestEnvironment>{
    const src = path.resolve(__dirname, '..');
    const root = path.resolve(path.resolve(src, '..'), "..");
    const firestoreRules = path.resolve(root, "firestore.rules")
    return initializeTestEnvironment({
        projectId: projectId,
        firestore: {
            rules: fs.readFileSync(firestoreRules, "utf8"),
        },
    })
}


 const repositoryCreator = (context: RulesTestContext): Repository => {
    const firestore = context.firestore()
    // @ts-ignore
    return new FirebaseRepository(() => firestore);
}

export class Helper {
    constructor(readonly testEnv:RulesTestEnvironment){}
    unauthenticatedRepo = () => {
        const notLogged: RulesTestContext = this.testEnv.unauthenticatedContext();
        return repositoryCreator(notLogged);
    }
    
    withNoClaims = () => {
        const context: RulesTestContext = this.testEnv.authenticatedContext("Bob");
        return repositoryCreator(context);
    }
    
     withClaims = (claimName: string[]) => {
        const context: RulesTestContext = this.testEnv.authenticatedContext("Bob", { userRoles: [...claimName], appUser:true });
        return repositoryCreator(context);
    }
    
    reader = () => this.withClaims(["reader"])
    writer = () => this.withClaims(["writer"])
    readWriter = () => this.withClaims(["writer", "reader"])
    admin = () => this.withClaims(["admin"])
}

test("Fake test", ()=>{})




export function sampleCreation(): PeriodicTaskCreation {
    return { name: "T" + randomInt(103400), description: "Description" + randomInt(103400), rule: new EachDay() };
}