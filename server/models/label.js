const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const labelSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    parentId: {
        type: mongoose.Types.ObjectId,
        default: null,
    },
    children: {
        type: [mongoose.Types.ObjectId],
        default: [],
    },
}, { timestamps: true });

// convert provided strings to ObjectIds
labelSchema.pre('save', function (next) {
    
    if (Array.isArray(this.children)) {
        this.children = this.children.map(child => convertToObjectId(child));
    } 
    else {
        this.children = [];
    }

    if (this.parentId) {
        this.parentId = new mongoose.Types.ObjectId(this.parentId);
    } 
    else {
        this.parentId = null;
    }

    next();
});

// convert ObjectIds to strings
labelSchema.post('find', function (docs) {
    docs.forEach(doc => {
        
        if (Array.isArray(doc.children)) {
            doc.children = doc.children.map(child => child.toString());
        } 
        else {
            doc.children = [];
        }

        if (doc.parentId) {
            doc.parentId = doc.parentId.toString();
        } 
        else {
            doc.parentId = null;
        }
    });
});

const convertToObjectId = (id) => {
    return new mongoose.Types.ObjectId(id);
}

const Label = mongoose.model('Label', labelSchema);
module.exports = Label;