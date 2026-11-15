const col = (db) => db.collection('reviews');

export const getAllReviews = (db) => col(db).find().toArray();

export const createReview = async (db, payload) => {
    const doc = { ...payload, createdAt: new Date(), updatedAt: new Date() };
    const { insertedId } = await col(db).insertOne(doc);
    return { _id: insertedId, ...doc };
};
