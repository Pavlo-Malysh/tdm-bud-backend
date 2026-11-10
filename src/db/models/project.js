import { model, Schema } from 'mongoose';

const photoSchema = new Schema({
    url: { type: String, required: true },
    caption: String,
}, { _id: false });

const projectSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    cover: {
        mobile: {
            type: String,
            required: true
        },
        desktop: {
            type: String,
            required: true
        },
    },
    photos: [photoSchema],
}, { timestamps: true, versionKey: false });



export const ProjectsCollection = model('projects', projectSchema);
