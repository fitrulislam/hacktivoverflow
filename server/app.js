const express = require('express');
require ('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');

const app = express();

const mongoose = require('mongoose');
const url = 'mongodb://admin:admin@ds255889.mlab.com:55889/ouverflow';
mongoose.connect(url, (err) => {
  if(!err) console.log('connected to database');
  else throw new Error(err);
})
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({entended:false}));
app.use(morgan('dev'));
app.use(cors());

app.get('/', (req,res) => {
  res.send('Home');
});

app.use('/question', require('./routes/question.js'));
app.use('/answer', require('./routes/answer.js'));

app.listen(port,()=>{
  console.log(`App running in ${port}`);
});
