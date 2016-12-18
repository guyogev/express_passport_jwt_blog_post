// *** main dependencies *** //
import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import passport from 'passport';
import csrf from 'csurf';

// *** routes *** //
import routes from './routes/index.js';

// *** express instance *** //
let app = express();

// *** view engine *** //
app.set('view engine', 'ejs');

// *** static directory *** //
app.set('views', path.join(__dirname, 'views'));

// *** config middleware *** //
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client')));

// app.use(csrf({cookie: true}));
// app.use((req, res, next) => {
//   res.cookie('XSRF-TOKEN', req.csrfToken());
//   next();
// });

require('./config/passport_strategies')(app);

const jwt_authentication = passport.authenticate('jwt');
const password_authentication = passport.authenticate('by_password');

// *** main routes *** //
app.use('/', routes);
app.use('/authenticate', password_authentication, routes);
app.use('/secoured', jwt_authentication, routes);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// *** error handlers *** //

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

export default app;