import env from "../env";
import {Avatars,Client,Users,Databases,Storage } from "node-appwrite"

const  client = new Client();
client
    .setEndpoint(env.appwrite.endpoint) // Your API Endpoint
    .setProject(env.appwrite.projectId) // Your project ID
    .setKey(env.appwrite.apikey) // Your secret API key
    .setSelfSigned(true) // Use only on dev mode with a self-signed SSL cert
;

const avatars = new Avatars(client);
const  databases = new Databases(client);
const storage = new Storage(client);
const users = new Users(client)


export {
    client,
    avatars,
    databases,
    storage,
    users
}