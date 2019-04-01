var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var dashboardRouter = require('./routes/dashboard');
var adminPanelRouter = require('./routes/admin_panel');
var registerRouter = require('./routes/register');
var usersRouter = require('./routes/users');
// var bootstrapTestRouter = require('./routes/bootstrapTest');
var sprintsRouter = require('./routes/sprints');
var projectsRouter = require('./routes/projects');
var storiesRouter = require('./routes/stories');

var models = require('./models');

var User = models.User;


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 3600000} // 1h
}));
app.use(passport.initialize());
app.use(passport.session());
app.locals.moment = require('moment');


app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter);
app.use('/admin_panel', adminPanelRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/users', usersRouter);
app.use('/sprints', sprintsRouter);
// app.use('/bootstrapTest', bootstrapTestRouter);
app.use('/projects', projectsRouter);
app.use('/stories', storiesRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


// auth handler
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, function (username, password, done) {
    User.findByUsername(username).then(function (user) {
        if (!user || !User.comparePassword(password, user.password)) {
            console.log('user not found');
            return done(null, false, {error: 'Incorrect username and password combination.'});
        }
        if (!User.comparePassword(password, user.password)) {
            console.log('incorrect password');
            return done(null, false, {error: 'Incorrect username and password combination.'});
        }
        console.log('done');
        return done(null, user);
    }, function (err) {
        console.log('err', err);
        if (err) return done(null, false, {message: 'Incorrect username.'});
    })
}));

passport.serializeUser(function (user, done) {
    console.log('serializeUser');
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    console.log('deserializeUser', id);
    User.findById(id, function (err, user) {
        console.log('err', err);
        done(err, user);
    });
    User.findById(id).then(function (user) {
        console.log('success deserializeUser');
        done(null, user);
    }, function (err) {
        console.log('error deserializeUser');
        done(err, null);
    })
});

module.exports = app;
