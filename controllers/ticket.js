const { response } = require("express");
var fs = require("fs");
var request = require("request");

//define certificate folder
var directory =
  "D:\\node-sql-project\\controllers\\certificates\\";

var proxyRestUri = "https://qlikdemo.polestarllp.com:4243/qps/virproxy/"; //qps
var targetUri = 'https://qlikdemo.polestarllp.com/virproxy/hub';

var get_ticket_redirect = function (callback) {
  var options = {
    uri: proxyRestUri + "ticket?xrfkey=1234567890dogcat",
    headers: {
      "content-type": "application/json",
      "X-Qlik-xrfkey": "1234567890dogcat",
      "X-Qlik-user": "UserDirectory=PSSL-QS-PRODUCT;UserId=qlikproductsdev",
    },
    method: "POST",
    body: {
      UserDirectory: "PSSL-QS-PRODUCT",
      UserId: "qlikproductsdev",
      Attributes: [],
    },
    json: true,
    ca: fs.readFileSync(directory + "root.pem"),
    key: fs.readFileSync(directory + "client_key.pem"),
    cert: fs.readFileSync(directory + "client.pem"),
    rejectUnauthorized: false,
  };

  request(options, function (error, response, body) {
    if (error) {
      console.log("Error: " + error);
      console.log(response);
    } else {
      console.log("== Got a ticket ==");
      console.log("Ticket: " + response.body.Ticket);
      console.log("TargetUri: " + proxyRestUri);
      callback( response.body.Ticket); // This is the redirect URL!
    }
  });
};

module.exports = {
  get_ticket_redirect: get_ticket_redirect,
};