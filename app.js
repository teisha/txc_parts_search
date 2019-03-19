const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');

const errorController = require('./controllers/error');
const adminRoutes = require('./routes/admin');
const partsRoutes = require('./routes/parts');

const app = express();
app.set('view engine','ejs');
app.set('views','views');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));

app.use('/admin',adminRoutes);
app.use(partsRoutes);


app.use(errorController.get404);



app.listen(3000);
