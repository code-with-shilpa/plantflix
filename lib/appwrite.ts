import { Client, Account, Databases, Storage } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://fra.cloud.appwrite.io/v1") 
  .setProject('69b1061800066d2c0d78'); 

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export default client;