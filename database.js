var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "tanni2003",
    multipleStatements: true,
    database: "vladb"
  });
  
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var q =  "CREATE TABLE qrlink (id int, tableid int NOT NULL AUTO_INCREMENT primary key);";
  con.query(q, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
});
  