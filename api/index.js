import { Request, Response } from 'express'

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const select = require('./select.js')
const insert = require('./insert.js')


// for parsing application/json
app.use(express.json())
// for parsing application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }))
app.use(express.urlencoded({ extended: true }));

// app.post('/test', (req, res) => res.send(req.body))
app.get('/select', select);  // index.vue
app.post('/insert', insert); // upload.vue


export default app