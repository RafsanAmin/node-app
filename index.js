const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const uh = require('./userhandle');
const th = require('./todohandle');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 4000;
const app = express();

app.use('/todos', express.static(__dirname + '/public'));
mongoose
  .connect(
    'mongodb+srv://RafsanDB:S91CgoOUASdVh2x4@cluster0.8nke7.mongodb.net/MyDB?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }
  )
  .then(() => {
    console.log('Connected');
  })
  .catch((err) => {
    console.log(err);
  });

app.use(
  cors({
    origin: ['http://localhost:5500', 'https://rafsanamin.epizy.com'],
    credentials: true,
  })
);

app.set('trust proxy', 1);
app.use(cookieParser());
app.use(express.json());
app.use('/auth', uh);
app.use('/todo', th);

app.get('/', (req, res) => {
  res.send(`Hi`);
});

app.listen(port, () => {
  console.log(`App listening at ${port}`);
});
