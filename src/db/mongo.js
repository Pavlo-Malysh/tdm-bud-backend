import { MongoClient } from 'mongodb';

let client;

export const getDb = async (env) => {
    if (!client) {
        client = new MongoClient(
            `mongodb+srv://${env.MONGODB_USER}:${env.MONGODB_PASSWORD}@${env.MONGODB_URL}/${env.MONGODB_DB}?retryWrites=true&w=majority`,
        );
        await client.connect();
    }
    return client.db(env.MONGODB_DB);
};
