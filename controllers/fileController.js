const FileModel = require('../models/fileModel');
const path = require('path');
const fs = require('fs');

const uploadFile = (req, res) => {
    const fileData = req.body;
    const newFile = new FileModel(fileData);

    if (req.file) {
        newFile.document = req.file.filename;
        newFile.size = Math.ceil((req.file.size / 1024 / 1024) * 100) / 100;
    };

    newFile.save()
        .then(() => {
            res.status(201).json({ message: 'File uploaded successfully' });
        })
        .catch(error => {
            res.status(500).json({ message: 'Error uploading file', error: error });
        });
};

const editFile = (req, res) => {
    const { id } = req.params;
    const { newName, newDescription } = req.body;

    FileModel
        .findByIdAndUpdate(
            id, {
            name: newName,
            description: newDescription,
        }, {
            new: true,
        }
        )
        .then(() => {
            res.status(200).json({ message: 'File edited successfully' });
        })
        .catch(error => {
            res.status(500).json({ message: 'Error editing file', error: error });
        });
};

const deleteFile = (req, res) => {
    const fileId = req.params.id;
    const fileName = req.params.document;

    const filePath = path.join(__dirname, '../uploads', fileName);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return res.status(500).json({ message: 'Error deleting file', error: err });
        };
    });

    FileModel
        .findByIdAndDelete(fileId)
        .then(() => {
            res.status(200).json({ message: 'File deleted successfully' });
        })
        .catch((error) => {
            res.status(500).json({ message: 'Error deleting file', error: error });
        });
};

const getFiles = (req, res) => {
    FileModel
        .find()
        .then((files) => {
            if (files) {
                res.status(200).json(files);
            } else {
                res.status(404).json({ message: 'File not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ message: 'Error getting files', error: error });
        });
};

module.exports = { uploadFile, editFile, deleteFile, getFiles };