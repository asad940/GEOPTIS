var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// API routes
app.use('/api/restaurants', require('./routes/restaurants'));

// Serve Vue build
app.use(express.static(path.join(__dirname, 'public')));

// SPA fallback — toutes les routes non-API renvoient index.html
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;
