var http = require("http");
var fs = require("fs");
var url = require("url");

const { report } = require("process");

var server = http.createServer((req, res) => {
  res.end("<h1>Hehe Boi!</h1>");
});

server.listen(2030, () => {
  console.log("Server started successfully!");
});
