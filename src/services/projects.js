import { ObjectId } from 'mongodb';

const col = (db) => db.collection('projects');

export const getAllProjects = (db) => col(db).find().toArray();

export const getProjectById = (db, id) =>
    ObjectId.isValid(id) ? col(db).findOne({ _id: new ObjectId(id) }) : null;

export const createProject = async (db, payload) => {
    const doc = { ...payload, createdAt: new Date(), updatedAt: new Date() };
    const { insertedId } = await col(db).insertOne(doc);
    return { _id: insertedId, ...doc };
};

export const updateProject = (db, id, payload) =>
    ObjectId.isValid(id)
        ? col(db).findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { ...payload, updatedAt: new Date() } },
            { returnDocument: 'after' },
        )
        : null;
