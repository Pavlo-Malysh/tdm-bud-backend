import { getDb } from '../db/mongo.js';
import { getAllReviews, createReview } from '../services/reviews.js';

export const getReviewsController = async (c) => {
    const reviews = await getAllReviews(await getDb(c.env));
    return c.json({ status: 200, data: reviews });
};

export const createReviewController = async (c) => {
    const review = await createReview(await getDb(c.env), await c.req.json());
    return c.json({ status: 201, message: 'Successfully created a review!', data: review }, 201);
};
