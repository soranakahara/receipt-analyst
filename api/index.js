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

// post:オウム返し
app.post('/api/post', (req, res) => {
  res.send(req.body)
});

app.get('/select', select);
app.post('/insert', insert);
app.post('/test', (req, res) => res.send(req.body))


export default app