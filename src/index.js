const express = require('express');
const compression = require('compression');
const app = express();

// Settings of Port
app.set('port', process.env.PORT || 3000);

// Defining middlewares
app.use(express.json());
app.use(compression());
app.set('view engine', 'html');

// Static folder
app.use(express.static(__dirname + '/public'));
app.use('/:category', express.static(__dirname + '/public/index.html'));

// Routes
app.use('/api', require('./routes/index'));

// Listening to port
app.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'));
});

module.exports = app;