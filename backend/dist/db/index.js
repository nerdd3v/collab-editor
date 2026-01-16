import mongoose, { model } from 'mongoose';
const signupSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});
export const fileModel = mongoose.model('file creation', fileSchema);
export const signupModel = mongoose.model('signup', signupSchema);
//# sourceMappingURL=index.js.map