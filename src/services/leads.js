const col = (db) => db.collection('leads');

export const getAllLeads = (db) => col(db).find().toArray();

export const createLead = async (db, payload) => {
    const doc = { ...payload, createdAt: new Date(), updatedAt: new Date() };
    const { insertedId } = await col(db).insertOne(doc);
    return { _id: insertedId, ...doc };
};
