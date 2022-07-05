const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const path = require('path');

require('./config/env.config');
require('./config/db.config');
const { helmetOptions, corsOptions } = require('./config/options.config');

const { userRoutes, sauceRoutes } = require('./routes');
const { auth, errorHandler } = require('./middlewares');

const app = express();

app.use(helmet(helmetOptions));
app.use(cors(corsOptions));
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, '../public/images')));

app.use('/api/auth/', userRoutes);
app.use('/api/sauces/', auth, sauceRoutes);

app.use(errorHandler);

app.get('/', (request, response) => response.json({ message: "Hello world!" }));
app.get('/api', (request, response) => response.json({ message: "Hot Takes Rest API" }));

module.exports = app;
