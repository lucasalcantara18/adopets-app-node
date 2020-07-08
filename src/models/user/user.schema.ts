import * as mongoose from "mongoose";
import User from "./user.interface";


const userSchema = new mongoose.Schema({
    uuid: String,
    name: String,
    email: String,
    password: String,
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }]
});

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export default userModel;