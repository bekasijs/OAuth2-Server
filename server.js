require('dotenv').config();
const logger = require('./src/lib/Logging');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const express = require('express');
const morgan = require('morgan');
const config = require('config');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

const InitMONGODB = require('./src/adapters/mongodb');

const app = express();
const protection = csrf({ cookie: true });

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
// app.use(passport.initialize())
app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'pug');
app.disable('x-powered-by');

global.appRoot = require('app-root-path').require;

InitMONGODB((error, db) => {

  if (error) throw error;

  app.use('/oauth', require('./src/routes')(db));
  app.use('*', (req, res, next) => {
    let error = new Error();
    error.statusCode = 404;
    error.name = 'NotFound';
    error.message = `${req.baseUrl} - Not Found`;
    res.status(404).json(error);
  });

  app.use((error, req, res, next) => {
    if (error) {
      console.log(error);
      logger.error(error);
      res.status(error.code ? error.code : error.statusCode ? error.statusCode : 400).json(error);
    }
  });

  app.listen(config.get('port'), () => {
    console.info(`Server running at port ${config.get('port')}`);
  });

});