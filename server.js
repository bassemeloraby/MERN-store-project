const express = require('express');
const cors = require('cors')
const colors = require('colors');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');


const app = express();
const path = require('path');
const { logger } = require('./middleware/logger');
const PORT = process.env.PORT || 3500;
app.use(logger);
app.use(express.json());
app.use(cors());

app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/root'));

app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ message: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

//Connect to the database before listening
connectDB().then(() => {
  app.listen(PORT, (err) => {
    if (err) throw err;
    console.log('Server listening on port'.red, PORT.yellow);
  });
});