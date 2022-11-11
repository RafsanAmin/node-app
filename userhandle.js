const express = require("express");
const mongoose = require("mongoose");
const userModel = require("./schema/UserSchema");
const bcr = require("bcrypt");
const jwt = require("jsonwebtoken");
const uhandle = express.Router();
const cookieParser = require("cookie-parser");

uhandle.use(cookieParser());
uhandle.use("/signup", async (req, res, next) => {
  await userModel.find(
    { username: req.body.username.toLowerCase() },
    (err, data) => {
      if (err) {
        res.json({ massage: "Add failed", add: false, exists: false });
      } else if (data.length > 0) {
        res.json({ massage: "User exists", add: false, exists: true });
      } else {
        next();
      }
    },
  );
});

uhandle.get("/authen", async (req, res) => {
  let cookie = req.cookies.jwt;
  let token;
  if (cookie == "" || cookie == null || cookie == undefined) {
    res.json({ auth: false, massage: "User not Logged in" });
  } else {
    token = cookie;
    let authed = jwt.verify(token, "{s{MSX,,EL~8@h3:)4>ynKP~_N]+Go");

    await userModel
      .findOne({ _id: authed.data })
      .populate("todos")
      .exec((err, data) => {
        if (err) {
          res.json({ massage: "Auth Failed", add: false, exists: false });
        } else {
          let sent = {
            username: data.username,
            email: data.email,
            todos: data.todos,
          };
          res.json({
            massage: "User exists",
            add: false,
            exists: true,
            data: sent,
          });
        }
      });
  }
});
uhandle.post("/signup", async (req, res, next) => {
  let hPass = await bcr.hash(req.body.password, 10);
  let newUser = {
    username: req.body.username.toLowerCase(),
    email: req.body.email,
    password: hPass,
    todos: req.body.todos,
  };
  let x = new userModel(newUser);
  await x.save((err) => {
    if (err) {
      res.json({ massage: "Add failed", add: false });
    } else {
      res.json({ massage: "Added", add: true });
    }
  });
});
uhandle.delete("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.json({ done: true });
});
uhandle.get("/login", async (req, res) => {
  let user = {
    username: req.query.username.toLowerCase(),
  };
  await userModel.findOne(user, async (err, data) => {
    if (err) {
      res.json({
        massage: "Authentication Failed",
        done: false,
        exists: false,
      });
    } else if (data == null) {
      res.json({ massage: "User Doesn't Exists", done: false, exists: false });
    } else {
      let passm = await bcr.compare(req.query.password, data.password);
      if (passm) {
        let scrt = jwt.sign(
          { data: data.id },
          "{s{MSX,,EL~8@h3:)4>ynKP~_N]+Go",
        );
        res.cookie("jwt", scrt, {
          sameSite: "lax",
          secure: true,
          maxAge: 900000000,
          httpOnly: true,
        });
        res.json({ massage: "Login Success", done: true });
      } else {
        res.json({ massage: "Password is not correct!", done: false });
      }
    }
  });
});

module.exports = uhandle;
