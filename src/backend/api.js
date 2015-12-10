var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

var common = require('common');
var db = common.pgsql;

var api = express();

// Allow CORS
api.use(cors());
api.options('*', cors());

// Check token as auth.
api.use(common.auth.middleware);

// Parse JSON request bodies.
api.use(bodyParser.json());


module.exports = api;
