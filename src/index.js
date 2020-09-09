const express = require('express');
const compression = require('compression');
const app = express();

// Settings of Port
app.set('port', process.env.PORT || 3000);

// Defining middlewares
app.use(express.json());
app.use(compression());

// Static folder
app.use(express.static(__dirname + '/public'));

// Routes
app.use('/api', require('./routes/index'));

// Listening to port
app.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'));
});

module.exports = app;