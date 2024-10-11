process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');

// environmental variables
require('dotenv').config();

// DB connection to test database
const conn = require('../../../db_connection');

const Label = require('../../../models/label');
const {
    createLabel,
    findLabelByID,
    findLabelByName,
    findLabelByNameAndParentId,
    getAllLabels,
    updateLabel,
    addChild,
    deleteLabel,
} = require('../../../services/labelManagementService');

describe("Database access methods for labels", () => {

    beforeAll(async () => {

        // connect to mongodb and listen

        try {
            await conn.connect();
        }
        catch (err) {
            console.log(err);
        }
    });

    afterAll(async () => {

        // close DB connection

        try {
            await conn.close();
        }
        catch (err) {
            console.log(err);
        }
    });

    describe("createLabel - Save a label to the database", () => {

        it("should return an error with name field for already exsisting label name", async () => {

            const mockLabelName = "label1";
            const mockLabel = {
                "name": mockLabelName,
                "parentId": null
            };

            try {
                const result = await createLabel(mockLabel);
            }
            catch (err) {
                expect(err.keyValue).toEqual({ name: 'label1' });
            }
        });

        it("should return the created label for a new label name", async () => {

            const mockLabelName = "label2";
            const mockLabel = {
                "name": mockLabelName,
                "parentId": null
            };

            try {
                const result = await createLabel(mockLabel);
                expect(result.name).toEqual(mockLabelName);
            }
            catch (err) {
                console.log(err);
            }
        });
    });

    describe("findLabelByID - Find a label by ID", () => {

        it("should return the label for a valid label ID", async () => {

            const mockLabelName = "label3";
            const mockLabel = {
                "name": mockLabelName,
                "parentId": null
            };

            try {
                const createdLabel = await createLabel(mockLabel);
                const result = await findLabelByID(createdLabel._id);
                expect(result.name).toEqual(mockLabelName);
            }
            catch (err) {
                console.log(err);
            }
        });

        it("should return null for an invalid label ID", async () => {

            const mockInvalidLabelID = "60e1f1d8b1e8f3e5f8b8b8b8";

            try {
                const result = await findLabelByID(mockInvalidLabelID);
                expect(result).toEqual(null);
            }
            catch (err) {
                console.log(err);
            }
        });
    });

    describe("findLabelByName - Find a label by name", () => {

        it("should return the label for a valid label name", async () => {

            const mockLabelName = "label4";
            const mockLabel = {
                "name": mockLabelName,
                "parentId": null
            };

            try {
                const createdLabel = await createLabel(mockLabel);
                const result = await findLabelByName(mockLabelName);
                expect(result.name).toEqual(mockLabelName);
            }
            catch (err) {
                console.log(err);
            }
        });

        it("should return null for an invalid label name", async () => {

            const mockInvalidLabelName = "label5";

            try {
                const result = await findLabelByName(mockInvalidLabelName);
                expect(result).toEqual(null);
            }
            catch (err) {
                console.log(err);
            }
        });
    });

    describe("findLabelByNameAndParentId - Find a label by name and parent ID", () => {

        it("should return the label for a valid label name and parent ID", async () => {

            const mockLabelName = "label6";
            const mockLabel = {
                "name": mockLabelName,
                "parentId": null
            };

            try {
                const createdLabel = await createLabel(mockLabel);
                const result = await findLabelByNameAndParentId(mockLabelName, null);
                expect(result.name).toEqual(mockLabelName);
            }
            catch (err) {
                console.log(err);
            }
        });

        it("should return null for an invalid label name and parent ID", async () => {

            const mockInvalidLabelName = "label7";
            const mockInvalidParentId = "60e1f1d8b1e8f3e5f8b8b8b8";

            try {
                const result = await findLabelByNameAndParentId(mockInvalidLabelName, mockInvalidParentId);
                expect(result).toEqual(null);
            }
            catch (err) {
                console.log(err);
            }
        });
    });

    describe("getAllLabels - Get all labels in the database", () => {

        it("should return an array of all labels in the database", async () => {

            try {
                const result = await getAllLabels();
                expect(result).toBeInstanceOf(Array);
            }
            catch (err) {
                console.log(err);
            }
        });
    });

    describe("updateLabel - Update a label in the database", () => {

        it("should return the updated label for a valid label ID", async () => {

            const mockLabelName = "label8";
            const mockLabel = {
                "name": mockLabelName,
                "parentId": null
            };

            try {
                const createdLabel = await createLabel(mockLabel);
                const updatedLabel = {
                    "name": "label9",
                    "parentId": null
                };
                const result = await updateLabel(createdLabel._id, updatedLabel);
                expect(result.name).toEqual("label9");
            }
            catch (err) {
                console.log(err);
            }
        });

        it("should return null for an invalid label ID", async () => {

            const mockInvalidLabelID = "60e1f1d8b1e8f3e5f8b8b8b8";
            const updatedLabel = {
                "name": "label10",
                "parentId": null
            };

            try {
                const result = await updateLabel(mockInvalidLabelID, updatedLabel);
                expect(result).toEqual(null);
            }
            catch (err) {
                console.log(err);
            }
        });
    });

    describe("addChild - Add a child to a label in the database", () => {

        it("should return the updated label for a valid label ID", async () => {

            const mockLabelName = "label11";
            const mockLabel = {
                "name": mockLabelName,
                "parentId": null
            };

            try {
                const createdLabel = await createLabel(mockLabel);
                const childLabelName = "childLabel1";
                const childLabel = {
                    "name": childLabelName,
                    "parentId": createdLabel._id
                };
                const result = await addChild(createdLabel._id, childLabel);
                expect(result.children[0].name).toEqual(childLabelName);
            }
            catch (err) {
                console.log(err);
            }
        });

        it("should return null for an invalid label ID", async () => {

            const mockInvalidLabelID = "60e1f1d8b1e8f3e5f8b8b8b8";
            const childLabelName = "childLabel2";
            const childLabel = {
                "name": childLabelName,
                "parentId": mockInvalidLabelID
            };

            try {
                const result = await addChild(mockInvalidLabelID, childLabel);
                expect(result).toEqual(null);
            }
            catch (err) {
                console.log(err);
            }
        });
    });

    describe("deleteLabel - Delete a label from the database", () => {

        it("should return the deleted label for a valid label ID", async () => {

            const mockLabelName = "label12";
            const mockLabel = {
                "name": mockLabelName,
                "parentId": null
            };

            try {
                const createdLabel = await createLabel(mockLabel);
                const result = await deleteLabel(createdLabel._id);
                expect(result.name).toEqual(mockLabelName);
            }
            catch (err) {
                console.log(err);
            }
        });

        it("should return null for an invalid label ID", async () => {

            const mockInvalidLabelID = "60e1f1d8b1e8f3e5f8b8b8b8";

            try {
                const result = await deleteLabel(mockInvalidLabelID);
                expect(result).toEqual(null);
            }
            catch (err) {
                console.log(err);
            }
        });
    });
});
