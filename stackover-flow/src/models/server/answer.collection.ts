import { IndexType, Permission } from "node-appwrite";
import { db, answerCollection } from "../name";
import { databases } from "./config";

export default async function createAnswerCollection() {

    // Create collection for answers
    await databases.createCollection(db, answerCollection, answerCollection, [
      Permission.read("any"),
      Permission.read("users"),
      Permission.create("users"),
      Permission.update("users"),
      Permission.delete("users"),
    ]);
    console.log("Answer collection created successfully!");

    // Create attributes
    await Promise.all([
      databases.createStringAttribute(db, answerCollection, "content", 1000, true),
      databases.createStringAttribute(db, answerCollection, "authorId", 50, true),
      databases.createStringAttribute(db, answerCollection, "questionId", 50, true),
    ]);
    console.log("Answer attributes created successfully!");

    // Create indexes
    await Promise.all([
      databases.createIndex(db, answerCollection, "contentIndex", IndexType.Fulltext, ["content"], ["asc"]),
      databases.createIndex(db, answerCollection, "authorIdIndex", IndexType.Key, ["authorId"], ["asc"]),
      databases.createIndex(db, answerCollection, "questionIdIndex", IndexType.Key, ["questionId"], ["asc"]),
    ]);
    console.log("Answer indexes created successfully!");
}
