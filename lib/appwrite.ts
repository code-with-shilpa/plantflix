import { Client, Account, Databases, Storage } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://fra.cloud.appwrite.io/v1") 
  .setProject(process.env.NEXT_PUBLIC_DB_ID!); 

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export default client;