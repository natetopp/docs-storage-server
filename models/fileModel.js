const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema(
    {
        name: String,
        description: String,
        document: String,
        size: Number,
        user: String,
        creationDate: {
            type: Date,
            default: Date.now
        },
    }
);

const FileModel = mongoose.models.File || mongoose.model('File', fileSchema);
module.exports = FileModel;
