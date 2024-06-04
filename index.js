require('dotenv').config();

const express = require('express');
const server = express();

const connectMongoDB = require('./mongodb');

const fileController = require('./controllers/fileController');
const authController = require('./controllers/authController');

const upload = require('./middleware/upload');

const PORT = process.env.PORT || 5000;

server.use(express.json());
server.use('/uploads', express.static('uploads'));

server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

connectMongoDB();

server.post('/files', upload.single('document'), fileController.uploadFile);
server.post('/files/:id', fileController.editFile);
server.delete('/files/:id/:document', fileController.deleteFile);
server.get('/files', fileController.getFiles);

server.post('/users', authController.signupUser);
server.post('/sessions', authController.loginUser);
//server.get('/users/:username', authController.getUser);

server.listen(PORT, (err) => err ? console.log(err) : console.log(`Listening port ${PORT}`));