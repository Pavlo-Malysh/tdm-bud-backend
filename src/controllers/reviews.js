
import { createReview, getAllReviews } from "../services/projects.js";

export const getReviewsController = async (req, res) => {

    const reviews = await getAllReviews();

    res.status(200).json({
        data: reviews,
    });
};


export const createReviewController = async (req, res) => {
    const review = await createReview(req.body);

    res.status(201).json({
        status: 201,
        message: "Successfully created a review!",
        data: review
    });
};
