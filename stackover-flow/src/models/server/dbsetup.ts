import { db } from "../name";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createQuestionCollection from "./question.collection";
import createVoteCollection from "./vote.collection";
import { databases} from "./config";

export default async function getOrCreateDatabase(){
try {
    await databases.get(db);
    console.log("database connected success")

    
} catch (error) {
    try {
        
        await databases.create(db,db)
        console.log("database created");
        await Promise.all([
            createAnswerCollection(),
            createCommentCollection(),
            createQuestionCollection(),
            createVoteCollection()
        ])
        console.log("collection created successfully");
    } catch (error) {
        console.log("database failed to created",error);
        
    }
}
return databases;
}