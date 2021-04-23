const express = require('express');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
let Router = express.Router();

const groupController = require('../controllers/group.controller');

let initGroupAPI = (app) => {
	Router.post(
		'/create',
		upload.single('image'),
		groupController.createNewGroup
	);

	Router.get('/get-all', groupController.getAllGroups);
	Router.get('/:path', groupController.getGroupCollections);
	return app.use('/api/group', Router);
};

module.exports = initGroupAPI;
