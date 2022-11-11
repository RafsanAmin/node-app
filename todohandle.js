const express = require('express');
const mongoose = require('mongoose');
const todoModel = require('./schema/TodoSchema');
const userModel = require('./schema/UserSchema');
const jwt = require('jsonwebtoken');
const thandle = express.Router();
const cookieParser = require('cookie-parser');

let user;
thandle.use(express.json());
thandle.use(cookieParser());
thandle.use(async (req, res, next) => {
  let cookie = req.cookies.jwt;
  let token;
  if (cookie == '' || cookie == null || cookie == undefined) {
    res.json({ auth: false, massage: 'User not Logged in' });
  } else {
    token = cookie;
    let authed = jwt.verify(token, '{s{MSX,,EL~8@h3:)4>ynKP~_N]+Go');

    await userModel.findOne({ _id: authed.data }, (err, data) => {
      if (err) {
        res.json({ massage: 'Auth Failed', add: false, exists: false });
      } else {
        user = { user: data._id };
        next();
      }
    });
  }
});

thandle.get('/alltd', async (req, res, next) => {
  await todoModel
    .find(user)
    .select({
      __v: 0,
    })
    .exec((err, data) => {
      if (err) {
        res.status(500).send('A server side error');
      } else {
        res.json({ todoid: data });
      }
    });
});

thandle.post('/add', async (req, res, next) => {
  try {
    let x = req.body;

    let todo = {
      ...x,
      user: user.user,
    };

    let newTodo = new todoModel(todo);
    let sTodo = await newTodo.save();

    console.log(sTodo);
    await userModel.findOneAndUpdate(user, {
      $push: {
        todos: sTodo._id,
      },
    });

    res.status(200).json({ added: true, massage: 'Todo Added', todoid: sTodo });
  } catch (err) {
    console.log(err);
  }
});

thandle.delete('/del', async (req, res, next) => {
  let search = req.body;
  await todoModel.findOneAndDelete(search, (err, data) => {
    if (err) {
      res.status(500).json({ done: false, massage: 'Server side Error!' });
    } else {
      res.status(200).json({ done: true, massage: 'Todo Deleted' });
    }
  });
});
thandle.put('/check', async (req, res, next) => {
  let search = {
    _id: req.body.tid,
  };
  let checked = false;
  if (req.body.checked == 'false') {
    checked = true;
  }
  console.log(`${checked}`);
  await todoModel.findOneAndUpdate(search, { checked: checked }, { new: true }, (err, data) => {
    if (err) {
      res.status(500).json({ done: false, massage: 'Server side Error!' });
    } else {
      res.status(200).json({ done: true, massage: 'Todo Checked' });
    }
  });
});
module.exports = thandle;
