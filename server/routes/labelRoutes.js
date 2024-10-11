const express = require('express');

const labelController = require('../controllers/labelController');

const router = express.Router();

// create a new label
router.post('/create', labelController.createLabel);

// get all labels
router.get('/getAll', labelController.getAllLabels);

// find a label by id
router.get('/find/:id', labelController.findLabelByID);

// update a label
router.put('/update/:id', labelController.updateLabel);

// delete a label
router.delete('/delete/:id', labelController.deleteLabel);

module.exports = router;