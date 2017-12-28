const express = require('express');
const app = express();
var port = process.env.PORT || 8090;
var domain = "https://uasniffer.herokuapp.com";
var router = express.Router();
var parser = require('ua-parser-js');
var bodyParser = require('body-parser');
var dateFormat = require('dateformat');
var chalk = require('chalk');

// var serverConfig;
// try {
//   serverConfig = require("./server.json");
//   if (serverConfig) {
//     console.log("Configuration Loaded");
//     console.log(serverConfig);
//   }
//   domain = serverConfig.domain || domain;
//   port = serverConfig.port || port;
// } catch (e) {
//   if (e instanceof Error && e.code === "MODULE_NOT_FOUND")
//     serverConfig = null;
//   else
//     throw e;
// }

var serverInfo = {
  expressVersion: require('express/package').version,
  port: port,
  upTime: dateFormat(Date.now(), "dd/mm/yyyy H:MM:ss TT"),
  message: `server is listening ${domain}:${port}`,
}

//Server applications supports
app.use(bodyParser.json()); // JSON encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // URL encoded bodies

//Middleware
app.use(function (req, res, next) {
  console.log("\r");
  var d = dateFormat(Date.now(), "dd/mm/yyyy H:MM:ss TT");
  console.log(d + ": " + req.method + " " + req.url);
  var interceptObj = function (obj, key) { if (obj && Object.keys(obj).length > 0) { console.log(key, obj); } }
  interceptObj(req.query, "query");
  interceptObj(req.params, "params");
  interceptObj(req.body, "body");
  next();  // Passing the request to the next handler in the stack.
});

// serve static files from template
app.use(express.static(__dirname + '/public'));

var printDate = function () {
  console.log(dateFormat(new Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT"));
}

//POST Requests
router.post("/parse", function (request, response) {
  console.log("\r\n");
  var res = new parser.UAParser(request.body.ua).getResult();
  printDate();
  console.log("Given UA:", request.body.ua);
  console.log("Parsed UA:", new parser.UAParser(request.body.ua).getResult());
  printDate();
  response.send(res);
});
app.use("/ua", router);

//GET Requests
app.get('/server', function (req, res) {
  res.send(serverInfo);
})

app.get('/', (request, response) => {
  response.send(serverInfo.message);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// Error Handler (define as the last app.use callback)
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  if (err.status !== 200) {
    console.log(chalk.red(err.status + " (" + err.message + ")"));
  }
  res.send(err.message);
});

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened!', err)
  }
  console.log(serverInfo.message);
});

