let mongoose = require("mongoose");
mongoose.Promise = global.Promise;
require("dotenv").config();

const labelService = require("../services/labelManagementService");

// create a new label
const createLabel = async (req, res) => {

    let data = req.body;
    let status = 200;
    let errorMsg = null;

    try {

        // validate req data
        if (data.name === undefined || data.name === "") {
            status = 400;
            errorMsg = "Name is required!";
            console.log(errorMsg);
            res.status(status).json({
                error: true,
                errorMsg: errorMsg,
            });
        }

        // check if label with same name already exists in parent
        let label = await labelService.findLabelByNameAndParentId(data.name, data.parentId);
        if (label !== null) {
            status = 400;
            errorMsg = "Label with same name already exists!";
            console.log(errorMsg);
            res.status(status).json({
                error: true,
                errorMsg: errorMsg,
            });
        }

        let label_id = await labelService.createLabel(data);

        res.status(status).json({
            error: false,
            errorMsg: errorMsg,
            data: {
                id: label_id,
            }
        });
    }
    catch (err) {

        console.log(err);
        status = 500;
        errorMsg = "Internal server error!";
        res.status(status).json({
            error: true,
            errorMsg: errorMsg,
        });
    }
}


// find a label by id
const findLabelByID = async (req, res) => {

    let id = req.params.id;
    let status = 200;
    let errorMsg = null;

    try {

        let label = await labelService.findLabelByID(id);

        res.status(status).json({
            error: false,
            errorMsg: errorMsg,
            data: label,
        });
    }
    catch (err) {

        console.log(err);
        status = 500;
        errorMsg = "Internal server error!";
        res.status(status).json({
            error: true,
            errorMsg: errorMsg,
        });
    }
}

// get all labels
const getAllLabels = async (req, res) => {

    let status = 200;
    let errorMsg = null;

    try {

        let labels = await labelService.getAllLabels();

        res.status(status).json({
            error: false,
            errorMsg: errorMsg,
            label_count: labels.length,
            labels: labels,
        });
    }
    catch (err) {

        console.log(err);
        status = 500;
        errorMsg = "Internal server error!";
        res.status(status).json({
            error: true,
            errorMsg: errorMsg,
        });
    }
}

// update a label
const updateLabel = async (req, res) => {

    let id = req.params.id;
    let data = req.body;
    let status = 200;
    let errorMsg = null;

    try {

        await labelService.updateLabel(id, data);

        res.status(status).json({
            error: false,
            errorMsg: errorMsg,
        });
    }
    catch (err) {

        console.log(err);
        status = 500;
        errorMsg = "Internal server error!";
        res.status(status).json({
            error: true,
            errorMsg: errorMsg,
        });
    }
}

// delete a label
const deleteLabel = async (req, res) => {

    let id = req.params.id;
    let status = 200;
    let errorMsg = null;

    try {

        // check if label exists
        let label = await labelService.findLabelByID(id);
        if (label === null) {
            status = 400;
            errorMsg = "Label not found!";
            console.log(errorMsg);
            res.status(status).json({
                error: true,
                errorMsg: errorMsg,
            });
        }

        let del_count = await labelService.deleteLabel(id, label.parentId);

        if(del_count > 0) {
            res.status(status).json({
                error: false,
                errorMsg: errorMsg,
            });
        }

        status = 400;
        errorMsg = "Label not found!";
        console.log(errorMsg);
        res.status(status).json({
            error: true,
            errorMsg: errorMsg,
        });
    }
    catch (err) {

        console.log(err);
        status = 500;
        errorMsg = "Internal server error!";
        res.status(status).json({
            error: true,
            errorMsg: errorMsg,
        });
    }
}

module.exports = {
    createLabel,
    findLabelByID,
    getAllLabels,
    updateLabel,
    deleteLabel,
};
