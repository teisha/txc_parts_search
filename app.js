const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
var options = {
    host: 'localhost',
    port: 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_SCHEMA
};
var sessionStore = new MySQLStore(options);

const errorController = require('./controllers/error');
const adminRoutes = require('./routes/admin');
const partsRoutes = require('./routes/parts');
const authRoutes = require('./routes/auth');

const app = express();
app.set('view engine','ejs');
app.set('views','views');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));
app.use(session({
    key: 'txc_inventory_cookie',
    secret: '<session_cookie_secret>',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

app.use('/admin',adminRoutes);
app.use(partsRoutes);
app.use(authRoutes);

app.use(errorController.get404);

app.use((req, res, next ) => {
  if (!req.session.user) {
  	return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
    	req.user = new User (user.user_id, 
    		user.username, 
    		user.first_name, 
    		user.last_name, 
    		user.phone_number, 
    		user.phone_extension
    		);
    	next();
    })
});

app.listen(process.env.PORT || 3000);
