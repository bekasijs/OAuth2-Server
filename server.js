require('dotenv').config();
const debug = require('debug')('AUTH_SERVER');
const morgan = require('morgan');
const logger = require('./src/lib/Logging');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

const InitMONGODB = require('./src/adapters/mongodb');
const { api} = require('./src/routes');
const { authenticateHandler } = require('./src/lib/OAuth');

const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));
app.use(morgan('combined', { stream: logger.stream }));

app.set('views', path.join(__dirname, 'src/view'));
app.set('view engine', 'pug');
app.disable('x-powered-by');

InitMONGODB((error, db) => {

  if (error) throw new Error(error);

  app.use('/oauth', api(db));
  app.use(morgan('combined', { stream: logger.stream }));
  app.use((error, req, res, next) => {
    if (error) res.status(error.code ? error.code : error.statusCode ? error.statusCode : 400).json(error);
    res.status(500).send(error);

  });

  app.listen(process.env.PORT, () => {
    debug(`Server running at port ${process.env.PORT}`);
  });

});

module.exports = app;