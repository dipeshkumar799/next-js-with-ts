import env from "../env";
import { Client, Account,Avatars,Databases,Storage } from "appwrite";

const client = new Client()
    .setEndpoint(env.appwrite.endpoint) // Your API Endpoint
    .setProject(env.appwrite.projectId);                 // Your project ID

const account = new Account(client);

const avatars = new Avatars(client);
const  databases = new Databases(client);
const storage = new Storage(client);


export {
    client,
    account,
    avatars,
    databases,
    storage
}
// Appwrite endpoint and project ID.
// Client: The main entry point for initializing Appwrite. It connects your application to your Appwrite backend.
// Account: Manages user accounts, such as login, registration, and user sessions.
// Avatars: Provides avatar-related functionalities, like generating user avatars or icons.
// Databases: Manages interactions with the Appwrite database, such as creating, reading, and updating collections or documents.
// Storage: Handles file uploads and storage operations.
