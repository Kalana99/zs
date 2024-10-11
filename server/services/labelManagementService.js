let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
require('dotenv').config();

const Label = require('../models/label');

// create a new label
const createLabel = async (data) => {

    let label = new Label(data);
    let label_id = await label.save();

    // if parent id is provided, add this label to parent's children array
    if (data.parentId !== undefined && data.parentId !== null) {
        await addChild(data.parentId, label_id);
    }

    return label_id._id;
}

// find a label by id
const findLabelByID = async (id) => {

    let label = await Label.findById(new mongoose.Types.ObjectId(id));
    return label;
}

// find a label by name
const findLabelByName = async (name) => {

    let label = await Label.findOne({name: name});
    return label;
}

// find a label by name and parent id
const findLabelByNameAndParentId = async (name, parentId) => {

    // if parent id is null or undefined, return the labels with no parent with the given name
    if (parentId === null || parentId === undefined) {
        let root_label = await Label.findOne({name: name, parentId: null});
        return root_label;
    }

    let label = await Label.findOne({name: name, parentId: new mongoose.Types.ObjectId(parentId)});
    return label;
}

// get all labels
const getAllLabels = async () => {

    let labels = await Label.find();
    return labels;
}

// update a label
const updateLabel = async (id, data) => {

    let label = await Label.updateOne({_id: new mongoose.Types.ObjectId(id)}, data);
    return label;
}

// add id to children array
const addChild = async (id, childId) => {

    try {

        if(findLabelByID(id) === null) {
            throw new Error("Parent label not found!");
        }

        let label = await Label.updateOne(
            { _id: new mongoose.Types.ObjectId(id) },
            { $push: { children: new mongoose.Types.ObjectId(childId) } }
        );
        return label;
    } 
    catch (error) {
        console.error(error);
        throw error;
    }
}

// delete a label
const deleteLabel = async (id, parentId) => {

    let res = await Label.deleteOne({_id: new mongoose.Types.ObjectId(id)});
    await _removeChild(parentId, id);
    await _deleteAllLabelsByParentId(id);

    return res.deletedCount;
}

// delete all labels by parentId
const _deleteAllLabelsByParentId = async (parentId) => {

    let labels = await Label.deleteMany({parentId: new mongoose.Types.ObjectId(parentId)});
    return labels;
}

// remove id from children array
const _removeChild = async (id, childId) => {
    console.log(id, childId);
    try {

        if(findLabelByID(id) === null) {
            throw new Error("Parent label not found!");
        }

        let label = await Label.updateOne(
            { _id: new mongoose.Types.ObjectId(id) },
            { $pull: { children: new mongoose.Types.ObjectId(childId) } }
        );
        return label;
    } 
    catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {
    createLabel,
    findLabelByID,
    findLabelByName,
    findLabelByNameAndParentId,
    getAllLabels,
    updateLabel,
    addChild,
    deleteLabel,
}