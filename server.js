'use strict';

const app = require('express')();
const mongoose = require('mongoose');
const authRouter = require('./route/auth_router');

mongoose.connect('mongodb://localhost/dev_db');

app.use('/', authRouter);

app.use((err, req, res) => {
  res.status(500).json({message: err.message});
});

app.listen(5000);
