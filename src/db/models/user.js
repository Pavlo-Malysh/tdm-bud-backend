import { model, Schema } from 'mongoose';


const leadSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    }
}, { timestamps: true, versionKey: false });



export const LeadsCollection = model('leads', leadSchema);
