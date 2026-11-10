import { model, Schema } from 'mongoose';


const reviewsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    cover: {
        type: String,
        required: true
    }
}, { timestamps: true, versionKey: false });



export const ReviewsCollection = model('reviews', reviewsSchema);
