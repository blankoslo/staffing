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

api.post('/staffings', (req, res) => {
    var data = req.body;
    if (!data.employee || !data.customer || !data.project
            || !data.from || !data.to) {
        return res.sendStatus(400);
    }

    var q = 'INSERT INTO staffings(employee, customer, project, from_ts, to_ts)'
           +'VALUES ($1, $2, $3, $4, $5) RETURNING *'
    db.singleQuery(q,
            [data.employee, data.customer, data.project, data.from, data.to])
        .then(
            (qRes) => res.json(qRes.rows[0]),
            (err) => res.status(500).send(err.toString())
        );
});

api.get('/staffings', (req, res) => {
    var data = req.query;

    var whereq = [];
    var params = [];
    if (data.employee) {
        whereq.push('employee = $' + params.push(data.employee));
    }

    if (data.customer) {
        whereq.push('customer = $' + params.push(data.customer));
    }

    if (data.project) {
        whereq.push('project = $' + params.push(data.project));
    }

    if (data.from) {
        whereq.push('from_ts >= $' + params.push(data.from));
    }

    if (data.to) {
        whereq.push('to_ts <= $' + params.push(data.to));
    }

    var q = 'SELECT * FROM staffings';
    if (whereq.length > 0) {
        q += ' WHERE ' + whereq.join(',');
    }

    db.singleQuery(q, params)
        .then(
            (qRes) => res.json(qRes.rows),
            (err) => res.status(500).send(err.toString())
        );
});

api.put('/staffings/:id', (req, res) => {
    var data = req.body;

    var setq = [];
    var params = [];
    if (data.employee) {
        setq.push('employee = $' + params.push(data.employee));
    }

    if (data.customer) {
        setq.push('customer = $' + params.push(data.customer));
    }

    if (data.project) {
        setq.push('project = $' + params.push(data.project));
    }

    if (data.from) {
        setq.push('from_ts = $' + params.push(data.from));
    }

    if (data.to) {
        setq.push('to_ts = $' + params.push(data.to));
    }

    var q = 'UPDATE staffings';
    if (setq.length > 0) {
        q += ' SET ' + setq.join(',');
    }
    q += ' WHERE id = $' + params.push(req.params.id)
        +' RETURNING *';

    db.singleQuery(q, params)
        .then(
            (qRes) => res.json(qRes.rows[0]),
            (err) => res.status(500).send(err.toString())
        );
});

api.delete('/staffings/:id', (req, res) => {
    db.singleQuery('DELETE FROM staffings WHERE id = $1 RETURNING id',
            [req.params.id])
        .then(
            (qRes) => res.json(qRes.rows[0]),
            (err) => res.status(500).send(err.toString())
        );
});

module.exports = api;
