import * as mongodb from "mongodb";

export const collections = {};
export let db: mongodb.Db;
export let mongoClient: mongodb.MongoClient;

export async function connectToDatabase() {
    const uri: string | undefined = process.env.LOCAL_MONGO_URI;

    if(!uri) {
        console.error('Failed to retrieve MongoDbAtlas URI from .env.')
        process.exit(1)
    }

    try {
        await connectToMongo(uri);
    } catch (e) {
        console.error("Couldn't connect to Mongo Atlas: " + e);
        process.exit(2);
    }
}

async function connectToMongo(uri: string) {
    mongoClient = new mongodb.MongoClient(uri);
    await mongoClient.connect();

    db = mongoClient.db("goTo-assessment");
}