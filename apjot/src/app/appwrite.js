import { Client, Databases, Account, Functions } from "appwrite";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("65e833a890f01a3607c1"); // Replace with your project ID

export const account = new Account(client);
export const databases = new Databases(client);
export const functions = new Functions(client);
export { ID } from 'appwrite';
