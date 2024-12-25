import  {IndexType, Permission}  from "node-appwrite";
import  {db, questionCollection} from "../name"
import { databases } from "./config";


export default async function createQuestionCollection(){

//create collection for question
await databases.createCollection(db,questionCollection,questionCollection,[
  Permission.read("any"),
  Permission.read("users"),
  Permission.create("users"),
  Permission.update("users"),
  Permission.delete("users")

])
console.log("question collection created successfully")
//creating attributes and indexs
await Promise.all([ databases.createStringAttribute(db,questionCollection,"title",100,true),
 databases.createStringAttribute(db,questionCollection,"content",1000,true),
 databases.createStringAttribute(db,questionCollection,"authorId",50,true),
 databases.createStringAttribute(db,questionCollection,"tags",50,true,undefined,true),
 databases.createStringAttribute(db,questionCollection,"attachmentId",50,false),
])
console.log("question attributes created successfully")
await Promise.all([
    databases.createIndex(db, questionCollection, "titleIndex", IndexType.Fulltext, ["title"], ["asc"]),
    databases.createIndex(db, questionCollection, "tagsIndex", IndexType.Fulltext, ["tags"], ["asc"]),
  ]);
  console.log("Question indexes created successfully!");
} 